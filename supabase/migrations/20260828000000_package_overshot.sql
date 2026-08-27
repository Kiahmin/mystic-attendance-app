-- Overshot: attending after remaining hits 0 stays on the pack (used > total).
-- Unpaid packs still block charging. Event packs do not overshoot.

create or replace function compute_package_status(
  p_is_paid boolean,
  p_paused_at date,
  p_resumed_at date,
  p_expires_at date,
  p_used_credits int,
  p_total_credits int
)
returns text
language sql
stable
as $$
  select case
    when not coalesce(p_is_paid, false) then 'unpaid'
    when p_paused_at is not null
         and p_resumed_at is null
         and app_today() >= p_paused_at then 'paused'
    when coalesce(p_used_credits, 0) > coalesce(p_total_credits, 0) then 'overshot'
    when coalesce(p_used_credits, 0) >= coalesce(p_total_credits, 0) then 'exhausted'
    when p_expires_at is not null and p_expires_at < app_today() then 'expired'
    else 'active'
  end;
$$;

-- Charge whenever a paid, unpaused pack is attached. Remaining may go negative.
create or replace function attendance_is_charged(
  p_deduct_credit boolean,
  p_package_id uuid
)
returns boolean
language sql
stable
as $$
  select
    p_deduct_credit = true
    and p_package_id is not null
    and exists (
      select 1
      from packages
      where id = p_package_id
        and is_paid = true
        and not (
          paused_at is not null
          and resumed_at is null
          and app_today() >= paused_at
        )
    );
$$;

create or replace function resolve_chargeable_package(
  p_student_id uuid,
  p_session_date date
)
returns uuid
language plpgsql
stable
as $$
declare
  chosen uuid;
  unpaid_exists boolean;
begin
  select p.id
  into chosen
  from packages p
  where p.session_id is null
    and p.is_paid = true
    and compute_package_status(
      p.is_paid, p.paused_at, p.resumed_at, p.expires_at, p.used_credits, p.total_credits
    ) = 'active'
    and p.remaining_credits > 0
    and (p.expires_at is null or p.expires_at >= p_session_date)
    and exists (
      select 1
      from package_students ps
      where ps.package_id = p.id
        and ps.student_id = p_student_id
    )
  order by coalesce(p.first_lesson_date, p.created_at::date), p.created_at
  limit 1;

  if chosen is not null then
    return chosen;
  end if;

  select exists (
    select 1
    from packages p
    where p.session_id is null
      and p.is_paid = false
      and exists (
        select 1
        from package_students ps
        where ps.package_id = p.id
          and ps.student_id = p_student_id
      )
  )
  into unpaid_exists;

  if unpaid_exists then
    return null;
  end if;

  select p.id
  into chosen
  from packages p
  where p.session_id is null
    and p.is_paid = true
    and compute_package_status(
      p.is_paid, p.paused_at, p.resumed_at, p.expires_at, p.used_credits, p.total_credits
    ) in ('exhausted', 'overshot')
    and (p.expires_at is null or p.expires_at >= p_session_date)
    and exists (
      select 1
      from package_students ps
      where ps.package_id = p.id
        and ps.student_id = p_student_id
    )
  order by coalesce(p.first_lesson_date, p.created_at::date) desc, p.created_at desc
  limit 1;

  return chosen;
end;
$$;

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
        expires_at = coalesce(expires_at, (sess_date + interval '3 months')::date)
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
          (sub.first_present + interval '3 months')::date
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

grant execute on function resolve_chargeable_package(uuid, date) to authenticated;
grant execute on function backfill_uncharged_attendance(uuid) to authenticated;

update packages
set status = compute_package_status(
  is_paid, paused_at, resumed_at, expires_at, used_credits, total_credits
);
