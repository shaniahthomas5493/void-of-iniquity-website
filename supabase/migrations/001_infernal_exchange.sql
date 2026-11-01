create extension if not exists pgcrypto;

create table if not exists public.exchange_submissions (
 id uuid primary key default gen_random_uuid(),
 user_id text not null,
 discord_name text not null,
 submission_type text not null check (submission_type in ('author','artisan')),
 display_name text not null,
 description text not null,
 category text not null,
 website_url text,
 social_url text,
 featured_image_url text,
 status text not null default 'pending' check (status in ('pending','approved','rejected')),
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now()
);
create index if not exists exchange_submissions_status_created_idx on public.exchange_submissions(status, created_at desc);
create index if not exists exchange_submissions_user_idx on public.exchange_submissions(user_id, created_at desc);
alter table public.exchange_submissions enable row level security;
revoke all on public.exchange_submissions from anon, authenticated;
