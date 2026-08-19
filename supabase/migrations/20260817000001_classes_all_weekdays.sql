-- Allow class templates on any calendar day, not only Saturday and Sunday.

alter table classes drop constraint if exists classes_day_of_week_check;

alter table classes
  add constraint classes_day_of_week_check
  check (day_of_week in (
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
    'sunday'
  ));
