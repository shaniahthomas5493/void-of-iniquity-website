create table if not exists public.inner_circle_profiles (
  user_id text primary key,
  discord_name text not null,
  avatar_url text,
  discord_roles text[] not null default '{}',
  display_name text,
  bio text not null default '',
  last_seen_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists inner_circle_roles_idx on public.inner_circle_profiles using gin(discord_roles);
alter table public.inner_circle_profiles enable row level security;
revoke all on public.inner_circle_profiles from anon, authenticated;
