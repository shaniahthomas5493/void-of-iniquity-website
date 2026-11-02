create table if not exists public.gatehouse_tickets (
 id uuid primary key default gen_random_uuid(),
 user_id text not null,
 discord_name text not null,
 ticket_type text not null check (ticket_type in ('Application','Request','Support')),
 subject text not null check (char_length(subject) between 3 and 120),
 details text not null check (char_length(details) between 5 and 8000),
 status text not null default 'open' check (status in ('open','in_review','resolved','closed')),
 staff_note text,
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now()
);
create index if not exists gatehouse_tickets_created_idx on public.gatehouse_tickets(created_at desc);
create index if not exists gatehouse_tickets_user_idx on public.gatehouse_tickets(user_id,created_at desc);
alter table public.gatehouse_tickets enable row level security;
revoke all on public.gatehouse_tickets from anon, authenticated;
