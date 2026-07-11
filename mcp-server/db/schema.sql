-- =========================================================
-- Taible schema v1 -- single-restaurant pilot
-- Paste into Supabase SQL Editor (taibledb project) and run.
--
-- Access model: nothing in this schema is reachable by the
-- publishable key. Guests never call Supabase from the browser
-- (menu, sessions, orders -- all of it goes through voice ->
-- orchestrator -> FastMCP tools). Staff never call Supabase
-- from a browser either -- the admin/staff panel also goes
-- through the FastMCP server. Only the SECRET key (used
-- exclusively by your Cloud Run FastMCP service) can read or
-- write anything here.
--
-- Every table has RLS enabled with zero policies. That is not
-- an oversight -- "enabled, no policies" is what locks a table
-- to service-role-only access. Do not add anon/publishable
-- policies to these tables unless the guest or staff experience
-- changes to need direct browser access later.
--
-- restaurant_id is on every table even though there's only one
-- restaurant today -- costs nothing now, avoids a migration
-- when restaurant #2 signs up.
-- =========================================================

create extension if not exists pgcrypto;

-- ---------- restaurants ----------
create table public.restaurants (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,        -- used in the QR code URL
  created_at timestamptz not null default now()
);

alter table public.restaurants enable row level security;
-- no policies -> secret key only.


-- ---------- menu_items ----------
create table public.menu_items (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references public.restaurants(id) on delete cascade,
  name text not null,
  description text,
  price numeric(10,2) not null check (price >= 0),
  category text,
  is_available boolean not null default true,  -- staff stock toggle, set via MCP tool
  image_url text,
  created_at timestamptz not null default now()
);

create index on public.menu_items (restaurant_id);

alter table public.menu_items enable row level security;
-- no policies -> secret key only. The voice agent reads this
-- via an MCP tool (e.g. get_menu) and speaks it to the guest.


-- ---------- modifiers ----------
create table public.modifiers (
  id uuid primary key default gen_random_uuid(),
  menu_item_id uuid not null references public.menu_items(id) on delete cascade,
  name text not null,               -- e.g. "Extra cheese", "No onions"
  price_delta numeric(10,2) not null default 0,
  is_available boolean not null default true,
  created_at timestamptz not null default now()
);

create index on public.modifiers (menu_item_id);

alter table public.modifiers enable row level security;
-- no policies -> secret key only.


-- ---------- sessions (one per guest visit / table) ----------
create table public.sessions (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references public.restaurants(id) on delete cascade,
  table_number text,
  status text not null default 'active' check (status in ('active','closed')),
  created_at timestamptz not null default now(),
  closed_at timestamptz
);

create index on public.sessions (restaurant_id);

alter table public.sessions enable row level security;
-- no policies -> secret key only. Created by an MCP tool the
-- moment the orchestrator picks up a guest's QR scan / voice
-- connection -- there is no guest auth identity in this schema.


-- ---------- orders ----------
create table public.orders (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.sessions(id) on delete cascade,
  restaurant_id uuid not null references public.restaurants(id) on delete cascade,
  status text not null default 'pending'
    check (status in ('pending','confirmed','preparing','served','cancelled')),
  total numeric(10,2) not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index on public.orders (session_id);
create index on public.orders (restaurant_id);

alter table public.orders enable row level security;
-- no policies -> secret key only.


-- ---------- order_items ----------
create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  menu_item_id uuid not null references public.menu_items(id),
  quantity int not null default 1 check (quantity > 0),
  unit_price numeric(10,2) not null,   -- snapshot of price at order time
  created_at timestamptz not null default now()
);

create index on public.order_items (order_id);

alter table public.order_items enable row level security;
-- no policies -> secret key only.


-- ---------- order_item_modifiers (chosen modifiers per item) ----------
create table public.order_item_modifiers (
  id uuid primary key default gen_random_uuid(),
  order_item_id uuid not null references public.order_items(id) on delete cascade,
  modifier_id uuid not null references public.modifiers(id),
  price_delta numeric(10,2) not null   -- snapshot of modifier price at order time
);

create index on public.order_item_modifiers (order_item_id);

alter table public.order_item_modifiers enable row level security;
-- no policies -> secret key only.
