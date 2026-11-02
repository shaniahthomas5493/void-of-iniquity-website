create table if not exists public.reliquary_submissions (
 id uuid primary key default gen_random_uuid(), user_id text not null, discord_name text not null,
 title text not null check (char_length(title) between 2 and 100),
 category text not null check (category in ('Artwork','Photography','Tattoo','Gaming','Writing','Music','Digital Creation','Other')),
 description text not null default '' check (char_length(description) <= 1000),
 image_url text not null, source_url text,
 status text not null default 'pending' check (status in ('pending','approved','rejected')),
 created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create index if not exists reliquary_status_created_idx on public.reliquary_submissions(status, created_at desc);
alter table public.reliquary_submissions enable row level security;
revoke all on public.reliquary_submissions from anon, authenticated;