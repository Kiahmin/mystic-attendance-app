-- Simple receipts: one invoice per paid package. Created when a package
-- is marked paid. No drafts, line items, PDF, or GST.

create table invoices (
  id              uuid default gen_random_uuid() primary key,
  invoice_number  int generated always as identity unique,
  package_id      uuid not null unique references packages(id) on delete restrict,
  payer_id        uuid not null references payers(id),
  student_id      uuid not null references students(id),
  amount_sgd      numeric(8, 2) not null,
  payment_method  text not null check (payment_method in ('cash', 'bank_transfer', 'paynow')),
  paid_at         date not null,
  created_at      timestamptz default now()
);

create index invoices_payer_id_idx on invoices (payer_id);
create index invoices_student_id_idx on invoices (student_id);
create index invoices_paid_at_idx on invoices (paid_at desc);

alter table invoices enable row level security;

create policy "invoices_staff_all"
  on invoices for all to authenticated
  using (is_staff()) with check (is_staff());

grant select, insert, update, delete on invoices to authenticated;
grant usage, select on all sequences in schema public to authenticated;
