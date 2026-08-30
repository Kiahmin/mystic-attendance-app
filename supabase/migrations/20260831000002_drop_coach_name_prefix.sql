-- Display coaches as "Kim" / "Lloyd", not "Coach Kim".

update public.profiles
set full_name = trim(regexp_replace(full_name, '^\s*Coach\s+', ''))
where role = 'coach'
  and full_name ~* '^\s*Coach\s+';

update auth.users u
set raw_user_meta_data = coalesce(u.raw_user_meta_data, '{}'::jsonb)
  || jsonb_build_object(
    'full_name', p.full_name,
    'name', p.full_name,
    'display_name', p.full_name
  )
from public.profiles p
where p.id = u.id
  and p.role = 'coach';
