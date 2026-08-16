-- Snapshot coach and timetable on each dated session so past weeks stay
-- accurate when the class template is later edited.

alter table sessions
  add column coach_id uuid references profiles(id),
  add column start_time time,
  add column end_time time;

update sessions s
set
  coach_id = c.coach_id,
  start_time = c.start_time,
  end_time = c.end_time
from classes c
where s.class_id = c.id
  and (
    s.coach_id is distinct from c.coach_id
    or s.start_time is distinct from c.start_time
    or s.end_time is distinct from c.end_time
    or s.start_time is null
    or s.end_time is null
  );
