-- Event packs stay Active through last event day + 3 days so attendance can
-- be entered after the session. Used packs stay exhausted instead of flipping
-- to expired when that window ends.

create or replace function event_package_expires_on(p_session_date date)
returns date
language sql
immutable
as $$
  select (p_session_date + 3)::date;
$$;

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
    when p_used_credits >= p_total_credits then 'exhausted'
    when p_expires_at is not null and p_expires_at < app_today() then 'expired'
    else 'active'
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
        expires_at = sess_date + interval '3 months'
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
    where a.student_id = pkg.student_id
      and a.package_id is null
      and a.deduct_credit = true
      and (
        (pkg.session_id is not null and a.session_id = pkg.session_id)
        or (pkg.session_id is null and s.kind = 'class')
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
  end if;

  select count(*)::int
  into leftover
  from attendance a
  join sessions s on s.id = a.session_id
  where a.student_id = pkg.student_id
    and a.package_id is null
    and a.deduct_credit = true
    and (
      (pkg.session_id is not null and a.session_id = pkg.session_id)
      or (pkg.session_id is null and s.kind = 'class')
    );

  charged_count := attached;
  remaining_uncharged := leftover;
  return next;
end;
$$;

update packages p
set expires_at = event_package_expires_on(s.session_date)
from sessions s
where p.session_id = s.id;

update packages
set status = compute_package_status(
  is_paid, paused_at, resumed_at, expires_at, used_credits, total_credits
);
