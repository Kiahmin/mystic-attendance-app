-- Mystic Skates — initial schema
-- Source: docs/schema.md

-- ---------------------------------------------------------------------------
-- Core tables
-- ---------------------------------------------------------------------------

create table profiles (
  id          uuid references auth.users primary key,
  full_name   text not null,
  role        text check (role in ('admin', 'coach')) not null,
  phone       text,
  created_at  timestamptz default now()
);

create table students (
  id              uuid default gen_random_uuid() primary key,
  full_name       text not null,
  date_of_birth   date,
  is_minor        boolean,
  guardian_name   text,
  guardian_phone  text,
  contact_phone   text,
  skill_level     text check (skill_level in ('beginner', 'intermediate', 'advanced', 'freestyle')),
  notes           text,
  created_at      timestamptz default now()
);

create or replace function set_student_is_minor()
returns trigger as $$
begin
  new.is_minor := new.date_of_birth is not null
    and new.date_of_birth > current_date - interval '18 years';
  return new;
end;
$$ language plpgsql;

create trigger students_set_is_minor
  before insert or update of date_of_birth on students
  for each row execute function set_student_is_minor();

create table classes (
  id          uuid default gen_random_uuid() primary key,
  name        text not null,
  day_of_week text check (day_of_week in ('saturday', 'sunday')),
  start_time  time not null,
  end_time    time not null,
  coach_id    uuid references profiles(id),
  is_active   boolean default true
);

create table enrolments (
  id          uuid default gen_random_uuid() primary key,
  student_id  uuid references students(id) on delete cascade,
  class_id    uuid references classes(id) on delete cascade,
  enrolled_at timestamptz default now(),
  unique (student_id, class_id)
);

-- ---------------------------------------------------------------------------
-- Packages
-- ---------------------------------------------------------------------------

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
         and current_date >= p_paused_at then 'paused'
    when p_expires_at is not null and p_expires_at < current_date then 'expired'
    when p_used_credits >= p_total_credits then 'exhausted'
    else 'active'
  end;
$$;

create table packages (
  id                uuid default gen_random_uuid() primary key,
  student_id        uuid references students(id) on delete cascade,
  total_credits     int not null,
  used_credits      int default 0,
  remaining_credits int generated always as (total_credits - used_credits) stored,
  forfeited_credits int,
  forfeited_at      timestamptz,
  payment_method    text check (payment_method in ('cash', 'bank_transfer', 'paynow')),
  amount_sgd        numeric(8, 2),
  is_paid           boolean default false,
  first_lesson_date date,
  expires_at        date,
  paused_at         date,
  pause_ends_at     date,
  paused_reason     text,
  resumed_at        date,
  pause_used        boolean not null default false,
  status            text,
  created_at        timestamptz default now(),
  check (not pause_used or paused_at is not null),
  check (
    (paused_at is null and pause_ends_at is null and paused_reason is null)
    or (paused_at is not null and pause_ends_at is not null and paused_reason is not null)
  ),
  check (pause_ends_at is null or pause_ends_at >= paused_at),
  check (resumed_at is null or resumed_at >= paused_at),
  check (forfeited_credits is null or forfeited_at is not null),
  check (forfeited_at is null or forfeited_credits is not null),
  check (forfeited_credits is null or (forfeited_credits >= 0 and forfeited_credits <= total_credits)),
  check (is_paid = true or first_lesson_date is null),
  check (first_lesson_date is null or expires_at is not null)
);

create or replace function set_package_status()
returns trigger as $$
begin
  new.status := compute_package_status(
    new.is_paid,
    new.paused_at,
    new.resumed_at,
    new.expires_at,
    new.used_credits,
    new.total_credits
  );
  return new;
end;
$$ language plpgsql;

create trigger packages_set_status
  before insert or update on packages
  for each row execute function set_package_status();

-- ---------------------------------------------------------------------------
-- Sessions & attendance
-- ---------------------------------------------------------------------------

create table sessions (
  id                  uuid default gen_random_uuid() primary key,
  class_id            uuid references classes(id),
  session_date        date not null,
  cancelled           boolean default false,
  cancellation_reason text check (cancellation_reason in (
                        'weather', 'facility', 'coach_unavailable',
                        'public_holiday', 'other'
                      )),
  cancellation_note   text,
  cancelled_by        uuid references profiles(id),
  cancelled_at        timestamptz,
  created_at          timestamptz default now(),
  check (not cancelled or cancellation_reason is not null),
  check (cancellation_reason != 'other' or cancellation_note is not null)
);

create table attendance (
  id              uuid default gen_random_uuid() primary key,
  session_id      uuid references sessions(id),
  student_id      uuid references students(id),
  status          text check (status in (
                    'present', 'absent', 'no_show',
                    'cancelled_valid', 'cancelled_late',
                    'session_cancelled',
                    'complimentary', 'walk_in'
                  )),
  walk_in_status  text check (walk_in_status in ('admitted', 'declined')),
  decline_reason  text,
  deduct_credit   boolean default true,
  package_id      uuid references packages(id),
  marked_by       uuid references profiles(id),
  marked_at       timestamptz default now(),
  override_by     uuid references profiles(id),
  override_reason text,
  override_at     timestamptz,
  unique (session_id, student_id),
  check (
    (override_reason is null and override_by is null and override_at is null)
    or (override_reason is not null and override_by is not null and override_at is not null)
  ),
  check (status = 'walk_in' or (walk_in_status is null and decline_reason is null)),
  check (status != 'walk_in' or walk_in_status is not null),
  check (walk_in_status != 'declined' or decline_reason is not null),
  check (walk_in_status != 'admitted' or decline_reason is null)
);

-- ---------------------------------------------------------------------------
-- Package helpers & triggers
-- ---------------------------------------------------------------------------

create or replace function enforce_package_on_attendance()
returns trigger as $$
declare
  pkg record;
  sess_date date;
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

  if new.status = 'present' and pkg.first_lesson_date is null then
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

create trigger attendance_enforce_package
  before insert or update on attendance
  for each row execute function enforce_package_on_attendance();

create or replace function record_package_forfeiture()
returns trigger as $$
declare
  is_paused boolean;
  is_expired boolean;
begin
  is_paused := new.paused_at is not null
    and new.resumed_at is null
    and current_date >= new.paused_at;
  is_expired := new.expires_at is not null and new.expires_at < current_date;

  if is_expired and not is_paused and new.forfeited_at is null then
    new.forfeited_credits := greatest(new.total_credits - new.used_credits, 0);
    new.forfeited_at := now();
  end if;

  if tg_op = 'UPDATE' and old.forfeited_at is not null and (
    new.forfeited_credits is distinct from old.forfeited_credits
    or new.forfeited_at is distinct from old.forfeited_at
  ) then
    raise exception 'Forfeiture record is immutable (PKG-03)';
  end if;

  return new;
end;
$$ language plpgsql;

create trigger packages_record_forfeiture
  before insert or update on packages
  for each row execute function record_package_forfeiture();

create or replace function enforce_one_pause_per_package()
returns trigger as $$
begin
  if tg_op = 'INSERT' then
    if new.paused_at is not null then
      new.pause_used := true;
    end if;
    if new.pause_used and new.paused_at is null then
      raise exception 'pause_used requires a recorded pause (PKG-04)';
    end if;
    return new;
  end if;

  if not old.pause_used and new.paused_at is not null then
    new.pause_used := true;
  end if;

  if old.pause_used and (
    new.paused_at is distinct from old.paused_at
    or new.pause_ends_at is distinct from old.pause_ends_at
    or new.paused_reason is distinct from old.paused_reason
    or new.pause_used is distinct from old.pause_used
  ) then
    raise exception 'Only one pause allowed per package (PKG-04)';
  end if;

  return new;
end;
$$ language plpgsql;

create trigger packages_one_pause
  before insert or update on packages
  for each row execute function enforce_one_pause_per_package();

create or replace function resolve_chargeable_package(
  p_student_id uuid,
  p_session_date date
)
returns uuid
language sql
stable
as $$
  select id
  from packages
  where student_id = p_student_id
    and is_paid = true
    and compute_package_status(
      is_paid, paused_at, resumed_at, expires_at, used_credits, total_credits
    ) = 'active'
    and remaining_credits > 0
    and (expires_at is null or expires_at >= p_session_date)
  order by coalesce(first_lesson_date, created_at::date), created_at
  limit 1;
$$;

-- ---------------------------------------------------------------------------
-- Credit deduction (PKG-02)
-- ---------------------------------------------------------------------------

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
        and compute_package_status(
          is_paid, paused_at, resumed_at, expires_at, used_credits, total_credits
        ) = 'active'
        and remaining_credits > 0
    );
$$;

create or replace function apply_package_credit_delta(
  p_package_id uuid,
  p_delta int
)
returns void
language plpgsql
as $$
begin
  if p_delta = 0 or p_package_id is null then
    return;
  end if;

  update packages
  set used_credits = greatest(used_credits + p_delta, 0)
  where id = p_package_id;
end;
$$;

create or replace function handle_credit_deduction()
returns trigger as $$
declare
  old_charged boolean;
  new_charged boolean;
begin
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

create trigger on_attendance_credit_change
  after insert or update on attendance
  for each row execute function handle_credit_deduction();
