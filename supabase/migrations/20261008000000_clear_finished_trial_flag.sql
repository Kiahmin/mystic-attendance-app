-- Trial badge follows unused trial credits. Charging the last credit (present
-- or no-show) clears students.is_trial; refunding it restores the flag.
-- Students who already finished a trial are corrected in the backfill below.

create or replace function student_has_open_trial(
  p_student_id uuid,
  p_exclude_package_id uuid default null
)
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from package_students ps
    join packages p on p.id = ps.package_id
    join package_products pp on pp.id = p.package_product_id
    where ps.student_id = p_student_id
      and pp.product_type in ('trial_group', 'trial_private')
      and p.remaining_credits > 0
      and (p_exclude_package_id is null or p.id <> p_exclude_package_id)
  );
$$;

create or replace function sync_student_trial_flag(
  p_student_id uuid,
  p_exclude_package_id uuid default null
)
returns void
language plpgsql
as $$
begin
  if p_student_id is null then
    return;
  end if;

  update students s
  set is_trial = open_trial.has_open
  from (
    select student_has_open_trial(p_student_id, p_exclude_package_id) as has_open
  ) open_trial
  where s.id = p_student_id
    and s.is_trial is distinct from open_trial.has_open;
end;
$$;

create or replace function sync_trial_flags_for_package_members(
  p_package_id uuid,
  p_exclude_package boolean
)
returns void
language plpgsql
as $$
declare
  member_id uuid;
  exclude_id uuid;
begin
  exclude_id := case when p_exclude_package then p_package_id else null end;

  for member_id in
    select ps.student_id
    from package_students ps
    where ps.package_id = p_package_id
  loop
    perform sync_student_trial_flag(member_id, exclude_id);
  end loop;
end;
$$;

-- Runs after packages_sync_primary_member so the primary student is already
-- in package_students when a trial pack is inserted.
create or replace function sync_trial_flag_on_package_write()
returns trigger as $$
declare
  product_type text;
begin
  select pp.product_type
  into product_type
  from package_products pp
  where pp.id = new.package_product_id;

  if product_type is null
     or product_type not in ('trial_group', 'trial_private') then
    return new;
  end if;

  if tg_op = 'UPDATE'
     and new.used_credits is not distinct from old.used_credits
     and new.total_credits is not distinct from old.total_credits then
    return new;
  end if;

  perform sync_trial_flags_for_package_members(new.id, false);
  return new;
end;
$$ language plpgsql;

create trigger packages_sync_trial_flag
  after insert or update of used_credits, total_credits on packages
  for each row execute function sync_trial_flag_on_package_write();

-- package_students cascades away before AFTER DELETE, so sync while members
-- still exist and ignore the pack being removed.
create or replace function sync_trial_flag_before_package_delete()
returns trigger as $$
declare
  product_type text;
begin
  select pp.product_type
  into product_type
  from package_products pp
  where pp.id = old.package_product_id;

  if product_type is null
     or product_type not in ('trial_group', 'trial_private') then
    return old;
  end if;

  perform sync_trial_flags_for_package_members(old.id, true);
  return old;
end;
$$ language plpgsql;

create trigger packages_sync_trial_flag_before_delete
  before delete on packages
  for each row execute function sync_trial_flag_before_package_delete();

update students s
set is_trial = open_trial.has_open
from (
  select
    s2.id,
    exists (
      select 1
      from package_students ps
      join packages p on p.id = ps.package_id
      join package_products pp on pp.id = p.package_product_id
      where ps.student_id = s2.id
        and pp.product_type in ('trial_group', 'trial_private')
        and p.remaining_credits > 0
    ) as has_open
  from students s2
) open_trial
where s.id = open_trial.id
  and s.is_trial is distinct from open_trial.has_open;
