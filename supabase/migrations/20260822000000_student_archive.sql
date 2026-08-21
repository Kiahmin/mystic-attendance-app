-- Soft-archive for students who quit. Null archived_at means the student is active.

alter table students
  add column archived_at timestamptz;

-- Last present / admitted walk-in session date, used to flag long inactivity.
create view public.student_last_attendance
with (security_invoker = true) as
select
  a.student_id,
  max(s.session_date) as last_attended_on
from public.attendance a
join public.sessions s on s.id = a.session_id
where a.status = 'present'
   or (a.status = 'walk_in' and a.walk_in_status = 'admitted')
group by a.student_id;

grant select on public.student_last_attendance to authenticated;
