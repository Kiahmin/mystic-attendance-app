-- Allow Auth dashboard user deletes.
-- 1) Deleting auth.users removes public.profiles (cascade).
-- 2) Staff references on classes/sessions/attendance are cleared, not blocked.

alter table public.profiles
  drop constraint if exists profiles_id_fkey;

alter table public.profiles
  add constraint profiles_id_fkey
  foreign key (id) references auth.users (id) on delete cascade;

alter table public.classes
  drop constraint if exists classes_coach_id_fkey;

alter table public.classes
  add constraint classes_coach_id_fkey
  foreign key (coach_id) references public.profiles (id) on delete set null;

alter table public.sessions
  drop constraint if exists sessions_coach_id_fkey;

alter table public.sessions
  add constraint sessions_coach_id_fkey
  foreign key (coach_id) references public.profiles (id) on delete set null;

alter table public.sessions
  drop constraint if exists sessions_cancelled_by_fkey;

alter table public.sessions
  add constraint sessions_cancelled_by_fkey
  foreign key (cancelled_by) references public.profiles (id) on delete set null;

alter table public.attendance
  drop constraint if exists attendance_marked_by_fkey;

alter table public.attendance
  add constraint attendance_marked_by_fkey
  foreign key (marked_by) references public.profiles (id) on delete set null;

alter table public.attendance
  drop constraint if exists attendance_override_by_fkey;

alter table public.attendance
  add constraint attendance_override_by_fkey
  foreign key (override_by) references public.profiles (id) on delete set null;

alter table public.session_attendee_overrides
  drop constraint if exists session_attendee_overrides_created_by_fkey;

alter table public.session_attendee_overrides
  add constraint session_attendee_overrides_created_by_fkey
  foreign key (created_by) references public.profiles (id) on delete set null;
