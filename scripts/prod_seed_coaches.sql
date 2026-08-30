-- Staff coaches for production. Idempotent.
-- Creates Auth users + profiles only when that email and display name are unused.
-- Does not set a known password (unusable random hash). Invite or reset in the
-- Auth dashboard if they need to sign in. Never demotes an existing admin.

begin;

create temporary table seed_coaches (
  full_name text primary key,
  email     text unique not null
);

insert into seed_coaches (full_name, email) values
  ('Mabel', 'mabel@mystic.local'),
  ('Jasmine', 'jasmine@mystic.local'),
  ('Lloyd', 'lloyd@mystic.local'),
  ('Zai Yang', 'zaiyang@mystic.local'),
  ('Felix', 'felix@mystic.local'),
  ('Kiah Min', 'kiahmin@mystic.local'),
  ('Seana', 'seana@mystic.local'),
  ('Charmaine', 'charmaine@mystic.local');

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
)
select
  coalesce(
    (select id from auth.instances limit 1),
    '00000000-0000-0000-0000-000000000000'
  ),
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  sc.email,
  crypt(encode(gen_random_bytes(24), 'hex'), gen_salt('bf')),
  now(),
  '',
  '',
  '',
  '',
  '{"provider":"email","providers":["email"]}'::jsonb,
  jsonb_build_object(
    'full_name', sc.full_name,
    'name', sc.full_name,
    'display_name', sc.full_name
  ),
  now(),
  now()
from seed_coaches sc
where not exists (
  select 1 from auth.users u where lower(u.email) = lower(sc.email)
)
and not exists (
  select 1
  from public.profiles p
  where lower(p.full_name) = lower(sc.full_name)
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
)
select
  gen_random_uuid(),
  u.id,
  jsonb_build_object('sub', u.id::text, 'email', u.email),
  'email',
  u.id::text,
  now(),
  now(),
  now()
from auth.users u
join seed_coaches sc on lower(u.email) = lower(sc.email)
where not exists (
  select 1
  from auth.identities i
  where i.user_id = u.id
    and i.provider = 'email'
);

insert into public.profiles (id, full_name, role, phone)
select
  u.id,
  sc.full_name,
  'coach',
  null
from seed_coaches sc
join auth.users u on lower(u.email) = lower(sc.email)
on conflict (id) do update
set
  full_name = excluded.full_name,
  role = case
    when public.profiles.role = 'admin' then public.profiles.role
    else 'coach'
  end;

-- Name-only match: dashboard-created users with no/wrong email still get a profile.
insert into public.profiles (id, full_name, role, phone)
select
  u.id,
  sc.full_name,
  'coach',
  null
from seed_coaches sc
join auth.users u
  on lower(coalesce(u.raw_user_meta_data->>'full_name', u.raw_user_meta_data->>'name', ''))
     = lower(sc.full_name)
where not exists (
  select 1 from public.profiles p where p.id = u.id
)
on conflict (id) do nothing;

commit;
