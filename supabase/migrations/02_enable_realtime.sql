-- ======================================================================
-- 02_enable_realtime.sql
-- Enable Realtime for sponsorship_deals so the dashboard can subscribe to
-- live INSERT / UPDATE / DELETE changes per user.
--
-- Realtime still enforces RLS: a subscriber only receives changes for
-- rows they are allowed to SELECT (auth.uid() = user_id), so users never
-- see each other's deals over the websocket.
-- ======================================================================

-- Add the table to the supabase_realtime publication (idempotent).
do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'sponsorship_deals'
  ) then
    alter publication supabase_realtime add table public.sponsorship_deals;
  end if;
end
$$;

-- Ship the full old row on UPDATE / DELETE so Realtime can evaluate the
-- RLS policy and deliver complete payloads (not just the primary key).
alter table public.sponsorship_deals replica identity full;
