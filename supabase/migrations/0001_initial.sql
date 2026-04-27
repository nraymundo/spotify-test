-- Reverb backend schema
-- Run once in the Supabase SQL editor.

-- Extensions: pg_cron schedules jobs, pg_net lets the DB make HTTP calls (used by the cron job to invoke the poll function).
create extension if not exists pg_cron with schema extensions;
create extension if not exists pg_net with schema extensions;

-- One row per Spotify user that has authorized the app.
create table public.connections (
  spotify_user_id text primary key,
  display_name    text,
  refresh_token   text not null,
  last_polled_at  timestamptz,
  status          text not null default 'active'
                 check (status in ('active', 'needs_reauth', 'paused')),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- One row per played track. Dedupe key is (user, played_at).
create table public.plays (
  id                bigserial primary key,
  spotify_user_id   text not null references public.connections(spotify_user_id) on delete cascade,
  track_id          text not null,
  track_name        text not null,
  artist_names      text[] not null,
  album_image_url   text,
  played_at         timestamptz not null,
  duration_ms       integer not null,
  unique (spotify_user_id, played_at)
);

create index plays_user_played_at_idx on public.plays (spotify_user_id, played_at desc);

-- Lock down direct client access. Edge Functions use the service-role key, which bypasses RLS.
-- No policies = no read/write for anon or authenticated roles.
alter table public.connections enable row level security;
alter table public.plays       enable row level security;
