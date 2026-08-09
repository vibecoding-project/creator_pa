-- ======================================================================
-- 03_add_indexes.sql
-- Performance indexes for sponsorship_deals.
--
-- All statements use IF NOT EXISTS so the migration is idempotent and
-- safe to re-run (matching indexes may already exist via schema.sql).
-- ======================================================================

-- User-level lookups: RLS policies filter on auth.uid() = user_id, and
-- dashboards commonly fetch every deal for the signed-in user.
create index if not exists sponsorship_deals_user_id_idx
  on public.sponsorship_deals (user_id);

-- Composite lookup for dashboard status filtering
-- (e.g. "show my IN_PROGRESS deals") — lets the planner hit a single
-- index instead of combining the user_id and status conditions.
create index if not exists sponsorship_deals_user_id_status_idx
  on public.sponsorship_deals (user_id, status);

-- Sorted deal lists: newest-first within a user's deals. The leading
-- user_id column also serves plain user_id queries as a leftmost prefix.
create index if not exists sponsorship_deals_user_created_at_idx
  on public.sponsorship_deals (user_id, created_at desc);
