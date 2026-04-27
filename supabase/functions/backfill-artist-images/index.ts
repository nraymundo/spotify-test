// POST /functions/v1/backfill-artist-images
// One-time job: finds all plays missing artist_image_url, searches Spotify
// by artist name, and writes the image URL back. Safe to run multiple times.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SPOTIFY_CLIENT_ID = "622441cd35fa43e383c923ce4d76f026";

Deno.serve(async () => {
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  // Grab one active connection so we have a token to search with.
  const { data: conn, error: connErr } = await supabase
    .from("connections")
    .select("spotify_user_id, refresh_token")
    .eq("status", "active")
    .limit(1)
    .single();

  if (connErr || !conn) {
    return json({ error: "no active connection" }, 400);
  }

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
    return json({ error: "token refresh failed" }, 500);
  }

  const { access_token: accessToken } = await refreshRes.json();

  // Distinct primary artist names that still need an image.
  const { data: rows, error: rowsErr } = await supabase
    .from("plays")
    .select("artist_names, artist_id")
    .is("artist_image_url", null);

  if (rowsErr) return json({ error: rowsErr.message }, 500);

  // Build a map of artist_id → name (prefer ID lookup; fall back to name search).
  const byId = new Map<string, string>();   // id → name
  const byName = new Set<string>();         // names without a known ID

  for (const row of rows ?? []) {
    const name = row.artist_names?.[0];
    if (!name) continue;
    if (row.artist_id) byId.set(row.artist_id, name);
    else byName.add(name);
  }

  const imageMap = new Map<string, string>(); // artist_name → image_url

  // --- Batch-fetch by ID (up to 50 at a time) ---
  const idChunks = chunk([...byId.keys()], 50);
  for (const ids of idChunks) {
    const res = await fetch(
      `https://api.spotify.com/v1/artists?ids=${ids.join(",")}`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    if (!res.ok) continue;
    const { artists } = await res.json();
    for (const artist of artists ?? []) {
      const img = artist.images?.[0]?.url ?? artist.images?.[1]?.url;
      const name = byId.get(artist.id);
      if (img && name) imageMap.set(name, img);
    }
  }

  // --- Search by name for plays with no stored ID ---
  for (const name of byName) {
    const res = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(name)}&type=artist&limit=1`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    if (!res.ok) continue;
    const data = await res.json();
    const artist = data.artists?.items?.[0];
    if (!artist) continue;
    const img = artist.images?.[0]?.url ?? artist.images?.[1]?.url;
    if (img) imageMap.set(name, img);
  }

  // Write image URLs back to all matching plays.
  let updated = 0;
  for (const [name, imageUrl] of imageMap) {
    const { count } = await supabase
      .from("plays")
      .update({ artist_image_url: imageUrl })
      .is("artist_image_url", null)
      .contains("artist_names", [name]);
    updated += count ?? 0;
  }

  return json({ artists_resolved: imageMap.size, plays_updated: updated });
});

function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
