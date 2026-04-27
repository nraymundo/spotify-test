// POST /functions/v1/connect
// Body: { access_token: string, refresh_token: string }
// Verifies identity by calling Spotify /me, then stores the refresh token.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405, headers: corsHeaders });
  }

  const { access_token, refresh_token } = await req.json().catch(() => ({}));
  if (!access_token || !refresh_token) {
    return new Response(JSON.stringify({ error: "missing tokens" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const meRes = await fetch("https://api.spotify.com/v1/me", {
    headers: { Authorization: `Bearer ${access_token}` },
  });
  if (!meRes.ok) {
    return new Response(JSON.stringify({ error: "spotify auth failed" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
  const me = await meRes.json();

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const { error } = await supabase.from("connections").upsert({
    spotify_user_id: me.id,
    display_name: me.display_name,
    refresh_token,
    status: "active",
    updated_at: new Date().toISOString(),
  });

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  return new Response(
    JSON.stringify({ spotify_user_id: me.id, display_name: me.display_name }),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );
});
