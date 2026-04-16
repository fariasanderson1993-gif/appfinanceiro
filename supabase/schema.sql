-- ============================================
-- SCHEMA: app finança
-- Run this in Supabase SQL Editor
-- ============================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================
-- TRANSACTIONS TABLE
-- ============================================
create table if not exists public.transactions (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  description text not null,
  amount      numeric(12, 2) not null check (amount > 0),
  type        text not null check (type in ('income', 'expense')),
  category    text not null,
  date        date not null,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- Index for faster queries by user and date
create index if not exists transactions_user_id_idx on public.transactions(user_id);
create index if not exists transactions_date_idx on public.transactions(date desc);
create index if not exists transactions_type_idx on public.transactions(type);
create index if not exists transactions_category_idx on public.transactions(category);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
alter table public.transactions enable row level security;

-- Users can only see their own transactions
create policy "Users can view own transactions"
  on public.transactions for select
  using (auth.uid() = user_id);

-- Users can insert their own transactions
create policy "Users can insert own transactions"
  on public.transactions for insert
  with check (auth.uid() = user_id);

-- Users can update their own transactions
create policy "Users can update own transactions"
  on public.transactions for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Users can delete their own transactions
create policy "Users can delete own transactions"
  on public.transactions for delete
  using (auth.uid() = user_id);

-- ============================================
-- AUTO-UPDATE updated_at trigger
-- ============================================
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger transactions_updated_at
  before update on public.transactions
  for each row execute procedure public.handle_updated_at();
