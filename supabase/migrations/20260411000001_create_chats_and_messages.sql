-- Create message role enum
create type public.message_role as enum ('user', 'assistant');

-- Create chats table
create table public.chats (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  title text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Create messages table
create table public.messages (
  id uuid primary key default gen_random_uuid(),
  chat_id uuid not null references public.chats (id) on delete cascade,
  role public.message_role not null,
  content text not null,
  created_at timestamptz default now() not null
);

-- Enable RLS
alter table public.chats enable row level security;
alter table public.messages enable row level security;

-- Chats: users can CRUD their own chats
create policy "Users can read own chats"
  on public.chats for select
  using ((select auth.uid()) = user_id);

create policy "Users can insert own chats"
  on public.chats for insert
  with check ((select auth.uid()) = user_id);

create policy "Users can update own chats"
  on public.chats for update
  using ((select auth.uid()) = user_id);

create policy "Users can delete own chats"
  on public.chats for delete
  using ((select auth.uid()) = user_id);

-- Messages: users can read/insert messages in their own chats
create policy "Users can read own messages"
  on public.messages for select
  using (
    chat_id in (
      select id from public.chats where user_id = (select auth.uid())
    )
  );

create policy "Users can insert own messages"
  on public.messages for insert
  with check (
    chat_id in (
      select id from public.chats where user_id = (select auth.uid())
    )
  );

create policy "Users can update own messages"
  on public.messages for update
  using (
    chat_id in (
      select id from public.chats where user_id = (select auth.uid())
    )
  )
  with check (
    chat_id in (
      select id from public.chats where user_id = (select auth.uid())
    )
  );

-- Index for fast message lookup by chat
create index messages_chat_id_idx on public.messages (chat_id);

-- Index for fast chat lookup by user
create index chats_user_id_idx on public.chats (user_id);
