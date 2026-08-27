alter table packages
  add column if not exists informed_at timestamptz;

create index if not exists packages_informed_at_idx
  on packages (informed_at)
  where informed_at is not null;
