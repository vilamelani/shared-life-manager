alter table public.households
alter column created_by set default auth.uid();

drop policy if exists "Users can create households" on public.households;
create policy "Users can create households"
on public.households
for insert
with check (auth.uid() is not null);
