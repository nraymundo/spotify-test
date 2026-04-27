// GET /functions/v1/top?user_id=...&since=...
// Returns top artist and top track for a user derived from polled play data.
// Aggregates the plays table in JS — avoids needing a custom SQL function.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, content-type",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const url = new URL(req.url);
  const userId = url.searchParams.get("user_id");
  const since = url.searchParams.get("since");

  if (!userId) {
    return new Response(JSON.stringify({ error: "missing user_id" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  let query = supabase
    .from("plays")
    .select("track_id, track_name, artist_names, album_image_url, album_name, album_id, artist_image_url, duration_ms")
    .eq("spotify_user_id", userId);

  if (since) query = query.gte("played_at", since);

  const { data, error } = await query;
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const plays = data ?? [];

  // Aggregate by primary artist name
  const artistMap = new Map<string, { plays: number; totalMs: number; artistImageUrl: string | null; albumImageUrl: string | null }>();
  for (const play of plays) {
    const artist = play.artist_names?.[0];
    if (!artist) continue;
    const prev = artistMap.get(artist) ?? { plays: 0, totalMs: 0, artistImageUrl: null, albumImageUrl: null };
    artistMap.set(artist, {
      plays: prev.plays + 1,
      totalMs: prev.totalMs + play.duration_ms,
      artistImageUrl: prev.artistImageUrl ?? play.artist_image_url ?? null,
      albumImageUrl: prev.albumImageUrl ?? play.album_image_url ?? null,
    });
  }

  let topArtist: { name: string; plays: number; minutes: number; artistImageUrl: string | null } | null = null;
  for (const [name, s] of artistMap) {
    if (!topArtist || s.plays > topArtist.plays) {
      topArtist = { name, plays: s.plays, minutes: Math.round(s.totalMs / 60000), artistImageUrl: s.artistImageUrl ?? s.albumImageUrl };
    }
  }

  // Aggregate by track id
  const trackMap = new Map<string, { name: string; artist: string; albumImageUrl: string | null; plays: number; totalMs: number }>();
  for (const play of plays) {
    const prev = trackMap.get(play.track_id) ?? {
      name: play.track_name,
      artist: play.artist_names?.[0] ?? "",
      albumImageUrl: play.album_image_url,
      plays: 0,
      totalMs: 0,
    };
    trackMap.set(play.track_id, { ...prev, plays: prev.plays + 1, totalMs: prev.totalMs + play.duration_ms });
  }

  let topTrack: { id: string; name: string; artist: string; albumImageUrl: string | null; plays: number; minutes: number } | null = null;
  for (const [id, t] of trackMap) {
    if (!topTrack || t.plays > topTrack.plays) {
      topTrack = { id, name: t.name, artist: t.artist, albumImageUrl: t.albumImageUrl, plays: t.plays, minutes: Math.round(t.totalMs / 60000) };
    }
  }

  // Aggregate by album id
  const albumMap = new Map<string, { name: string; albumImageUrl: string | null; plays: number; totalMs: number }>();
  for (const play of plays) {
    if (!play.album_id) continue;
    const prev = albumMap.get(play.album_id) ?? {
      name: play.album_name ?? "",
      albumImageUrl: play.album_image_url ?? null,
      plays: 0,
      totalMs: 0,
    };
    albumMap.set(play.album_id, { ...prev, plays: prev.plays + 1, totalMs: prev.totalMs + play.duration_ms });
  }

  let topAlbum: { id: string; name: string; albumImageUrl: string | null; plays: number; minutes: number } | null = null;
  for (const [id, a] of albumMap) {
    if (!topAlbum || a.plays > topAlbum.plays) {
      topAlbum = { id, name: a.name, albumImageUrl: a.albumImageUrl, plays: a.plays, minutes: Math.round(a.totalMs / 60000) };
    }
  }

  const topArtistsList = [...artistMap.entries()]
    .sort((a, b) => b[1].plays - a[1].plays)
    .map(([name, s], i) => ({
      rank: i + 1,
      name,
      plays: s.plays,
      minutes: Math.round(s.totalMs / 60000),
      artworkUrl: s.artistImageUrl ?? null,
    }));

  return new Response(
    JSON.stringify({ topArtist, topTrack, topAlbum, topArtistsList }),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );
});
