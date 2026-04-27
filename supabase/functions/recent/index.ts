// GET /functions/v1/recent?user_id=...&tz_offset=...
// Returns today and yesterday's plays (first 6 chronologically) plus summary stats.
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
  const tzOffset = parseInt(url.searchParams.get("tz_offset") ?? "0");

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

  // local_time = utc_time - tzOffset*60000
  function toLocalDate(isoString: string): string {
    return new Date(new Date(isoString).getTime() - tzOffset * 60000)
      .toISOString()
      .slice(0, 10);
  }

  const localMs = Date.now() - tzOffset * 60000;
  const todayLocal = new Date(localMs).toISOString().slice(0, 10);
  const yesterdayLocal = new Date(localMs - 86400000).toISOString().slice(0, 10);

  // UTC equivalent of yesterday's local midnight
  const sinceMs = new Date(yesterdayLocal + "T00:00:00Z").getTime() + tzOffset * 60000;
  const since = new Date(sinceMs).toISOString();

  const { data, error } = await supabase
    .from("plays")
    .select("track_name, artist_names, album_image_url, played_at, duration_ms")
    .eq("spotify_user_id", userId)
    .gte("played_at", since)
    .order("played_at", { ascending: true });

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const plays = data ?? [];

  function summarize(dayPlays: any[], date: string) {
    if (dayPlays.length === 0) return null;
    const totalMs = dayPlays.reduce((sum: number, p: any) => sum + (p.duration_ms ?? 0), 0);
    return {
      date,
      total_plays: dayPlays.length,
      total_minutes: Math.round(totalMs / 60000),
      plays: dayPlays.slice(-6).reverse(),
    };
  }

  const todayPlays = plays.filter((p: any) => toLocalDate(p.played_at) === todayLocal);
  const yesterdayPlays = plays.filter((p: any) => toLocalDate(p.played_at) === yesterdayLocal);

  return new Response(
    JSON.stringify({
      today: summarize(todayPlays, todayLocal),
      yesterday: summarize(yesterdayPlays, yesterdayLocal),
    }),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );
});
