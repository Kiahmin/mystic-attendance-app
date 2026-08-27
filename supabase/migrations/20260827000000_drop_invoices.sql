-- Receipts were unused; payment stays on packages.

drop policy if exists "invoices_staff_all" on public.invoices;
drop table if exists public.invoices;
