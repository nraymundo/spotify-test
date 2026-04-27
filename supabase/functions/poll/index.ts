// POST /functions/v1/poll
// Triggered by pg_cron every 5 minutes. Iterates active connections,
// refreshes each user's access token, fetches recently-played, inserts new plays.
import { createClient, SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2";

const SPOTIFY_CLIENT_ID = "622441cd35fa43e383c923ce4d76f026";

interface Connection {
  spotify_user_id: string;
  refresh_token: string;
  last_polled_at: string | null;
}

Deno.serve(async () => {
  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: connections, error } = await supabase
      .from("connections")
      .select("spotify_user_id, refresh_token, last_polled_at")
      .eq("status", "active");

    if (error) {
      console.error("connections query failed:", error.message);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    console.log(`polling ${(connections ?? []).length} active connection(s)`);

    const results = await Promise.allSettled(
      (connections ?? []).map((c) => pollUser(supabase, c))
    );

    for (const r of results) {
      if (r.status === "rejected") console.error("pollUser rejected:", r.reason);
    }

    return new Response(
      JSON.stringify({
        polled: results.length,
        succeeded: results.filter((r) => r.status === "fulfilled").length,
        failed: results.filter((r) => r.status === "rejected").length,
      }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("poll top-level error:", err);
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});

async function pollUser(supabase: SupabaseClient, conn: Connection) {
  console.log(`refreshing token for ${conn.spotify_user_id}`);

  const refreshRes = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: conn.refresh_token,
      client_id: SPOTIFY_CLIENT_ID,
    }),
  });

  if (!refreshRes.ok) {
    const body = await refreshRes.text();
    if (body.includes("invalid_grant")) {
      await supabase
        .from("connections")
        .update({ status: "needs_reauth" })
        .eq("spotify_user_id", conn.spotify_user_id);
    }
    throw new Error(`refresh failed for ${conn.spotify_user_id}: ${body}`);
  }

  const tokenData = await refreshRes.json();
  const accessToken = tokenData.access_token as string;

  if (tokenData.refresh_token && tokenData.refresh_token !== conn.refresh_token) {
    await supabase
      .from("connections")
      .update({ refresh_token: tokenData.refresh_token })
      .eq("spotify_user_id", conn.spotify_user_id);
  }

  const afterParam = conn.last_polled_at
    ? `&after=${new Date(conn.last_polled_at).getTime()}`
    : "";
  const playsRes = await fetch(
    `https://api.spotify.com/v1/me/player/recently-played?limit=50${afterParam}`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );

  if (!playsRes.ok) {
    throw new Error(`recently-played failed for ${conn.spotify_user_id}: ${playsRes.status}`);
  }

  const playsData = await playsRes.json();
  const items: any[] = playsData.items ?? [];

  console.log(`${conn.spotify_user_id}: ${items.length} new play(s)`);

  const playRows = items.map((item: any) => ({
    spotify_user_id: conn.spotify_user_id,
    track_id: item.track.id,
    track_name: item.track.name,
    artist_names: item.track.artists.map((a: any) => a.name),
    album_image_url: item.track.album.images[0]?.url ?? null,
    album_name: item.track.album.name ?? null,
    album_id: item.track.album.id ?? null,
    artist_id: item.track.artists[0]?.id ?? null,
    played_at: item.played_at,
    duration_ms: item.track.duration_ms,
  }));

  if (playRows.length > 0) {
    const { error: upsertError } = await supabase
      .from("plays")
      .upsert(playRows, { onConflict: "spotify_user_id,played_at", ignoreDuplicates: true });

    if (upsertError) console.error("upsert error:", upsertError.message);

    // Enrich artist images in parallel instead of sequentially.
    const artistIds = [...new Set(playRows.map((r) => r.artist_id).filter(Boolean))];
    if (artistIds.length > 0) {
      const artistRes = await fetch(
        `https://api.spotify.com/v1/artists?ids=${artistIds.join(",")}`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      if (artistRes.ok) {
        const artistData = await artistRes.json();
        await Promise.all(
          (artistData.artists ?? []).map((artist: any) => {
            const img = artist.images?.[0]?.url ?? artist.images?.[1]?.url ?? null;
            if (!img) return Promise.resolve();
            return supabase
              .from("plays")
              .update({ artist_image_url: img })
              .eq("spotify_user_id", conn.spotify_user_id)
              .eq("artist_id", artist.id)
              .is("artist_image_url", null);
          })
        );
      }
    }
  }

  await supabase
    .from("connections")
    .update({ last_polled_at: new Date().toISOString() })
    .eq("spotify_user_id", conn.spotify_user_id);

  console.log(`${conn.spotify_user_id}: done`);
}
