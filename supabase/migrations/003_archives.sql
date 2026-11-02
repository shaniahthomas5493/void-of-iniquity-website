create table if not exists public.archive_posts (
 id uuid primary key default gen_random_uuid(),
 title text not null,
 category text not null default 'Announcement',
 excerpt text not null default '',
 content text not null,
 author_name text not null default 'The Void',
 published boolean not null default false,
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now()
);
create index if not exists archive_posts_published_created_idx on public.archive_posts(published, created_at desc);
alter table public.archive_posts enable row level security;
revoke all on public.archive_posts from anon, authenticated;
