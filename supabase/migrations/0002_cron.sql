-- Set up the polling cron job using Supabase Vault for the secret key.
-- Vault encrypts the secret at rest and exposes it via vault.decrypted_secrets to the cron job.

-- Step 1: store the Supabase secret key as a Vault secret.
-- Replace YOUR_SECRET_KEY with the value from Project Settings → API → Secret keys
-- (create one if there isn't one yet — name it something like "cron").
-- Run this once. To update later, use:
--   update vault.secrets set secret = 'NEW_KEY' where name = 'supabase_secret_key';
select vault.create_secret(
  'YOUR_SECRET_KEY',
  'supabase_secret_key',
  'Used by pg_cron to authenticate to the poll Edge Function'
);

-- Step 2: schedule the poll function to run every 5 minutes.
-- The cron job reads the decrypted secret from Vault each time it fires.
select cron.schedule(
  'poll-spotify',
  '*/5 * * * *',
  $$
  select net.http_post(
    url := 'https://kbllcjqtpjltuilibiek.supabase.co/functions/v1/poll',
    headers := jsonb_build_object(
      'Authorization', 'Bearer ' || (select decrypted_secret from vault.decrypted_secrets where name = 'supabase_secret_key' limit 1),
      'Content-Type', 'application/json'
    ),
    body := '{}'::jsonb
  )
  $$
);

-- Useful queries:
--   select * from cron.job;                                                  -- see scheduled jobs
--   select * from cron.job_run_details order by start_time desc limit 20;    -- see recent runs
--   select cron.unschedule('poll-spotify');                                  -- disable the job
--   select name, description, created_at from vault.secrets;                 -- see stored secrets (decrypted_secret hidden)
