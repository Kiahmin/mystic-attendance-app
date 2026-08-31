-- Undo UPCOMING TRIALS rows inserted by prod_seed_master_list.sql.
-- Matches packages/sessions created by scripts/import_master_list.py.
-- Roster students and class enrolments are kept.
-- Run in the Supabase SQL editor. Not a migration.

begin;

create temporary table trial_packages as
select id, student_id
from packages
where customisation_notes like 'Imported from UPCOMING TRIALS%';

create temporary table trial_sessions as
select id
from sessions
where class_id is null
  and kind = 'event'
  and name like 'Trial — %';

delete from attendance
where session_id in (select id from trial_sessions)
   or package_id in (select id from trial_packages);

delete from session_attendee_overrides
where session_id in (select id from trial_sessions);

do $$
begin
  if to_regclass('public.invoices') is not null then
    delete from invoices
    where package_id in (select id from trial_packages);
  end if;
end $$;

-- package_students cascade would hit prevent_removing_primary_package_student
alter table package_students disable trigger package_students_keep_primary;

delete from packages
where id in (select id from trial_packages);

alter table package_students enable trigger package_students_keep_primary;

delete from sessions
where id in (select id from trial_sessions);

delete from students s
where exists (
    select 1
    from trial_packages tp
    where tp.student_id = s.id
  )
  and not exists (
    select 1 from enrolments e where e.student_id = s.id
  )
  and not exists (
    select 1 from packages p where p.student_id = s.id
  )
  and not exists (
    select 1 from package_students ps where ps.student_id = s.id
  )
  and not exists (
    select 1 from attendance a where a.student_id = s.id
  );

commit;
