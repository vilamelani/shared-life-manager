drop policy if exists "Users can read their households" on public.households;

create policy "Users can read their households"
on public.households
for select
using (
  created_by = auth.uid()
  or exists (
    select 1
    from public.household_memberships membership
    where membership.household_id = households.id
      and membership.user_id = auth.uid()
  )
);
