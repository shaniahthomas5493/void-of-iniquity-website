create table if not exists public.ritual_events (
 id uuid primary key default gen_random_uuid(),
 title text not null check (char_length(title) between 3 and 120),
 category text not null default 'Community',
 description text not null check (char_length(description) between 3 and 8000),
 starts_at timestamptz not null,
 ends_at timestamptz,
 location text not null default 'The Void',
 discord_url text,
 status text not null default 'published' check (status in ('draft','published','cancelled')),
 created_by text not null,
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now()
);
create table if not exists public.ritual_suggestions (
 id uuid primary key default gen_random_uuid(),
 user_id text not null,
 discord_name text not null,
 title text not null check (char_length(title) between 3 and 120),
 details text not null check (char_length(details) between 3 and 4000),
 preferred_date date,
 preferred_time time,
 status text not null default 'pending' check (status in ('pending','considered','scheduled','declined')),
 created_at timestamptz not null default now()
);
create table if not exists public.ritual_rsvps (
 id uuid primary key default gen_random_uuid(),
 event_id uuid not null references public.ritual_events(id) on delete cascade,
 user_id text not null,
 discord_name text not null,
 created_at timestamptz not null default now(),
 unique(event_id,user_id)
);
create index if not exists ritual_events_start_idx on public.ritual_events(status,starts_at);
create index if not exists ritual_suggestions_created_idx on public.ritual_suggestions(status,created_at desc);
create index if not exists ritual_rsvps_event_idx on public.ritual_rsvps(event_id);
alter table public.ritual_events enable row level security;
alter table public.ritual_suggestions enable row level security;
alter table public.ritual_rsvps enable row level security;
revoke all on public.ritual_events from anon, authenticated;
revoke all on public.ritual_suggestions from anon, authenticated;
revoke all on public.ritual_rsvps from anon, authenticated;

alter table public.ritual_suggestions add column if not exists preferred_time time;
