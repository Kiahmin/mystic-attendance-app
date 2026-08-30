-- Leftover credits moved to another student as a new paid class pack.

create table package_credit_transfers (
  id uuid primary key default gen_random_uuid(),
  from_package_id uuid not null references packages(id) on delete restrict,
  to_package_id uuid not null references packages(id) on delete restrict,
  from_student_id uuid not null references students(id) on delete restrict,
  to_student_id uuid not null references students(id) on delete restrict,
  credits int not null check (credits >= 1),
  note text,
  created_by uuid references profiles(id) on delete set null,
  created_at timestamptz default now()
);

create index package_credit_transfers_from_package_id_idx
  on package_credit_transfers (from_package_id);
create index package_credit_transfers_to_package_id_idx
  on package_credit_transfers (to_package_id);
create index package_credit_transfers_from_student_id_idx
  on package_credit_transfers (from_student_id);
create index package_credit_transfers_to_student_id_idx
  on package_credit_transfers (to_student_id);

alter table package_credit_transfers enable row level security;

create policy "package_credit_transfers_staff_all"
  on package_credit_transfers for all to authenticated
  using (is_staff()) with check (is_staff());

grant select, insert, update, delete on package_credit_transfers to authenticated;

create or replace function transfer_package_credits(
  p_from_package_id uuid,
  p_to_student_id uuid,
  p_credits int,
  p_note text default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  src record;
  dest_student record;
  new_total int;
  new_remaining int;
  new_forfeited int;
  dest_id uuid;
  transfer_id uuid;
begin
  if not is_staff() then
    raise exception 'Not authorized';
  end if;

  if p_credits is null or p_credits < 1 then
    raise exception 'Transfer at least 1 credit';
  end if;

  if p_to_student_id is null then
    raise exception 'Choose a student to receive the credits';
  end if;

  select
    p.id,
    p.student_id,
    p.session_id,
    p.is_paid,
    p.package_product_id,
    p.total_credits,
    p.used_credits,
    p.remaining_credits,
    p.bonus_credits,
    p.expires_at,
    p.forfeited_credits,
    p.forfeited_at,
    p.payment_method
  into src
  from packages p
  where p.id = p_from_package_id
  for update;

  if not found then
    raise exception 'Package not found';
  end if;

  if src.session_id is not null then
    raise exception 'Event packages cannot transfer credits';
  end if;

  if not src.is_paid then
    raise exception 'Only paid packages can transfer credits';
  end if;

  if src.remaining_credits < p_credits then
    raise exception 'Not enough remaining credits to transfer';
  end if;

  if p_to_student_id = src.student_id then
    raise exception 'Choose a different student to receive the credits';
  end if;

  select id, full_name, payer_id, archived_at
  into dest_student
  from students
  where id = p_to_student_id;

  if not found then
    raise exception 'Destination student not found';
  end if;

  if dest_student.archived_at is not null then
    raise exception 'Cannot transfer credits to an archived student';
  end if;

  new_total := src.total_credits - p_credits;
  if new_total < src.used_credits then
    raise exception 'Cannot transfer credits already used';
  end if;

  new_remaining := new_total - src.used_credits;
  new_forfeited := src.forfeited_credits;
  if new_forfeited is not null then
    new_forfeited := least(new_forfeited, greatest(new_remaining, 0));
  end if;

  update packages
  set
    total_credits = new_total,
    forfeited_credits = case
      when src.forfeited_credits is null then null
      when new_forfeited = 0 then null
      else new_forfeited
    end,
    forfeited_at = case
      when src.forfeited_credits is null then forfeited_at
      when new_forfeited = 0 then null
      else forfeited_at
    end
  where id = src.id;

  insert into packages (
    student_id,
    payer_id,
    package_product_id,
    total_credits,
    bonus_credits,
    customisation_notes,
    is_paid,
    payment_method,
    amount_sgd,
    expires_at
  )
  values (
    dest_student.id,
    dest_student.payer_id,
    src.package_product_id,
    p_credits,
    0,
    null,
    true,
    src.payment_method,
    0,
    src.expires_at
  )
  returning id into dest_id;

  insert into package_credit_transfers (
    from_package_id,
    to_package_id,
    from_student_id,
    to_student_id,
    credits,
    note,
    created_by
  )
  values (
    src.id,
    dest_id,
    src.student_id,
    dest_student.id,
    p_credits,
    nullif(trim(p_note), ''),
    auth.uid()
  )
  returning id into transfer_id;

  return dest_id;
end;
$$;

grant execute on function transfer_package_credits(uuid, uuid, int, text) to authenticated;
