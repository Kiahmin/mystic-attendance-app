-- Ad-hoc calendar events are sessions with no class template.
-- Class sessions keep a class_id and no name; events store name, times, and
-- whether attendance is taken.

alter table sessions
  add column kind text not null default 'class',
  add column name text,
  add column requires_attendance boolean not null default true;

alter table sessions
  add constraint sessions_kind_check
  check (kind in ('class', 'event'));

alter table sessions
  add constraint sessions_kind_shape_check
  check (
    (
      kind = 'class'
      and class_id is not null
      and name is null
    )
    or (
      kind = 'event'
      and class_id is null
      and name is not null
      and char_length(btrim(name)) > 0
      and start_time is not null
      and end_time is not null
    )
  );
