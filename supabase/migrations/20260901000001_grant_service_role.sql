-- Data API calls as service_role (secret / legacy JWT) still need table grants.
-- Invites insert into profiles via the admin client; authenticated already had these.

grant usage on schema public to service_role;
grant select, insert, update, delete on all tables in schema public to service_role;
grant usage, select on all sequences in schema public to service_role;

alter default privileges in schema public
  grant select, insert, update, delete on tables to service_role;
