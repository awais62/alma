create table if not exists public.kv_store (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.kv_store enable row level security;
-- No policies, so only the service role key can access it, which is perfect for our backend API routes.
