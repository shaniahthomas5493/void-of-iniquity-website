create table if not exists public.gathering_topics (id uuid primary key default gen_random_uuid(), user_id text not null, discord_name text not null, title text not null check (char_length(title) between 3 and 120), category text not null default 'General', content text not null check (char_length(content) between 3 and 8000), created_at timestamptz not null default now(), updated_at timestamptz not null default now());
create table if not exists public.gathering_replies (id uuid primary key default gen_random_uuid(), topic_id uuid not null references public.gathering_topics(id) on delete cascade, user_id text not null, discord_name text not null, content text not null check (char_length(content) between 1 and 4000), created_at timestamptz not null default now());
create index if not exists gathering_topics_created_idx on public.gathering_topics(created_at desc);
create index if not exists gathering_replies_topic_created_idx on public.gathering_replies(topic_id, created_at asc);
alter table public.gathering_topics enable row level security;
alter table public.gathering_replies enable row level security;
revoke all on public.gathering_topics from anon, authenticated;
revoke all on public.gathering_replies from anon, authenticated;