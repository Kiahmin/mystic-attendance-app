-- Development seed data
-- Loaded automatically on `supabase db reset` (see supabase/config.toml).
-- Password for all auth users below: password123 (local dev only).

-- ---------------------------------------------------------------------------
-- Auth users & profiles
-- ---------------------------------------------------------------------------

insert into auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  confirmation_token,
  recovery_token,
  email_change_token_new,
  email_change,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at
) values
  (
    '00000000-0000-0000-0000-000000000000',
    '11111111-1111-1111-1111-111111111111',
    'authenticated',
    'authenticated',
    'admin@mystic.local',
    crypt('password123', gen_salt('bf')),
    now(),
    '',
    '',
    '',
    '',
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"Admin User"}',
    now(),
    now()
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    '22222222-2222-2222-2222-222222222222',
    'authenticated',
    'authenticated',
    'coach@mystic.local',
    crypt('password123', gen_salt('bf')),
    now(),
    '',
    '',
    '',
    '',
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"Kim"}',
    now(),
    now()
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    '33333333-3333-3333-3333-333333333333',
    'authenticated',
    'authenticated',
    'lloyd@mystic.local',
    crypt('password123', gen_salt('bf')),
    now(),
    '',
    '',
    '',
    '',
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"Lloyd"}',
    now(),
    now()
  );

insert into auth.identities (
  id,
  user_id,
  identity_data,
  provider,
  provider_id,
  last_sign_in_at,
  created_at,
  updated_at
) values
  (
    gen_random_uuid(),
    '11111111-1111-1111-1111-111111111111',
    format('{"sub":"%s","email":"admin@mystic.local"}', '11111111-1111-1111-1111-111111111111')::jsonb,
    'email',
    '11111111-1111-1111-1111-111111111111',
    now(),
    now(),
    now()
  ),
  (
    gen_random_uuid(),
    '22222222-2222-2222-2222-222222222222',
    format('{"sub":"%s","email":"coach@mystic.local"}', '22222222-2222-2222-2222-222222222222')::jsonb,
    'email',
    '22222222-2222-2222-2222-222222222222',
    now(),
    now(),
    now()
  ),
  (
    gen_random_uuid(),
    '33333333-3333-3333-3333-333333333333',
    format('{"sub":"%s","email":"lloyd@mystic.local"}', '33333333-3333-3333-3333-333333333333')::jsonb,
    'email',
    '33333333-3333-3333-3333-333333333333',
    now(),
    now(),
    now()
  );

insert into profiles (id, full_name, role, phone) values
  ('11111111-1111-1111-1111-111111111111', 'Admin User', 'admin', null),
  ('22222222-2222-2222-2222-222222222222', 'Kim', 'coach', '+65 9000 0001'),
  ('33333333-3333-3333-3333-333333333333', 'Lloyd', 'coach', '+65 9000 0002');

-- ---------------------------------------------------------------------------
-- Classes
-- ---------------------------------------------------------------------------

insert into classes (id, name, day_of_week, start_time, end_time, coach_id, is_active, venue_id) values
  (
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'Saturday Beginners',
    'saturday',
    '09:00',
    '10:00',
    '22222222-2222-2222-2222-222222222222',
    true,
    (select id from venues where name = 'Stadium')
  ),
  (
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    'Sunday Freestyle',
    'sunday',
    '10:30',
    '11:30',
    '22222222-2222-2222-2222-222222222222',
    true,
    (select id from venues where name = 'Stadium')
  );

-- ---------------------------------------------------------------------------
-- Students
-- ---------------------------------------------------------------------------

insert into students (
  id,
  full_name,
  date_of_birth,
  guardian_name,
  guardian_phone,
  contact_phone,
  skill_level
) values
  (
    'cccccccc-cccc-cccc-cccc-cccccccccccc',
    'Alex Tan',
    '2015-03-12',
    'Parent Tan',
    '+65 9111 1111',
    null,
    'beginner'
  ),
  (
    'dddddddd-dddd-dddd-dddd-dddddddddddd',
    'Jordan Lee',
    '1998-07-22',
    null,
    null,
    '+65 9222 2222',
    'intermediate'
  ),
  (
    'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
    'Sam Wong',
    '2012-11-05',
    'Parent Wong',
    '+65 9333 3333',
    null,
    'beginner'
  ),
  (
    'c1c1c1c1-c1c1-c1c1-c1c1-c1c1c1c1c1c1',
    'Alexa Tan',
    '2017-08-04',
    'Parent Tan',
    '+65 9111 1111',
    null,
    'beginner'
  );

-- ---------------------------------------------------------------------------
-- Enrolments
-- ---------------------------------------------------------------------------

insert into enrolments (student_id, class_id) values
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'),
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'),
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'),
  ('c1c1c1c1-c1c1-c1c1-c1c1-c1c1c1c1c1c1', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa');

-- ---------------------------------------------------------------------------
-- Packages (paid, not yet activated — first_lesson_date set on first Present)
-- ---------------------------------------------------------------------------

insert into packages (
  id,
  student_id,
  total_credits,
  is_paid,
  payment_method,
  amount_sgd
) values
  (
    'ffffffff-ffff-ffff-ffff-ffffffffffff',
    'cccccccc-cccc-cccc-cccc-cccccccccccc',
    8,
    true,
    'paynow',
    320.00
  ),
  (
    '10101010-1010-1010-1010-101010101010',
    'dddddddd-dddd-dddd-dddd-dddddddddddd',
    4,
    true,
    'bank_transfer',
    180.00
  ),
  (
    '20202020-2020-2020-2020-202020202020',
    'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
    12,
    false,
    null,
    null
  );

insert into package_students (package_id, student_id) values
  ('ffffffff-ffff-ffff-ffff-ffffffffffff', 'c1c1c1c1-c1c1-c1c1-c1c1-c1c1c1c1c1c1');

-- ---------------------------------------------------------------------------
-- Sessions (upcoming Saturday class — dates in Asia/Singapore)
-- ---------------------------------------------------------------------------

insert into sessions (id, class_id, session_date, coach_id, start_time, end_time, venue_id)
select
  '30303030-3030-3030-3030-303030303030',
  c.id,
  sg.today,
  c.coach_id,
  c.start_time,
  c.end_time,
  c.venue_id
from classes c
cross join (
  select (current_timestamp at time zone 'Asia/Singapore')::date as today
) sg
where c.id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'
union all
select
  '40404040-4040-4040-4040-404040404040',
  c.id,
  sg.today + (
    case
      when extract(dow from sg.today) <= 6
        then (6 - extract(dow from sg.today))::int
      else 7
    end
  ),
  c.coach_id,
  c.start_time,
  c.end_time,
  c.venue_id
from classes c
cross join (
  select (current_timestamp at time zone 'Asia/Singapore')::date as today
) sg
where c.id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
