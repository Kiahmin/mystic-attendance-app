-- First-class venues. Classes and sessions store a venue_id instead of
-- free-text on classes. Session venue is snapshotted so past weeks stay
-- accurate if a class later moves.

create table venues (
  id          uuid default gen_random_uuid() primary key,
  name        text not null,
  is_active   boolean not null default true,
  sort_order  int not null default 0,
  created_at  timestamptz default now(),
  unique (name)
);

create index venues_sort_order_idx on venues (sort_order, name);

insert into venues (id, name, sort_order) values
  ('a1a1a1a1-a1a1-41a1-a1a1-a1a1a1a1a1a1', 'Stadium', 1),
  ('a2a2a2a2-a2a2-42a2-a2a2-a2a2a2a2a2a2', 'Khatib', 2),
  ('a3a3a3a3-a3a3-43a3-a3a3-a3a3a3a3a3a3', 'Bukit Batok', 3),
  ('a4a4a4a4-a4a4-44a4-a4a4-a4a4a4a4a4a4', 'Boon Keng', 4)
on conflict (name) do nothing;

insert into venues (name, sort_order)
select distinct trim(c.venue), 100
from classes c
where c.venue is not null
  and trim(c.venue) <> ''
  and not exists (
    select 1 from venues v
    where lower(v.name) = lower(trim(c.venue))
  );

alter table classes
  add column if not exists venue_id uuid references venues(id);

alter table sessions
  add column if not exists venue_id uuid references venues(id);

update classes c
set venue_id = v.id
from venues v
where c.venue is not null
  and trim(c.venue) <> ''
  and lower(v.name) = lower(trim(c.venue))
  and c.venue_id is distinct from v.id;

update sessions s
set venue_id = c.venue_id
from classes c
where s.class_id = c.id
  and c.venue_id is not null
  and s.venue_id is distinct from c.venue_id;

drop index if exists classes_venue_idx;

alter table classes
  drop column if exists venue;

create index if not exists classes_venue_id_idx
  on classes (venue_id);

create index if not exists sessions_venue_id_idx
  on sessions (venue_id);

alter table venues enable row level security;

create policy "venues_staff_all"
  on venues for all to authenticated
  using (is_staff()) with check (is_staff());

grant select, insert, update, delete on venues to authenticated;
