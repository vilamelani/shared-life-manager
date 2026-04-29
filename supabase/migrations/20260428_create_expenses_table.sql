create table if not exists public.expenses (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.households(id) on delete cascade,
  title text not null,
  amount numeric(12, 2) not null check (amount > 0),
  paid_by_user_id uuid not null references auth.users(id),
  notes text null,
  created_at timestamptz not null default now()
);

alter table public.expenses enable row level security;

create policy "Members can read household expenses"
on public.expenses
for select
using (
  exists (
    select 1
    from public.household_memberships membership
    where membership.household_id = expenses.household_id
      and membership.user_id = auth.uid()
  )
);

create policy "Members can create household expenses"
on public.expenses
for insert
with check (
  paid_by_user_id = auth.uid()
  and exists (
    select 1
    from public.household_memberships membership
    where membership.household_id = expenses.household_id
      and membership.user_id = auth.uid()
  )
);
