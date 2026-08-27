-- Billing contacts. A payer can cover many students (siblings, company).
-- Guardian fields on students stay for under-18 contact and are not the bill-to.

create table payers (
  id            uuid default gen_random_uuid() primary key,
  kind          text not null check (kind in ('person', 'company')),
  display_name  text,
  phone         text,
  notes         text,
  created_at    timestamptz default now(),
  check (
    (display_name is not null and btrim(display_name) <> '')
    or (phone is not null and btrim(phone) <> '')
  )
);

create index payers_display_name_idx on payers (display_name);
create index payers_phone_idx on payers (phone);

alter table students
  add column if not exists payer_id uuid references payers(id);

alter table packages
  add column if not exists payer_id uuid references payers(id);

create index if not exists students_payer_id_idx on students (payer_id);
create index if not exists packages_payer_id_idx on packages (payer_id);

alter table payers enable row level security;

create policy "payers_staff_all"
  on payers for all to authenticated
  using (is_staff()) with check (is_staff());

grant select, insert, update, delete on payers to authenticated;
