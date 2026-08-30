-- Attach 50 past packages to one student for list/pagination testing.
-- Prefers Alex Tan (seed id), otherwise the first non-archived student.

insert into packages (
  student_id,
  package_product_id,
  total_credits,
  used_credits,
  is_paid,
  payment_method,
  amount_sgd,
  first_lesson_date,
  expires_at,
  created_at
)
select
  s.id,
  p.id,
  p.total_credits,
  case when g % 3 = 0 then p.total_credits else greatest(p.total_credits - 2, 0) end,
  true,
  'paynow',
  p.amount_sgd,
  d.first_lesson,
  d.expires_at,
  d.created_at
from generate_series(1, 50) as g
cross join lateral (
  select id
  from students
  where archived_at is null
  order by
    case when id = 'cccccccc-cccc-cccc-cccc-cccccccccccc' then 0 else 1 end,
    full_name
  limit 1
) s
join lateral (
  select id, total_credits, amount_sgd
  from package_products
  where product_type in ('group', 'freestyle', 'private')
    and is_active
  order by sort_order
  offset (g - 1) % 9
  limit 1
) p on true
join lateral (
  select
    (date '2024-01-06' + ((g - 1) * 7))::date as first_lesson,
    (date '2024-04-06' + ((g - 1) * 7))::date as expires_at,
    (timestamptz '2024-01-01 00:00:00+08' + ((g - 1) * interval '7 days')) as created_at
) d on true;
