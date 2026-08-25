alter table classes
  add column if not exists venue text;

create index if not exists classes_venue_idx
  on classes (venue)
  where venue is not null;
