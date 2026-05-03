create table if not exists public.savings_goals (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.households(id) on delete cascade,
  title text not null,
  target_amount numeric(12, 2) not null check (target_amount > 0),
  target_date date null,
  created_by_user_id uuid not null references auth.users(id),
  created_at timestamptz not null default now()
);

create table if not exists public.savings_contributions (
  id uuid primary key default gen_random_uuid(),
  savings_goal_id uuid not null references public.savings_goals(id) on delete cascade,
  household_id uuid not null references public.households(id) on delete cascade,
  amount numeric(12, 2) not null check (amount > 0),
  contributed_by_user_id uuid not null references auth.users(id),
  created_at timestamptz not null default now()
);

alter table public.savings_goals enable row level security;
alter table public.savings_contributions enable row level security;

create policy "Members can read savings goals"
on public.savings_goals
for select
using (
  exists (
    select 1
    from public.household_memberships membership
    where membership.household_id = savings_goals.household_id
      and membership.user_id = auth.uid()
  )
);

create policy "Members can create savings goals"
on public.savings_goals
for insert
with check (
  created_by_user_id = auth.uid()
  and exists (
    select 1
    from public.household_memberships membership
    where membership.household_id = savings_goals.household_id
      and membership.user_id = auth.uid()
  )
);

create policy "Members can read savings contributions"
on public.savings_contributions
for select
using (
  exists (
    select 1
    from public.household_memberships membership
    where membership.household_id = savings_contributions.household_id
      and membership.user_id = auth.uid()
  )
);

create policy "Members can create savings contributions"
on public.savings_contributions
for insert
with check (
  contributed_by_user_id = auth.uid()
  and exists (
    select 1
    from public.household_memberships membership
    where membership.household_id = savings_contributions.household_id
      and membership.user_id = auth.uid()
  )
);
