-- Shared class packages: one credit pool, many students.
-- packages.student_id stays the primary (invoice / pay / pause). Event packs stay 1:1.

create table package_students (
  package_id uuid not null references packages(id) on delete cascade,
  student_id uuid not null references students(id) on delete restrict,
  created_at timestamptz default now(),
  primary key (package_id, student_id)
);

create index package_students_student_id_idx on package_students (student_id);

insert into package_students (package_id, student_id)
select id, student_id
from packages
on conflict do nothing;

create or replace function sync_package_primary_student()
returns trigger as $$
begin
  insert into package_students (package_id, student_id)
  values (new.id, new.student_id)
  on conflict do nothing;
  return new;
end;
$$ language plpgsql;

create trigger packages_sync_primary_member
  after insert or update of student_id on packages
  for each row execute function sync_package_primary_student();

create or replace function enforce_package_students()
returns trigger as $$
declare
  pkg record;
begin
  select student_id, session_id
  into pkg
  from packages
  where id = new.package_id;

  if not found then
    raise exception 'Package not found';
  end if;

  if pkg.session_id is not null and new.student_id is distinct from pkg.student_id then
    raise exception 'Event packages cannot be shared';
  end if;

  return new;
end;
$$ language plpgsql;

create trigger package_students_enforce
  before insert or update on package_students
  for each row execute function enforce_package_students();

create or replace function prevent_removing_primary_package_student()
returns trigger as $$
declare
  primary_id uuid;
begin
  select student_id into primary_id
  from packages
  where id = old.package_id;

  if primary_id is not null and old.student_id = primary_id then
    raise exception 'Cannot remove the primary student from a package';
  end if;

  return old;
end;
$$ language plpgsql;

create trigger package_students_keep_primary
  before delete on package_students
  for each row execute function prevent_removing_primary_package_student();

alter table package_students enable row level security;

create policy "package_students_staff_all"
  on package_students for all to authenticated
  using (is_staff()) with check (is_staff());

grant select, insert, update, delete on package_students to authenticated;

create or replace function resolve_chargeable_package(
  p_student_id uuid,
  p_session_date date
)
returns uuid
language sql
stable
as $$
  select p.id
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
