-- Ensure at most one session row per class per calendar date (idempotent generation).
delete from sessions a
using sessions b
where a.class_id = b.class_id
  and a.session_date = b.session_date
  and a.created_at > b.created_at;

alter table sessions
  add constraint sessions_class_id_session_date_key unique (class_id, session_date);
