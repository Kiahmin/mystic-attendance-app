-- Tables created after the initial blanket GRANT did not inherit privileges.
-- RLS still applies; this only lets PostgREST reach the tables.

grant select, insert, update, delete on public.package_products to authenticated;
grant select, insert, update, delete on public.session_attendee_overrides to authenticated;

alter default privileges in schema public
  grant select, insert, update, delete on tables to authenticated;
