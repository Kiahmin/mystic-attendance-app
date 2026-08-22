-- Per-student event packages: 1-credit unpaid packs tied to one take-attendance
-- event. Class check-in and class-pack backfill ignore these rows.

alter table package_products
  drop constraint package_products_product_type_check;

alter table package_products
  add constraint package_products_product_type_check
  check (product_type in (
    'group',
    'freestyle',
    'private',
    'trial_group',
    'trial_private',
    'event'
  ));

insert into package_products (
  product_type, label, total_credits, amount_sgd, sort_order
)
values ('event', 'Event', 1, 0, 50);

alter table packages
  add column session_id uuid references sessions(id) on delete cascade;

create index packages_session_id_idx
  on packages (session_id);

create unique index packages_student_session_unique
  on packages (student_id, session_id)
  where session_id is not null;

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
    and session_id is null
    and is_paid = true
    and compute_package_status(
      is_paid, paused_at, resumed_at, expires_at, used_credits, total_credits
    ) = 'active'
    and remaining_credits > 0
    and (expires_at is null or expires_at >= p_session_date)
  order by coalesce(first_lesson_date, created_at::date), created_at
  limit 1;
$$;

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
