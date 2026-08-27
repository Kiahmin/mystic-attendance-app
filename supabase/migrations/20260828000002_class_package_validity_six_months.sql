-- Class packs are valid for 6 months from first attendance (workbook rule).
-- Event packs still use event_package_expires_on.

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

  select is_paid, first_lesson_date, session_id
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

    if pkg.session_id is not null then
      update packages
      set
        first_lesson_date = sess_date,
        expires_at = coalesce(expires_at, event_package_expires_on(sess_date))
      where id = new.package_id
        and first_lesson_date is null;
    else
      update packages
      set
        first_lesson_date = sess_date,
        expires_at = coalesce(expires_at, (sess_date + interval '6 months')::date)
      where id = new.package_id
        and first_lesson_date is null;
    end if;
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
  overshot_pkg record;
  extra int;
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
    first_lesson_date,
    session_id
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
    where a.package_id is null
      and a.deduct_credit = true
      and (
        (
          pkg.session_id is not null
          and a.student_id = pkg.student_id
          and a.session_id = pkg.session_id
        )
        or (
          pkg.session_id is null
          and s.kind = 'class'
          and a.student_id in (
            select ps.student_id
            from package_students ps
            where ps.package_id = pkg.id
          )
        )
      )
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

  -- Move extra (overshot) attendance from members' old packs onto this renewal.
  if pkg.session_id is null then
    for overshot_pkg in
      select p.id, p.used_credits, p.total_credits
      from packages p
      where p.id <> p_package_id
        and p.session_id is null
        and p.used_credits > p.total_credits
        and exists (
          select 1
          from package_students old_ps
          join package_students new_ps
            on new_ps.student_id = old_ps.student_id
           and new_ps.package_id = p_package_id
          where old_ps.package_id = p.id
        )
      order by coalesce(p.first_lesson_date, p.created_at::date), p.created_at
    loop
      extra := overshot_pkg.used_credits - overshot_pkg.total_credits;
      if extra <= 0 then
        continue;
      end if;

      for candidate in
        select extras.id
        from (
          select a.id, s.session_date, a.marked_at
          from attendance a
          join sessions s on s.id = a.session_id
          where a.package_id = overshot_pkg.id
            and a.deduct_credit = true
          order by s.session_date desc, a.marked_at desc nulls last, a.id desc
          limit extra
        ) extras
        order by extras.session_date, extras.marked_at nulls last, extras.id
      loop
        select used_credits, total_credits
        into pkg.used_credits, pkg.total_credits
        from packages
        where id = p_package_id;

        exit when pkg.used_credits >= pkg.total_credits;

        update attendance
        set package_id = p_package_id
        where id = candidate.id
          and package_id = overshot_pkg.id;

        if found then
          attached := attached + 1;
        end if;
      end loop;
    end loop;
  end if;

  perform set_config('mystic.defer_package_activation', 'off', true);

  if pkg.first_lesson_date is null then
    if pkg.session_id is not null then
      update packages p
      set
        first_lesson_date = sub.first_present,
        expires_at = coalesce(
          p.expires_at,
          event_package_expires_on(sub.first_present)
        )
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
    else
      update packages p
      set
        first_lesson_date = sub.first_present,
        expires_at = coalesce(
          p.expires_at,
          (sub.first_present + interval '6 months')::date
        )
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
  end if;

  select count(*)::int
  into leftover
  from attendance a
  join sessions s on s.id = a.session_id
  where a.package_id is null
    and a.deduct_credit = true
    and (
      (
        pkg.session_id is not null
        and a.student_id = pkg.student_id
        and a.session_id = pkg.session_id
      )
      or (
        pkg.session_id is null
        and s.kind = 'class'
        and a.student_id in (
          select ps.student_id
          from package_students ps
          where ps.package_id = pkg.id
        )
      )
    );

  charged_count := attached;
  remaining_uncharged := leftover;
  return next;
end;
$$;

