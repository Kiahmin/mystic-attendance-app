-- Standing rental needs live on the student. Purchases that still have to be
-- ordered or handed over live in student_gear_orders.

alter table students
  add column needs_rental_skates boolean not null default false,
  add column needs_rental_gear boolean not null default false,
  add column rental_note text;

create table student_gear_orders (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references students (id) on delete cascade,
  item_name text not null,
  size text,
  notes text,
  status text not null default 'to_order'
    check (status in ('to_order', 'ordered', 'ready', 'given')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  given_at timestamptz,
  constraint student_gear_orders_item_name_not_blank
    check (char_length(btrim(item_name)) > 0)
);

create index student_gear_orders_student_id_idx
  on student_gear_orders (student_id);

create index student_gear_orders_open_status_idx
  on student_gear_orders (status)
  where status <> 'given';

alter table student_gear_orders enable row level security;

create policy "student_gear_orders_staff_all"
  on student_gear_orders
  for all
  to authenticated
  using (is_staff())
  with check (is_staff());

grant select, insert, update, delete on public.student_gear_orders to authenticated;
