-- Seed data to test Needs renewal / Overshot → Inform popup → Informed list.
-- Run in the Supabase SQL editor (or psql) as a role that bypasses RLS.
-- Safe to re-run: previous rows tagged notes = 'inform-feature-seed' are removed first.
--
-- What you should see on Admin dashboard:
--   Needs renewal
--     Inform Test Mei   — 8-credit pack, 2 left, 6 charged classes in the popup
--     Inform Test Kai   — shared pack with Nora; popup lists both names
--     Inform Test Lina  — 8-credit pack, exactly finished (0 left)
--   Overshot
--     Inform Test Rui   — 8-credit pack, 2 extra lessons; Inform then confirm
--   Informed
--     Inform Test Priya — finishing pack, already informed (1 lesson left)
--     Inform Test Lara  — overshot pack, already informed (Overshot badge)
--   Not listed
--     Inform Test Ben   — finishing pack, but a renewal pack is already assigned

begin;

-- ---------------------------------------------------------------------------
-- Cleanup previous run
-- ---------------------------------------------------------------------------
delete from attendance
where student_id in (
  select id from students where notes = 'inform-feature-seed'
)
or package_id in (
  select id from packages
  where student_id in (select id from students where notes = 'inform-feature-seed')
);

delete from packages
where student_id in (select id from students where notes = 'inform-feature-seed');

delete from enrolments
where student_id in (select id from students where notes = 'inform-feature-seed');

delete from students
where notes = 'inform-feature-seed';

delete from payers
where notes = 'inform-feature-seed';

-- ---------------------------------------------------------------------------
-- Fixture ids
-- ---------------------------------------------------------------------------
-- Students
--  a0e10001-… Mei (solo due soon)
--  a0e10002-… Kai (shared pack primary)
--  a0e10003-… Nora (shared pack member)
--  a0e10004-… Priya (already informed, finishing)
--  a0e10005-… Ben (has renewal — hidden from due soon)
--  a0e10006-… Rui (overshot, not informed)
--  a0e10007-… Lara (overshot, already informed)
--  a0e10008-… Lina (exhausted, not informed)
-- Packages
--  a0e20001-… Mei finishing
--  a0e20002-… Kai/Nora finishing
--  a0e20003-… Priya finishing + informed
--  a0e20004-… Ben finishing
--  a0e20005-… Ben renewal (8 remaining)
--  a0e20006-… Rui overshot
--  a0e20007-… Lara overshot + informed
--  a0e20008-… Lina exhausted

insert into payers (id, kind, display_name, phone, notes)
values (
  'a0e30000-0000-4000-8000-000000000001',
  'person',
  'Inform Test Payer',
  '+65 8000 0001',
  'inform-feature-seed'
);

insert into students (
  id, full_name, date_of_birth, guardian_name, guardian_phone,
  contact_phone, skill_level, notes, payer_id
) values
  (
    'a0e10001-0000-4000-8000-000000000001',
    'Inform Test Mei',
    '1996-04-18',
    null,
    null,
    '+65 8000 1001',
    'beginner',
    'inform-feature-seed',
    'a0e30000-0000-4000-8000-000000000001'
  ),
  (
    'a0e10002-0000-4000-8000-000000000002',
    'Inform Test Kai',
    '2014-09-02',
    'Inform Test Parent Ong',
    '+65 8000 1002',
    null,
    'beginner',
    'inform-feature-seed',
    'a0e30000-0000-4000-8000-000000000001'
  ),
  (
    'a0e10003-0000-4000-8000-000000000003',
    'Inform Test Nora',
    '2016-02-11',
    'Inform Test Parent Ong',
    '+65 8000 1002',
    null,
    'beginner',
    'inform-feature-seed',
    'a0e30000-0000-4000-8000-000000000001'
  ),
  (
    'a0e10004-0000-4000-8000-000000000004',
    'Inform Test Priya',
    '1999-11-30',
    null,
    null,
    '+65 8000 1004',
    'intermediate',
    'inform-feature-seed',
    'a0e30000-0000-4000-8000-000000000001'
  ),
  (
    'a0e10005-0000-4000-8000-000000000005',
    'Inform Test Ben',
    '1994-07-08',
    null,
    null,
    '+65 8000 1005',
    'freestyle',
    'inform-feature-seed',
    'a0e30000-0000-4000-8000-000000000001'
  ),
  (
    'a0e10006-0000-4000-8000-000000000006',
    'Inform Test Rui',
    '1997-01-14',
    null,
    null,
    '+65 8000 1006',
    'intermediate',
    'inform-feature-seed',
    'a0e30000-0000-4000-8000-000000000001'
  ),
  (
    'a0e10007-0000-4000-8000-000000000007',
    'Inform Test Lara',
    '1993-05-21',
    null,
    null,
    '+65 8000 1007',
    'advanced',
    'inform-feature-seed',
    'a0e30000-0000-4000-8000-000000000001'
  ),
  (
    'a0e10008-0000-4000-8000-000000000008',
    'Inform Test Lina',
    '1995-08-03',
    null,
    null,
    '+65 8000 1008',
    'beginner',
    'inform-feature-seed',
    'a0e30000-0000-4000-8000-000000000001'
  );

insert into enrolments (student_id, class_id)
select s.id, c.id
from students s
cross join lateral (
  select id
  from classes
  where is_active
  order by name
  limit 1
) c
where s.notes = 'inform-feature-seed';

insert into packages (
  id,
  student_id,
  payer_id,
  package_product_id,
  total_credits,
  bonus_credits,
  used_credits,
  is_paid,
  payment_method,
  amount_sgd,
  first_lesson_date,
  expires_at,
  informed_at
)
select
  p.id,
  p.student_id,
  'a0e30000-0000-4000-8000-000000000001',
  prod.id,
  p.total_credits,
  0,
  0,
  true,
  'paynow',
  prod.amount_sgd,
  p.first_lesson,
  p.expires_at,
  p.informed_at
from (
  values
    (
      'a0e20001-0000-4000-8000-000000000001'::uuid,
      'a0e10001-0000-4000-8000-000000000001'::uuid,
      8,
      (current_date - 56),
      (current_date - 56 + 180),
      null::timestamptz
    ),
    (
      'a0e20002-0000-4000-8000-000000000002'::uuid,
      'a0e10002-0000-4000-8000-000000000002'::uuid,
      8,
      (current_date - 49),
      (current_date - 49 + 180),
      null::timestamptz
    ),
    (
      'a0e20003-0000-4000-8000-000000000003'::uuid,
      'a0e10004-0000-4000-8000-000000000004'::uuid,
      8,
      (current_date - 63),
      (current_date - 63 + 180),
      now() - interval '1 day'
    ),
    (
      'a0e20004-0000-4000-8000-000000000004'::uuid,
      'a0e10005-0000-4000-8000-000000000005'::uuid,
      8,
      (current_date - 42),
      (current_date - 42 + 180),
      null::timestamptz
    ),
    (
      'a0e20005-0000-4000-8000-000000000005'::uuid,
      'a0e10005-0000-4000-8000-000000000005'::uuid,
      8,
      null::date,
      null::date,
      null::timestamptz
    ),
    (
      'a0e20006-0000-4000-8000-000000000006'::uuid,
      'a0e10006-0000-4000-8000-000000000006'::uuid,
      8,
      (current_date - 77),
      (current_date - 77 + 180),
      null::timestamptz
    ),
    (
      'a0e20007-0000-4000-8000-000000000007'::uuid,
      'a0e10007-0000-4000-8000-000000000007'::uuid,
      8,
      (current_date - 84),
      (current_date - 84 + 180),
      now() - interval '2 hours'
    ),
    (
      'a0e20008-0000-4000-8000-000000000008'::uuid,
      'a0e10008-0000-4000-8000-000000000008'::uuid,
      8,
      (current_date - 70),
      (current_date - 70 + 180),
      null::timestamptz
    )
) as p(id, student_id, total_credits, first_lesson, expires_at, informed_at)
cross join lateral (
  select id, amount_sgd
  from package_products
  where product_type = 'group'
    and total_credits = 8
    and is_active
  order by sort_order
  limit 1
) prod;

insert into package_students (package_id, student_id)
values (
  'a0e20002-0000-4000-8000-000000000002',
  'a0e10003-0000-4000-8000-000000000003'
)
on conflict do nothing;

-- Class-day sessions for the enrolled class (reuse existing rows).
insert into sessions (
  class_id,
  kind,
  session_date,
  coach_id,
  start_time,
  end_time,
  cancelled,
  requires_attendance
)
select
  c.id,
  'class',
  d::date,
  c.coach_id,
  c.start_time,
  c.end_time,
  false,
  true
from classes c
join enrolments e
  on e.class_id = c.id
 and e.student_id = 'a0e10001-0000-4000-8000-000000000001'
join generate_series(current_date - 120, current_date - 1, interval '1 day') d
  on extract(dow from d) = case c.day_of_week
    when 'sunday' then 0
    when 'monday' then 1
    when 'tuesday' then 2
    when 'wednesday' then 3
    when 'thursday' then 4
    when 'friday' then 5
    when 'saturday' then 6
  end
on conflict (class_id, session_date) do nothing;

-- Newest 12 matching class days (overshot packs need more than 8 charges).
with class_days as (
  select s.id, s.session_date,
    row_number() over (order by s.session_date desc) as rn
  from sessions s
  join enrolments e
    on e.class_id = s.class_id
   and e.student_id = 'a0e10001-0000-4000-8000-000000000001'
  where s.kind = 'class'
    and s.cancelled = false
    and s.session_date < current_date
),
picked as (
  select id, session_date, rn
  from class_days
  where rn <= 12
),
admin as (
  select id
  from profiles
  where role = 'admin'
  order by created_at
  limit 1
)
insert into attendance (
  session_id,
  student_id,
  status,
  attendee_source,
  deduct_credit,
  package_id,
  marked_by,
  marked_at
)
select
  x.session_id,
  x.student_id,
  x.status,
  'enrolled',
  true,
  x.package_id,
  admin.id,
  (x.session_date + time '12:00') at time zone 'Asia/Singapore'
from admin
cross join (
  -- Mei: 6 charged classes on finishing pack (1 no-show so popup is not all Present)
  select p.id as session_id, p.session_date,
    'a0e10001-0000-4000-8000-000000000001'::uuid as student_id,
    'a0e20001-0000-4000-8000-000000000001'::uuid as package_id,
    case when p.rn = 3 then 'no_show' else 'present' end as status
  from picked p
  where p.rn between 3 and 8

  union all
  -- Kai: 4 present on shared pack
  select p.id, p.session_date,
    'a0e10002-0000-4000-8000-000000000002'::uuid,
    'a0e20002-0000-4000-8000-000000000002'::uuid,
    'present'
  from picked p
  where p.rn between 5 and 8

  union all
  -- Nora: 2 present on the same shared pack
  select p.id, p.session_date,
    'a0e10003-0000-4000-8000-000000000003'::uuid,
    'a0e20002-0000-4000-8000-000000000002'::uuid,
    'present'
  from picked p
  where p.rn between 3 and 4

  union all
  -- Priya: 7 present → 1 remaining, already informed
  select p.id, p.session_date,
    'a0e10004-0000-4000-8000-000000000004'::uuid,
    'a0e20003-0000-4000-8000-000000000003'::uuid,
    'present'
  from picked p
  where p.rn between 2 and 8

  union all
  -- Ben finishing pack: 6 present → 2 remaining (renewal pack has no attendance)
  select p.id, p.session_date,
    'a0e10005-0000-4000-8000-000000000005'::uuid,
    'a0e20004-0000-4000-8000-000000000004'::uuid,
    'present'
  from picked p
  where p.rn between 3 and 8

  union all
  -- Rui: 10 present on 8-credit pack → 2 extra, not informed
  select p.id, p.session_date,
    'a0e10006-0000-4000-8000-000000000006'::uuid,
    'a0e20006-0000-4000-8000-000000000006'::uuid,
    'present'
  from picked p
  where p.rn between 1 and 10

  union all
  -- Lara: 9 present on 8-credit pack → 1 extra, already informed
  select p.id, p.session_date,
    'a0e10007-0000-4000-8000-000000000007'::uuid,
    'a0e20007-0000-4000-8000-000000000007'::uuid,
    'present'
  from picked p
  where p.rn between 2 and 10

  union all
  -- Lina: 8 present on 8-credit pack → exhausted, not informed
  select p.id, p.session_date,
    'a0e10008-0000-4000-8000-000000000008'::uuid,
    'a0e20008-0000-4000-8000-000000000008'::uuid,
    'present'
  from picked p
  where p.rn between 1 and 8
) x
on conflict (session_id, student_id) do update
set
  status = excluded.status,
  deduct_credit = excluded.deduct_credit,
  package_id = excluded.package_id,
  marked_by = excluded.marked_by,
  marked_at = excluded.marked_at;

commit;

-- Sanity check
select
  st.full_name,
  pkg.id as package_id,
  pkg.remaining_credits,
  pkg.status,
  pkg.informed_at is not null as informed,
  (
    select count(*)
    from attendance a
    where a.package_id = pkg.id
      and a.deduct_credit
  ) as charged_classes
from packages pkg
join students st on st.id = pkg.student_id
where st.notes = 'inform-feature-seed'
order by st.full_name, pkg.created_at;
