-- GoTrue expects empty strings, not NULL, on token columns in auth.users.
-- Manual SQL seeds (seed.sql) and some imports leave these NULL and break login
-- with "Database error querying schema".

update auth.users
set
  confirmation_token = coalesce(confirmation_token, ''),
  recovery_token = coalesce(recovery_token, ''),
  email_change_token_new = coalesce(email_change_token_new, ''),
  email_change = coalesce(email_change, '')
where confirmation_token is null
   or recovery_token is null
   or email_change_token_new is null
   or email_change is null;
