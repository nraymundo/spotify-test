// GET /functions/v1/stats?user_id=...&since=YYYY-MM-DD&artist=...&group_by=hour|day&tz_offset=...
// Returns aggregate listening stats for a user since a date.
// group_by=hour returns 24 chart points (local hours 0-23).
// group_by=day  returns 7 chart points (Mon-Sun in local time).
// tz_offset is the client's getTimezoneOffset() value (minutes, e.g. 300 for UTC-5).
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
  const until = url.searchParams.get("until");
  const artist = url.searchParams.get("artist");
  const groupBy = url.searchParams.get("group_by"); // "hour" | "day" | null
  const tzOffset = parseInt(url.searchParams.get("tz_offset") ?? "0"); // minutes, from getTimezoneOffset()

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
    .select("track_id, artist_names, duration_ms, played_at", { count: "exact" })
    .eq("spotify_user_id", userId);

  if (since) query = query.gte("played_at", since);
  if (until) query = query.lt("played_at", until);
  if (artist) query = query.contains("artist_names", [artist]);

  // Streak is global (independent of since/until/artist filters), so fetch all
  // play dates for this user in parallel.
  const [mainResult, allDatesResult] = await Promise.all([
    query,
    supabase
      .from("plays")
      .select("played_at")
      .eq("spotify_user_id", userId),
  ]);
  const { data, error, count } = mainResult;
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const plays = data ?? [];
  const totalMs = plays.reduce((sum: number, p: any) => sum + p.duration_ms, 0);
  const uniqueTracks = new Set(plays.map((p: any) => p.track_id)).size;
  const uniqueArtists = new Set(
    plays.flatMap((p: any) => p.artist_names ?? [])
  ).size;

  const elapsedDays = since
    ? Math.max(1, Math.ceil((Date.now() - new Date(since).getTime()) / 86400000))
    : null;
  const avgMinPerDay = elapsedDays && plays.length > 0
    ? Math.round(totalMs / 60000 / elapsedDays)
    : null;

  // Convert a UTC ISO string to a local Date using the client's tz offset.
  // getTimezoneOffset() returns (UTC - local) in minutes, so local = UTC - offset.
  function toLocal(isoString: string): Date {
    return new Date(new Date(isoString).getTime() - tzOffset * 60000);
  }

  // Streak: consecutive days with plays counting backward from today
  // (or yesterday if today has no plays yet).
  let streak = 0;
  if (!allDatesResult.error && allDatesResult.data) {
    const localDates = new Set(
      allDatesResult.data.map((p: any) =>
        toLocal(p.played_at).toISOString().slice(0, 10)
      )
    );
    const localMs = Date.now() - tzOffset * 60000;
    const todayLocal = new Date(localMs).toISOString().slice(0, 10);
    const cur = new Date(todayLocal + "T12:00:00Z");
    if (!localDates.has(todayLocal)) {
      cur.setUTCDate(cur.getUTCDate() - 1);
    }
    while (localDates.has(cur.toISOString().slice(0, 10))) {
      streak++;
      cur.setUTCDate(cur.getUTCDate() - 1);
    }
  }

  const DAY_NAMES = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
  const dayMs = new Array(7).fill(0);
  for (const p of plays) {
    dayMs[toLocal(p.played_at).getUTCDay()] += p.duration_ms;
  }
  const peakDayIndex = dayMs.indexOf(Math.max(...dayMs));
  const peakDay = plays.length > 0 ? DAY_NAMES[peakDayIndex] : null;

  // Chart points grouped by local hour (0-23), local day of week (Mon=0…Sun=6),
  // or one point per calendar day in chronological order (UTC dates, since→today).
  let chartPoints: number[] | null = null;
  if (groupBy === "hour") {
    const hourMs = new Array(24).fill(0);
    for (const p of plays) {
      hourMs[toLocal(p.played_at).getUTCHours()] += p.duration_ms;
    }
    chartPoints = hourMs.map((ms) => Math.round(ms / 60000));
  } else if (groupBy === "day") {
    // Mon=0 … Sun=6
    const weekMs = new Array(7).fill(0);
    for (const p of plays) {
      const jsDay = toLocal(p.played_at).getUTCDay(); // 0=Sun
      const monIndex = jsDay === 0 ? 6 : jsDay - 1;
      weekMs[monIndex] += p.duration_ms;
    }
    chartPoints = weekMs.map((ms) => Math.round(ms / 60000));
  } else if (groupBy === "calendar_day") {
    // Bucket plays by LOCAL calendar date using the client's tz offset.
    const dateMs: Record<string, number> = {};
    for (const p of plays) {
      const key = toLocal(p.played_at).toISOString().slice(0, 10);
      dateMs[key] = (dateMs[key] ?? 0) + p.duration_ms;
    }
    // Determine start/end as local dates (toLocal shifts UTC→local).
    const sinceLocal = since
      ? toLocal(since).toISOString().slice(0, 10)
      : toLocal(new Date(Date.now() - 30 * 86400000).toISOString()).toISOString().slice(0, 10);
    const todayLocal = toLocal(new Date().toISOString()).toISOString().slice(0, 10);
    const points: number[] = [];
    const cur = new Date(sinceLocal + "T12:00:00Z");
    const end = new Date(todayLocal + "T12:00:00Z");
    while (cur <= end) {
      const key = cur.toISOString().slice(0, 10);
      points.push(Math.round((dateMs[key] ?? 0) / 60000));
      cur.setUTCDate(cur.getUTCDate() + 1);
    }
    chartPoints = points;
  }

  return new Response(
    JSON.stringify({
      total_plays: count ?? 0,
      total_minutes: Math.round(totalMs / 60000),
      unique_tracks: uniqueTracks,
      unique_artists: uniqueArtists,
      avg_min_per_day: avgMinPerDay,
      peak_day: peakDay,
      streak,
      chart_points: chartPoints,
      since: since ?? null,
    }),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );
});
