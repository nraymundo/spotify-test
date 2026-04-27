// GET /functions/v1/genres?user_id=...&since=...
// Derives top genres from polled play data.
// Maps Spotify micro-genres to broad buckets, then counts plays per genre.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SPOTIFY_CLIENT_ID = "622441cd35fa43e383c923ce4d76f026";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, content-type",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
};

// Ordered: first match wins. More specific patterns go before broad ones.
const GENRE_BUCKETS: [RegExp, string][] = [
  [/hip.?hop|rap|trap|drill|grime|phonk/i,               "hip-hop"],
  [/r&b|neo.?soul|rhythm.*blues/i,                       "r&b"],
  [/soul|funk/i,                                         "soul"],
  [/jazz|bossa|bebop|swing/i,                            "jazz"],
  [/classical|orchestra|baroque|symphon|opera/i,         "classical"],
  [/ambient|drone|new age|meditation/i,                  "ambient"],
  [/electronic|techno|house|edm|synth|chillwave|indietronica|idm|trance|dubstep/i, "electronic"],
  [/metal|hardcore|screamo|deathcore|doom/i,             "metal"],
  [/punk|emo/i,                                          "punk"],
  [/folk|americana|stomp|bluegrass|appalachian/i,        "folk"],
  [/country|outlaw/i,                                    "country"],
  [/reggae|ska|dub/i,                                    "reggae"],
  [/latin|salsa|cumbia|reggaeton|bachata/i,              "latin"],
  [/singer.songwriter|confessional/i,                    "singer-songwriter"],
  [/rock|grunge|alternative|garage|shoegaze|post.rock/i, "rock"],
  [/indie/i,                                             "indie"],
  [/pop/i,                                               "pop"],
];

function normalize(spotifyGenre: string): string {
  for (const [pattern, bucket] of GENRE_BUCKETS) {
    if (pattern.test(spotifyGenre)) return bucket;
  }
  return spotifyGenre;
}

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

  // Sum listening time per artist within the time range
  let query = supabase
    .from("plays")
    .select("artist_names, duration_ms")
    .eq("spotify_user_id", userId);
  if (since) query = query.gte("played_at", since);

  const { data: plays, error: playsError } = await query;
  if (playsError) {
    return new Response(JSON.stringify({ error: playsError.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const artistMs = new Map<string, number>();
  for (const play of plays ?? []) {
    const artist = play.artist_names?.[0];
    if (!artist) continue;
    artistMs.set(artist, (artistMs.get(artist) ?? 0) + (play.duration_ms ?? 0));
  }

  const topArtists = Array.from(artistMs.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  if (topArtists.length === 0) {
    return new Response(JSON.stringify({ genres: [] }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // Get a fresh Spotify access token from the stored refresh token
  const { data: conn } = await supabase
    .from("connections")
    .select("refresh_token")
    .eq("spotify_user_id", userId)
    .single();

  if (!conn?.refresh_token) {
    return new Response(JSON.stringify({ error: "no connection found" }), {
      status: 404,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const tokenRes = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: conn.refresh_token,
      client_id: SPOTIFY_CLIENT_ID,
    }),
  });

  if (!tokenRes.ok) {
    return new Response(JSON.stringify({ error: "spotify token refresh failed" }), {
      status: 502,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const tokenData = await tokenRes.json();
  const accessToken = tokenData.access_token as string;

  if (tokenData.refresh_token && tokenData.refresh_token !== conn.refresh_token) {
    await supabase
      .from("connections")
      .update({ refresh_token: tokenData.refresh_token })
      .eq("spotify_user_id", userId);
  }

  // Search Spotify for each artist to get their genres, then add that artist's
  // listening time to every genre bucket they belong to. Running in small batches
  // avoids hitting Spotify's rate limit.
  const bucketMs = new Map<string, number>();

  for (let i = 0; i < topArtists.length; i += 3) {
    await Promise.all(
      topArtists.slice(i, i + 3).map(async ([artistName, totalMs]) => {
        try {
          const res = await fetch(
            `https://api.spotify.com/v1/search?q=${encodeURIComponent(artistName)}&type=artist&limit=1`,
            { headers: { Authorization: `Bearer ${accessToken}` } }
          );
          if (!res.ok) return;
          const data = await res.json();
          const genres: string[] = data?.artists?.items?.[0]?.genres ?? [];
          const seen = new Set<string>();
          for (const genre of genres) {
            const bucket = normalize(genre);
            if (seen.has(bucket)) continue;
            seen.add(bucket);
            bucketMs.set(bucket, (bucketMs.get(bucket) ?? 0) + totalMs);
          }
        } catch {
          // skip artists that fail
        }
      })
    );
  }

  const sorted = Array.from(bucketMs.entries()).sort((a, b) => b[1] - a[1]);
  const maxMs = sorted[0]?.[1] ?? 1;
  const genres = sorted.slice(0, 6).map(([name, ms]) => ({
    name,
    minutes: Math.round(ms / 60000),
    pct: Math.round((ms / maxMs) * 100),
  }));

  return new Response(JSON.stringify({ genres }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
