// GET /functions/v1/day?user_id=...&date=YYYY-MM-DD&tz_offset=...
// Returns all plays for a local calendar day plus stats and current listening streak.
// tz_offset is getTimezoneOffset() — minutes of (UTC - local), e.g. 300 for UTC-5.
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
  const date = url.searchParams.get("date"); // YYYY-MM-DD in local time
  const tzOffset = parseInt(url.searchParams.get("tz_offset") ?? "0");

  if (!userId || !date) {
    return new Response(JSON.stringify({ error: "missing user_id or date" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  function toLocalDate(isoString: string): string {
    return new Date(new Date(isoString).getTime() - tzOffset * 60000)
      .toISOString()
      .slice(0, 10);
  }

  // UTC range that covers the requested local calendar day
  const sinceMs = new Date(date + "T00:00:00Z").getTime() + tzOffset * 60000;
  const untilMs = sinceMs + 86400000;
  const since = new Date(sinceMs).toISOString();
  const until = new Date(untilMs).toISOString();

  const [dayResult, allDatesResult] = await Promise.all([
    supabase
      .from("plays")
      .select("track_name, artist_names, album_image_url, played_at, duration_ms")
      .eq("spotify_user_id", userId)
      .gte("played_at", since)
      .lt("played_at", until)
      .order("played_at", { ascending: true }),
    supabase
      .from("plays")
      .select("played_at")
      .eq("spotify_user_id", userId),
  ]);

  if (dayResult.error) {
    return new Response(JSON.stringify({ error: dayResult.error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const plays = dayResult.data ?? [];
  const totalMs = plays.reduce((sum: number, p: any) => sum + (p.duration_ms ?? 0), 0);
  const uniqueArtists = new Set(
    plays.flatMap((p: any) => p.artist_names ?? [])
  ).size;

  // Streak: consecutive days with plays counting backward from today (or yesterday if today is empty)
  let streak = 0;
  if (!allDatesResult.error && allDatesResult.data) {
    const localDates = new Set(allDatesResult.data.map((p: any) => toLocalDate(p.played_at)));
    const localMs = Date.now() - tzOffset * 60000;
    const todayLocal = new Date(localMs).toISOString().slice(0, 10);

    const start = new Date(todayLocal + "T12:00:00Z");
    if (!localDates.has(todayLocal)) {
      start.setUTCDate(start.getUTCDate() - 1);
    }
    while (localDates.has(start.toISOString().slice(0, 10))) {
      streak++;
      start.setUTCDate(start.getUTCDate() - 1);
    }
  }

  return new Response(
    JSON.stringify({
      date,
      total_plays: plays.length,
      total_minutes: Math.round(totalMs / 60000),
      unique_artists: uniqueArtists,
      streak,
      plays,
    }),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );
});
