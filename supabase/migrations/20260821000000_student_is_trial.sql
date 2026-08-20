-- Explicit trial flag on students. Packages still record which trial product
-- was assigned; this column is the staff-facing status (convert = clear flag).

alter table students
  add column is_trial boolean not null default false;

update students s
set is_trial = true
where exists (
  select 1
  from packages p
  join package_products pp on pp.id = p.package_product_id
  where p.student_id = s.id
    and pp.product_type in ('trial_group', 'trial_private')
);
