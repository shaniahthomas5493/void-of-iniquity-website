create table if not exists public.member_management_records (
 user_id text primary key,
 discord_name text not null,
 display_name text not null default '',
 rank_label text not null default 'Unassigned' check(rank_label in ('Unassigned','Acolyte','Ferryman','Void Revenant','Void Reaper')),
 access_status text not null default 'active' check(access_status in ('active','restricted','suspended','departed')),
 standing text not null default 'good' check(standing in ('good','watch','warning','probation')),
 warnings integer not null default 0 check(warnings >= 0),
 commendations integer not null default 0 check(commendations >= 0),
 staff_notes text not null default '',
 updated_by text,
 updated_at timestamptz not null default now()
);
alter table public.member_management_records enable row level security;
revoke all on public.member_management_records from anon, authenticated;
