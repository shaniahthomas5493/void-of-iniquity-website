create table if not exists public.streamer_profiles (
 user_id text primary key,
 discord_name text not null,
 display_name text not null check (char_length(display_name) between 2 and 50),
 bio text not null default '' check (char_length(bio) <= 280),
 twitch_url text,
 tiktok_url text,
 youtube_url text,
 is_live boolean not null default false,
 updated_at timestamptz not null default now()
);
create index if not exists streamer_profiles_live_idx on public.streamer_profiles(is_live,display_name);
alter table public.streamer_profiles enable row level security;
revoke all on public.streamer_profiles from anon, authenticated;