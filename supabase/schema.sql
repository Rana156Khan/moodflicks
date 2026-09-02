-- Run this once in the Supabase SQL Editor (Dashboard → SQL Editor → New query)

create table public.recommendations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  genre text not null,
  mood text not null,
  note text default '',
  created_at timestamptz not null default now()
);

alter table public.recommendations enable row level security;

create policy "Users can view their own recommendations"
  on public.recommendations for select
  using (auth.uid() = user_id);

create policy "Users can insert their own recommendations"
  on public.recommendations for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own recommendations"
  on public.recommendations for update
  using (auth.uid() = user_id);

create policy "Users can delete their own recommendations"
  on public.recommendations for delete
  using (auth.uid() = user_id);
