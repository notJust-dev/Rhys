-- Create profiles table
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  name text,
  avatar_url text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Enable RLS
alter table public.profiles enable row level security;

-- Users can read their own profile
create policy "Users can read own profile"
  on public.profiles for select
  using ((select auth.uid()) = id);

-- Users can update their own profile
create policy "Users can update own profile"
  on public.profiles for update
  using ((select auth.uid()) = id);

-- Function to create a profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, name, avatar_url)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$;

-- Trigger after user creation
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
