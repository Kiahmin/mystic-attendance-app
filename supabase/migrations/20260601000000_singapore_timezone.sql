-- Use Singapore calendar date for all business-day logic (matches the Next.js app).

create or replace function app_today()
returns date
language sql
stable
as $$
  select (current_timestamp at time zone 'Asia/Singapore')::date;
$$;

create or replace function set_student_is_minor()
returns trigger as $$
begin
  new.is_minor := new.date_of_birth is not null
    and new.date_of_birth > app_today() - interval '18 years';
  return new;
end;
$$ language plpgsql;

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
    when p_expires_at is not null and p_expires_at < app_today() then 'expired'
    when p_used_credits >= p_total_credits then 'exhausted'
    else 'active'
  end;
$$;

create or replace function record_package_forfeiture()
returns trigger as $$
declare
  is_paused boolean;
  is_expired boolean;
begin
  is_paused := new.paused_at is not null
    and new.resumed_at is null
    and app_today() >= new.paused_at;
  is_expired := new.expires_at is not null and new.expires_at < app_today();

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
