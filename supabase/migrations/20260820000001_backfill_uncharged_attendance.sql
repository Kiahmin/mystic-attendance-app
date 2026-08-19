-- Apply uncharged deducting attendance to a paid package (oldest first).
-- Defer first-lesson activation until after credits are attached so an old
-- Present does not expire the pack mid-loop.

create or replace function enforce_package_on_attendance()
returns trigger as $$
declare
  pkg record;
  sess_date date;
  defer_activation boolean;
begin
  if new.package_id is null then
    return new;
  end if;

  select is_paid, first_lesson_date
  into pkg
  from packages
  where id = new.package_id;

  if not found then
    raise exception 'Package not found';
  end if;

  if not pkg.is_paid then
    raise exception 'Unpaid package cannot be used (PKG-05)';
  end if;

  defer_activation :=
    current_setting('mystic.defer_package_activation', true) = 'on';

  if new.status = 'present'
     and pkg.first_lesson_date is null
     and not defer_activation then
    select session_date into sess_date
    from sessions
    where id = new.session_id;

    if sess_date is null then
      raise exception 'Session not found';
    end if;

    update packages
    set
      first_lesson_date = sess_date,
      expires_at = sess_date + interval '3 months'
    where id = new.package_id
      and first_lesson_date is null;
  end if;

  return new;
end;
$$ language plpgsql;

create or replace function backfill_uncharged_attendance(p_package_id uuid)
returns table (charged_count int, remaining_uncharged int)
language plpgsql
security definer
set search_path = public
as $$
declare
  pkg record;
  candidate record;
  attached int := 0;
  leftover int;
begin
  if not is_staff() then
    raise exception 'Not authorized';
  end if;

  select
    id,
    student_id,
    is_paid,
    used_credits,
    total_credits,
    first_lesson_date
  into pkg
  from packages
  where id = p_package_id
  for update;

  if not found then
    raise exception 'Package not found';
  end if;

  if not pkg.is_paid then
    raise exception 'Package must be paid before backfilling credits';
  end if;

  perform set_config('mystic.defer_package_activation', 'on', true);

  for candidate in
    select a.id
    from attendance a
    join sessions s on s.id = a.session_id
    where a.student_id = pkg.student_id
      and a.package_id is null
      and a.deduct_credit = true
    order by s.session_date, a.marked_at nulls last, a.id
  loop
    select used_credits, total_credits
    into pkg.used_credits, pkg.total_credits
    from packages
    where id = p_package_id;

    exit when pkg.used_credits >= pkg.total_credits;

    update attendance
    set package_id = p_package_id
    where id = candidate.id
      and package_id is null;

    if found then
      attached := attached + 1;
    end if;
  end loop;

  perform set_config('mystic.defer_package_activation', 'off', true);

  if pkg.first_lesson_date is null then
    update packages p
    set
      first_lesson_date = sub.first_present,
      expires_at = sub.first_present + interval '3 months'
    from (
      select min(s.session_date) as first_present
      from attendance a
      join sessions s on s.id = a.session_id
      where a.package_id = p_package_id
        and a.status = 'present'
    ) sub
    where p.id = p_package_id
      and p.first_lesson_date is null
      and sub.first_present is not null;
  end if;

  select count(*)::int
  into leftover
  from attendance
  where student_id = pkg.student_id
    and package_id is null
    and deduct_credit = true;

  charged_count := attached;
  remaining_uncharged := leftover;
  return next;
end;
$$;

grant execute on function backfill_uncharged_attendance(uuid) to authenticated;
