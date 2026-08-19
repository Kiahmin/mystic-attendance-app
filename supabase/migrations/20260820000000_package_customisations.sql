-- Per-student package customisations at assignment time.
-- Catalog product still required; total_credits may differ from the product.
-- bonus_credits are complimentary lessons included in total_credits.

alter table packages
  add column bonus_credits int not null default 0
    check (bonus_credits >= 0),
  add column customisation_notes text;

alter table packages
  add constraint packages_bonus_credits_lte_total
    check (bonus_credits <= total_credits);
