-- Add super_admin as a profiles role. Super-admins are staff and admins
-- for RLS; only they will be allowed to invite staff in the app.

alter table public.profiles
  drop constraint if exists profiles_role_check;

alter table public.profiles
  add constraint profiles_role_check
  check (role in ('admin', 'coach', 'super_admin'));

create or replace function public.is_staff()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role in ('admin', 'coach', 'super_admin')
  );
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role in ('admin', 'super_admin')
  );
$$;

update public.profiles p
set role = 'super_admin'
from auth.users u
where p.id = u.id
  and u.email in ('kiahminh@gmail.com', 'lloydyeoys@gmail.com');
