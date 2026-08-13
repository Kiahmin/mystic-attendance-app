-- Session-scoped include/exclude overrides (do not modify class enrolments).
-- Effective roster = (class enrolments - excludes) ∪ includes

create table session_attendee_overrides (
  id          uuid primary key default gen_random_uuid(),
  session_id  uuid not null references sessions(id) on delete cascade,
  student_id  uuid not null references students(id) on delete cascade,
  kind        text not null check (kind in ('include', 'exclude')),
  created_by  uuid references profiles(id),
  created_at  timestamptz default now(),
  unique (session_id, student_id)
);

create index session_attendee_overrides_session_id_idx
  on session_attendee_overrides (session_id);

alter table session_attendee_overrides enable row level security;

create policy "session_attendee_overrides_staff_all"
  on session_attendee_overrides for all to authenticated
  using (is_staff()) with check (is_staff());
