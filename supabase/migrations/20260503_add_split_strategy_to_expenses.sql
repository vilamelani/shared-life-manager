alter table public.expenses
add column if not exists split_strategy text not null default 'equal_split'
check (split_strategy in ('equal_split'));
