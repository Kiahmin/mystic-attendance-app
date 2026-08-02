-- Allow the app (authenticated Supabase users) to read and write app data.
-- The SQL editor bypasses RLS; without these policies PostgREST returns no rows.

grant usage on schema public to authenticated;
grant select, insert, update, delete on all tables in schema public to authenticated;
grant usage, select on all sequences in schema public to authenticated;

grant execute on function resolve_chargeable_package(uuid, date) to authenticated;

alter table profiles enable row level security;
alter table students enable row level security;
alter table classes enable row level security;
alter table enrolments enable row level security;
alter table packages enable row level security;
alter table sessions enable row level security;
alter table attendance enable row level security;

-- Internal staff app: coaches and admins share access for now.
-- Tighten per-role policies in a follow-up migration if needed.

drop policy if exists "profiles_authenticated_all" on profiles;
create policy "profiles_authenticated_all"
  on profiles for all to authenticated
  using (true) with check (true);

drop policy if exists "students_authenticated_all" on students;
create policy "students_authenticated_all"
  on students for all to authenticated
  using (true) with check (true);

drop policy if exists "classes_authenticated_all" on classes;
create policy "classes_authenticated_all"
  on classes for all to authenticated
  using (true) with check (true);

drop policy if exists "enrolments_authenticated_all" on enrolments;
create policy "enrolments_authenticated_all"
  on enrolments for all to authenticated
  using (true) with check (true);

drop policy if exists "packages_authenticated_all" on packages;
create policy "packages_authenticated_all"
  on packages for all to authenticated
  using (true) with check (true);

drop policy if exists "sessions_authenticated_all" on sessions;
create policy "sessions_authenticated_all"
  on sessions for all to authenticated
  using (true) with check (true);

drop policy if exists "attendance_authenticated_all" on attendance;
create policy "attendance_authenticated_all"
  on attendance for all to authenticated
  using (true) with check (true);
