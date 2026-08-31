-- Delete one staff Auth user by email (SQL editor).
-- Change the email, then run. Classes/sessions keep their rows; coach fields are cleared.

begin;

create temporary table drop_user as
select id
from auth.users
where email = 'person@example.com';

update public.classes
set coach_id = null
where coach_id in (select id from drop_user);

update public.sessions
set coach_id = null
where coach_id in (select id from drop_user);

update public.sessions
set cancelled_by = null
where cancelled_by in (select id from drop_user);

update public.attendance
set marked_by = null
where marked_by in (select id from drop_user);

update public.attendance
set override_by = null
where override_by in (select id from drop_user);

update public.session_attendee_overrides
set created_by = null
where created_by in (select id from drop_user);

delete from public.profiles
where id in (select id from drop_user);

delete from auth.users
where id in (select id from drop_user);

commit;
