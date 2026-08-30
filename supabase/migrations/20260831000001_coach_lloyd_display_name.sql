-- Auth dashboard "name" comes from user metadata. The app lists coaches from
-- profiles.full_name. Creating Lloyd in Auth alone left both empty.

update auth.users
set raw_user_meta_data = coalesce(raw_user_meta_data, '{}'::jsonb) || jsonb_build_object(
  'full_name', 'Coach Lloyd',
  'name', 'Coach Lloyd',
  'display_name', 'Coach Lloyd'
)
where email = 'lloyd@mystic.local';

insert into public.profiles (id, full_name, role, phone)
select
  id,
  'Coach Lloyd',
  'coach',
  null
from auth.users
where email = 'lloyd@mystic.local'
on conflict (id) do update
set
  full_name = excluded.full_name,
  role = 'coach';
