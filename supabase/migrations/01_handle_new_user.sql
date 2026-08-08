-- ======================================================================
-- 01_handle_new_user.sql
-- Automated profile creation: whenever a row is inserted into
-- auth.users, create the matching public.profiles row with the user's
-- full name and the default theme.
--
-- The function is SECURITY DEFINER so it bypasses RLS on public.profiles
-- (the trigger fires under the authenticated Postgres role, not under an
-- end-user session, so auth.uid() would otherwise be null).
-- ======================================================================

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, selected_theme)
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data ->> 'full_name',
      new.raw_user_meta_data ->> 'name',
      new.raw_user_meta_data ->> 'user_name',
      ''
    ),
    'emerald'
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
