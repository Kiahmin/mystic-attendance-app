-- Restrict app data access to users with an admin or coach profile.
-- Uses a security definer helper so profile lookups are not blocked by RLS.

create or replace function public.is_staff()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role in ('admin', 'coach')
  );
$$;

grant execute on function public.is_staff() to authenticated;

drop policy if exists "profiles_authenticated_all" on profiles;
drop policy if exists "students_authenticated_all" on students;
drop policy if exists "classes_authenticated_all" on classes;
drop policy if exists "enrolments_authenticated_all" on enrolments;
drop policy if exists "packages_authenticated_all" on packages;
drop policy if exists "sessions_authenticated_all" on sessions;
drop policy if exists "attendance_authenticated_all" on attendance;

create policy "profiles_staff_all"
  on profiles for all to authenticated
  using (is_staff()) with check (is_staff());

create policy "students_staff_all"
  on students for all to authenticated
  using (is_staff()) with check (is_staff());

create policy "classes_staff_all"
  on classes for all to authenticated
  using (is_staff()) with check (is_staff());

create policy "enrolments_staff_all"
  on enrolments for all to authenticated
  using (is_staff()) with check (is_staff());

create policy "packages_staff_all"
  on packages for all to authenticated
  using (is_staff()) with check (is_staff());

create policy "sessions_staff_all"
  on sessions for all to authenticated
  using (is_staff()) with check (is_staff());

create policy "attendance_staff_all"
  on attendance for all to authenticated
  using (is_staff()) with check (is_staff());
