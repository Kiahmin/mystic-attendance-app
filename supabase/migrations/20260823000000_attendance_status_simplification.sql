-- Collapse attendance.status to present / absent / no_show.
-- Walk-in identity moves to attendee_source; walk_in_status is dropped.
-- Session cancellation deletes attendance rows instead of writing
-- session_cancelled. Credit refunds on DELETE are added here too.

-- ---------------------------------------------------------------------------
-- 1. New column (nullable until backfilled)
-- ---------------------------------------------------------------------------

alter table public.attendance
  add column attendee_source text;

-- ---------------------------------------------------------------------------
-- 2. Backfill attendee_source from status + session_attendee_overrides
-- ---------------------------------------------------------------------------

update public.attendance a
set attendee_source = 'walk_in'
where a.status = 'walk_in';

update public.attendance a
set attendee_source = 'one_off'
where a.attendee_source is null
  and exists (
    select 1
    from public.session_attendee_overrides o
    where o.session_id = a.session_id
      and o.student_id = a.student_id
      and o.kind = 'include'
  );

update public.attendance
set attendee_source = 'enrolled'
where attendee_source is null;

-- ---------------------------------------------------------------------------
-- 3. Drop CHECK constraints that mention status or walk_in_status
--    (anonymous names; match by definition, leave the override triple-null
--    check intact).
-- ---------------------------------------------------------------------------

do $$
declare
  rec record;
begin
  for rec in
    select conname, pg_get_constraintdef(oid) as def
    from pg_constraint
    where conrelid = 'public.attendance'::regclass
      and contype = 'c'
  loop
    if rec.def ~* 'status' or rec.def ~* 'walk_in_status' then
      execute format(
        'alter table public.attendance drop constraint %I',
        rec.conname
      );
    end if;
  end loop;
end;
$$;

-- ---------------------------------------------------------------------------
-- 4. Convert statuses while walk_in_status still exists
-- ---------------------------------------------------------------------------

update public.attendance
set status = 'present'
where status = 'walk_in'
  and walk_in_status = 'admitted';

update public.attendance
set status = 'absent'
where status = 'walk_in'
  and walk_in_status = 'declined';

update public.attendance
set status = 'absent'
where status in ('cancelled_valid', 'cancelled_late');

update public.attendance
set status = 'present'
where status = 'complimentary';

-- ---------------------------------------------------------------------------
-- 5. Drop session_cancelled rows (never charged)
-- ---------------------------------------------------------------------------

delete from public.attendance
where status = 'session_cancelled';

-- Any leftover walk_in rows (admitted/declined should already be converted)
-- would violate the new status check; treat remaining as absent.
update public.attendance
set status = 'absent'
where status = 'walk_in';

-- ---------------------------------------------------------------------------
-- 6. New constraints
-- ---------------------------------------------------------------------------

alter table public.attendance
  alter column attendee_source set default 'enrolled',
  alter column attendee_source set not null;

alter table public.attendance
  add constraint attendance_status_check
    check (status in ('present', 'absent', 'no_show')),
  add constraint attendance_attendee_source_check
    check (attendee_source in ('enrolled', 'one_off', 'walk_in')),
  add constraint attendance_decline_reason_walk_in_check
    check (decline_reason is null or attendee_source = 'walk_in');

-- ---------------------------------------------------------------------------
-- 7. Recreate student_last_attendance, then drop walk_in_status
--    (the previous view referenced walk_in_status, so it must be dropped first)
-- ---------------------------------------------------------------------------

drop view if exists public.student_last_attendance;

alter table public.attendance
  drop column walk_in_status;

create view public.student_last_attendance
with (security_invoker = true) as
select
  a.student_id,
  max(s.session_date) as last_attended_on
from public.attendance a
join public.sessions s on s.id = a.session_id
where a.status = 'present'
group by a.student_id;

grant select on public.student_last_attendance to authenticated;

-- ---------------------------------------------------------------------------
-- 9. Refund credits when an attendance row is deleted
-- ---------------------------------------------------------------------------

create or replace function handle_credit_deduction()
returns trigger as $$
declare
  old_charged boolean;
  new_charged boolean;
begin
  if tg_op = 'DELETE' then
    if attendance_is_charged(old.deduct_credit, old.package_id) then
      perform apply_package_credit_delta(old.package_id, -1);
    end if;
    return old;
  end if;

  if tg_op = 'UPDATE' then
    old_charged := attendance_is_charged(old.deduct_credit, old.package_id);
    new_charged := attendance_is_charged(new.deduct_credit, new.package_id);

    if old_charged and not new_charged then
      perform apply_package_credit_delta(old.package_id, -1);
    elsif not old_charged and new_charged then
      perform apply_package_credit_delta(new.package_id, 1);
    elsif old_charged and new_charged
      and old.package_id is distinct from new.package_id then
      perform apply_package_credit_delta(old.package_id, -1);
      perform apply_package_credit_delta(new.package_id, 1);
    end if;

    return new;
  end if;

  if attendance_is_charged(new.deduct_credit, new.package_id) then
    perform apply_package_credit_delta(new.package_id, 1);
  end if;

  return new;
end;
$$ language plpgsql;

drop trigger if exists on_attendance_credit_change on public.attendance;

create trigger on_attendance_credit_change
  after insert or update or delete on public.attendance
  for each row execute function handle_credit_deduction();
