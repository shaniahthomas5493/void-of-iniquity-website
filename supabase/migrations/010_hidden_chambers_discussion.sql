alter table public.hidden_chamber_topics add column if not exists chamber_key text;
update public.hidden_chamber_topics set chamber_key='acolytes' where chamber_key is null;
alter table public.hidden_chamber_topics alter column chamber_key set not null;
alter table public.hidden_chamber_topics drop constraint if exists hidden_chamber_topics_chamber_key_check;
alter table public.hidden_chamber_topics add constraint hidden_chamber_topics_chamber_key_check check(chamber_key in ('acolytes','ferryman','revenants','reaper'));
create index if not exists hidden_chamber_topics_chamber_created_idx on public.hidden_chamber_topics(chamber_key,created_at desc);