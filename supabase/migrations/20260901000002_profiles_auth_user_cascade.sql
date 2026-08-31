-- Deleting an Auth user should remove the matching staff profile.
-- The dashboard delete fails without this (profiles.id still references auth.users).

alter table public.profiles
  drop constraint if exists profiles_id_fkey;

alter table public.profiles
  add constraint profiles_id_fkey
  foreign key (id) references auth.users (id) on delete cascade;
