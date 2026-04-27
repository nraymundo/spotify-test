// Supabase project config + helpers for talking to Edge Functions.
// The publishable key is safe to expose in the mobile app — it can only do
// what Row Level Security policies permit, and we have RLS enabled with no
// public policies on the connections / plays tables. All real work happens
// server-side via Edge Functions which use a secret key internally.

export const SUPABASE_URL = "https://kbllcjqtpjltuilibiek.supabase.co";
export const SUPABASE_PUBLISHABLE_KEY =
  "sb_publishable_XcUdP1QOWgckSGrv9MHp1w_wRECP6S0";

const FUNCTIONS_URL = `${SUPABASE_URL}/functions/v1`;

async function callFunction(path, { method = "POST", body } = {}) {
  const res = await fetch(`${FUNCTIONS_URL}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${SUPABASE_PUBLISHABLE_KEY}`,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${path} failed (${res.status}): ${text}`);
  }
  return res.json();
}

// Called once after a successful Spotify login.
// Sends the refresh token to the backend so the polling worker can keep
// fetching plays even when the app is closed.
export function registerConnection({ accessToken, refreshToken }) {
  return callFunction("/connect", {
    body: { access_token: accessToken, refresh_token: refreshToken },
  });
}

// Aggregate listening stats for a user since a given ISO date.
// Optional `artist` filter narrows to plays where that artist appears.
export function fetchStats({ userId, since, artist, groupBy, tzOffset }) {
  const params = new URLSearchParams({ user_id: userId });
  if (since) params.set("since", since);
  if (artist) params.set("artist", artist);
  if (groupBy) params.set("group_by", groupBy);
  if (tzOffset != null) params.set("tz_offset", String(tzOffset));
  return callFunction(`/stats?${params}`, { method: "GET" });
}

// Top artist and top track for a user since a given ISO date, derived from polled play data.
export function fetchTop({ userId, since }) {
  const params = new URLSearchParams({ user_id: userId });
  if (since) params.set("since", since);
  return callFunction(`/top?${params}`, { method: "GET" });
}

// Top genres for a user since a given ISO date, derived from polled play data.
export function fetchGenres({ userId, since }) {
  const params = new URLSearchParams({ user_id: userId });
  if (since) params.set("since", since);
  return callFunction(`/genres?${params}`, { method: "GET" });
}

// Today and yesterday's plays (first 6 each) plus summary stats.
// tzOffset is getTimezoneOffset() (minutes, e.g. 300 for UTC-5).
export function fetchRecent({ userId, tzOffset }) {
  const params = new URLSearchParams({ user_id: userId });
  if (tzOffset != null) params.set("tz_offset", String(tzOffset));
  return callFunction(`/recent?${params}`, { method: "GET" });
}

// All plays for a local calendar day (YYYY-MM-DD) plus stats and streak.
export function fetchDay({ userId, date, tzOffset }) {
  const params = new URLSearchParams({ user_id: userId, date });
  if (tzOffset != null) params.set("tz_offset", String(tzOffset));
  return callFunction(`/day?${params}`, { method: "GET" });
}
