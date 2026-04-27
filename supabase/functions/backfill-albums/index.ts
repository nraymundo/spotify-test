// POST /functions/v1/backfill-albums
// One-shot: fills album_name + album_id for all plays that are missing them.
// Iterates active connections, refreshes each token, batches track lookups (50/req).
import { createClient, SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2";

const SPOTIFY_CLIENT_ID = "622441cd35fa43e383c923ce4d76f026";
const BATCH = 50;

Deno.serve(async () => {
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const { data: connections, error } = await supabase
    .from("connections")
    .select("spotify_user_id, refresh_token")
    .eq("status", "active");

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  const results = await Promise.allSettled(
    (connections ?? []).map((c) => backfillUser(supabase, c))
  );

  const summary = results.map((r, i) =>
    r.status === "fulfilled"
      ? { user: connections![i].spotify_user_id, ...r.value }
      : { user: connections![i].spotify_user_id, error: String(r.reason) }
  );

  return new Response(JSON.stringify(summary, null, 2), {
    headers: { "Content-Type": "application/json" },
  });
});

async function backfillUser(
  supabase: SupabaseClient,
  conn: { spotify_user_id: string; refresh_token: string }
) {
  // Refresh Spotify token
  const tokenRes = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: conn.refresh_token,
      client_id: SPOTIFY_CLIENT_ID,
    }),
  });
  if (!tokenRes.ok) throw new Error(`token refresh failed: ${await tokenRes.text()}`);
  const { access_token } = await tokenRes.json();

  // Fetch all plays missing album data
  const { data: plays, error } = await supabase
    .from("plays")
    .select("track_id")
    .eq("spotify_user_id", conn.spotify_user_id)
    .is("album_id", null);

  if (error) throw new Error(`fetch plays failed: ${error.message}`);
  if (!plays?.length) return { updated: 0 };

  const uniqueTrackIds = [...new Set(plays.map((p) => p.track_id))];
  console.log(`${conn.spotify_user_id}: ${uniqueTrackIds.length} unique tracks to backfill`);

  let updated = 0;

  for (let i = 0; i < uniqueTrackIds.length; i += BATCH) {
    const batch = uniqueTrackIds.slice(i, i + BATCH);
    const tracksRes = await fetch(
      `https://api.spotify.com/v1/tracks?ids=${batch.join(",")}`,
      { headers: { Authorization: `Bearer ${access_token}` } }
    );
    if (!tracksRes.ok) throw new Error(`tracks fetch failed: ${tracksRes.status}`);

    const { tracks } = await tracksRes.json();

    await Promise.all(
      (tracks ?? []).map((track: any) => {
        if (!track?.album) return Promise.resolve();
        return supabase
          .from("plays")
          .update({
            album_name: track.album.name,
            album_id: track.album.id,
          })
          .eq("spotify_user_id", conn.spotify_user_id)
          .eq("track_id", track.id)
          .is("album_id", null);
      })
    );

    updated += batch.length;
    console.log(`${conn.spotify_user_id}: backfilled ${Math.min(i + BATCH, uniqueTrackIds.length)}/${uniqueTrackIds.length}`);
  }

  return { updated };
}
