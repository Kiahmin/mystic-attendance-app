-- Catalog of sellable package products (group / freestyle / private / trials).
-- Default prices match mysticskates.com; charged amount still lives on packages.amount_sgd.

create table package_products (
  id uuid primary key default gen_random_uuid(),
  product_type text not null
    check (product_type in (
      'group',
      'freestyle',
      'private',
      'trial_group',
      'trial_private'
    )),
  label text not null,
  total_credits int not null check (total_credits > 0),
  amount_sgd numeric(8, 2) not null check (amount_sgd >= 0),
  is_active boolean not null default true,
  sort_order int not null default 0,
  unique (product_type, total_credits)
);

insert into package_products (product_type, label, total_credits, amount_sgd, sort_order)
values
  ('group', 'Group', 4, 130, 10),
  ('group', 'Group', 8, 250, 11),
  ('group', 'Group', 12, 350, 12),
  ('freestyle', 'Freestyle', 4, 150, 20),
  ('freestyle', 'Freestyle', 8, 290, 21),
  ('freestyle', 'Freestyle', 12, 400, 22),
  ('private', 'Private', 4, 320, 30),
  ('private', 'Private', 8, 580, 31),
  ('private', 'Private', 12, 840, 32),
  ('trial_group', 'Trial (Group)', 1, 25, 40),
  ('trial_private', 'Trial (Private)', 1, 50, 41);

alter table packages
  add column package_product_id uuid references package_products(id);

create index packages_package_product_id_idx
  on packages (package_product_id);

alter table package_products enable row level security;

-- Catalog is read-only from the app; price changes go through migrations/SQL.
create policy "package_products_staff_select"
  on package_products for select to authenticated
  using (is_staff());
