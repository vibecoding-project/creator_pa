create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  avatar_url text,
  selected_theme text not null default 'emerald',
  created_at timestamptz not null default now()
);

create table if not exists public.sponsorship_deals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  brand_name text not null,
  deal_amount integer not null default 0,
  status text not null default 'INBOX'
    check (status in ('INBOX', 'IN_PROGRESS', 'CLOSED_WIN', 'DECLINED')),
  badge_type text
    check (badge_type in ('HIGH BUDGET', 'NEEDS INFO', 'GIFTING')),
  created_at timestamptz not null default now()
);

create index if not exists sponsorship_deals_user_id_idx
  on public.sponsorship_deals (user_id);

create index if not exists sponsorship_deals_created_at_idx
  on public.sponsorship_deals (created_at desc);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id)
  values (new.id);
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.sponsorship_deals enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
  on public.profiles
  for select
  using (auth.uid() = id);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own"
  on public.profiles
  for insert
  with check (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
  on public.profiles
  for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

drop policy if exists "profiles_delete_own" on public.profiles;
create policy "profiles_delete_own"
  on public.profiles
  for delete
  using (auth.uid() = id);

drop policy if exists "deals_select_own" on public.sponsorship_deals;
create policy "deals_select_own"
  on public.sponsorship_deals
  for select
  using (auth.uid() = user_id);

drop policy if exists "deals_insert_own" on public.sponsorship_deals;
create policy "deals_insert_own"
  on public.sponsorship_deals
  for insert
  with check (auth.uid() = user_id);

drop policy if exists "deals_update_own" on public.sponsorship_deals;
create policy "deals_update_own"
  on public.sponsorship_deals
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "deals_delete_own" on public.sponsorship_deals;
create policy "deals_delete_own"
  on public.sponsorship_deals
  for delete
  using (auth.uid() = user_id);
