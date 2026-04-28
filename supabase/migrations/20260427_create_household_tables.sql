create table if not exists public.households (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  invite_code text not null unique,
  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default now()
);

create table if not exists public.household_memberships (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.households(id) on delete cascade,
  user_id uuid not null references auth.users(id),
  role text not null check (role in ('owner', 'member')),
  joined_at timestamptz not null default now(),
  unique (household_id, user_id)
);

alter table public.households enable row level security;
alter table public.household_memberships enable row level security;

create policy "Users can read their households"
on public.households
for select
using (
  exists (
    select 1
    from public.household_memberships membership
    where membership.household_id = households.id
      and membership.user_id = auth.uid()
  )
);

create policy "Users can create households"
on public.households
for insert
with check (created_by = auth.uid());

create policy "Users can read their memberships"
on public.household_memberships
for select
using (user_id = auth.uid());

create policy "Users can create memberships for themselves"
on public.household_memberships
for insert
with check (user_id = auth.uid());
