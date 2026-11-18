-- ==========================================================================
-- Tasin Personal OS — Supabase Database Schema
-- Run this SQL in your Supabase Dashboard -> SQL Editor -> New Query
-- ==========================================================================

create table if not exists public.user_workspaces (
  user_id uuid primary key references auth.users(id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- Enable Row Level Security (RLS) so each user can only access their own data
alter table public.user_workspaces enable row level security;

-- Policy: Users can read their own workspace
create policy "Users can view own workspace"
  on public.user_workspaces
  for select
  using (auth.uid() = user_id);

-- Policy: Users can insert their own workspace
create policy "Users can insert own workspace"
  on public.user_workspaces
  for insert
  with check (auth.uid() = user_id);

-- Policy: Users can update their own workspace
create policy "Users can update own workspace"
  on public.user_workspaces
  for update
  using (auth.uid() = user_id);
