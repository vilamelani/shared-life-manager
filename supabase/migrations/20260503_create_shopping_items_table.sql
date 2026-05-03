create table if not exists public.shopping_items (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.households(id) on delete cascade,
  name text not null,
  quantity integer not null default 1 check (quantity > 0),
  added_by_user_id uuid not null references auth.users(id),
  is_completed boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.shopping_items enable row level security;

create policy "Members can read shopping items"
on public.shopping_items
for select
using (
  exists (
    select 1
    from public.household_memberships membership
    where membership.household_id = shopping_items.household_id
      and membership.user_id = auth.uid()
  )
);

create policy "Members can create shopping items"
on public.shopping_items
for insert
with check (
  added_by_user_id = auth.uid()
  and exists (
    select 1
    from public.household_memberships membership
    where membership.household_id = shopping_items.household_id
      and membership.user_id = auth.uid()
  )
);

create policy "Members can update shopping items"
on public.shopping_items
for update
using (
  exists (
    select 1
    from public.household_memberships membership
    where membership.household_id = shopping_items.household_id
      and membership.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.household_memberships membership
    where membership.household_id = shopping_items.household_id
      and membership.user_id = auth.uid()
  )
);

create policy "Members can delete shopping items"
on public.shopping_items
for delete
using (
  exists (
    select 1
    from public.household_memberships membership
    where membership.household_id = shopping_items.household_id
      and membership.user_id = auth.uid()
  )
);
