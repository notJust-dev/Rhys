-- Seed data for local development. Creates a test user with 50 chats,
-- and populates the 5 most recent chats with assistant/user messages.
--
-- Sign in as test@example.com / password123 to see this data.

-- ---------- Test user ----------
insert into auth.users (
  id,
  instance_id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) values (
  '00000000-0000-0000-0000-0000000000aa',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'test@example.com',
  crypt('password123', gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{"full_name":"Test User"}',
  false,
  now(),
  now(),
  '',
  '',
  '',
  ''
) on conflict (id) do nothing;

-- GoTrue looks up identities on password sign-in. Without this row the
-- lookup fails with "Database error querying schema".
insert into auth.identities (
  id,
  user_id,
  provider_id,
  identity_data,
  provider,
  last_sign_in_at,
  created_at,
  updated_at
) values (
  gen_random_uuid(),
  '00000000-0000-0000-0000-0000000000aa',
  '00000000-0000-0000-0000-0000000000aa',
  jsonb_build_object(
    'sub', '00000000-0000-0000-0000-0000000000aa',
    'email', 'test@example.com',
    'email_verified', true,
    'phone_verified', false
  ),
  'email',
  now(),
  now(),
  now()
) on conflict do nothing;

-- The profile is auto-created by the on_auth_user_created trigger.

-- ---------- 50 chats ----------
with titles(title) as (
  values
    ('Trip itinerary to Lisbon'),
    ('Fix flaky Jest test in checkout'),
    ('Draft launch announcement email'),
    ('Weekly meal prep ideas'),
    ('Explain TypeScript generics'),
    ('Resume bullet points for promotion'),
    ('Birthday party theme brainstorm'),
    ('React Native vs Flutter tradeoffs'),
    ('Rewrite SQL query for performance'),
    ('Summarize last week''s team standup'),
    ('Tailwind vs vanilla CSS debate'),
    ('Home office desk setup on a budget'),
    ('Negotiating a raise at work'),
    ('Best practices for database migrations'),
    ('Weekend hiking trails near Seattle'),
    ('Designing an onboarding flow'),
    ('Should I learn Rust or Go next?'),
    ('Investing basics for beginners'),
    ('Ideas for a side project'),
    ('Book recommendations on systems thinking'),
    ('Cat training tips for kittens'),
    ('Marathon training plan'),
    ('Debugging a memory leak in Node'),
    ('Explain OAuth PKCE to a junior dev'),
    ('Meal ideas for a picky toddler'),
    ('Planning a bachelor party in Austin'),
    ('Is GraphQL worth it for small apps?'),
    ('How to structure a monorepo'),
    ('Sunday brunch recipe ideas'),
    ('Pros and cons of working remote'),
    ('Writing a cover letter'),
    ('Explain Kubernetes in simple terms'),
    ('Garden planning for spring'),
    ('Best podcasts for product managers'),
    ('Rewrite this paragraph to be concise'),
    ('Python vs Bash for small scripts'),
    ('Christmas gift ideas for parents'),
    ('Compare Postgres and SQLite for mobile'),
    ('How to run a retro effectively'),
    ('Draft a tough 1:1 conversation'),
    ('Learn French in 3 months — plan'),
    ('Pet-friendly apartments in Brooklyn'),
    ('Explain the useEffect cleanup gotcha'),
    ('Wedding speech outline'),
    ('How to write a product spec'),
    ('Home workout routine, no equipment'),
    ('Summarize this research paper'),
    ('Resume review for a data analyst role'),
    ('Reducing AWS bill — where to start'),
    ('Ideas for improving team morale')
),
indexed as (
  select title, row_number() over () as idx from titles
)
insert into public.chats (id, user_id, title, created_at, updated_at)
select
  gen_random_uuid(),
  '00000000-0000-0000-0000-0000000000aa',
  title,
  now() - (idx || ' days')::interval,
  now() - (idx || ' days')::interval
from indexed;

-- ---------- Messages for the 5 most recent chats ----------
do $$
declare
  chat_rec record;
  idx int;
  msg_count int;
begin
  for chat_rec in
    select id, updated_at
    from public.chats
    where user_id = '00000000-0000-0000-0000-0000000000aa'
    order by updated_at desc
    limit 5
  loop
    msg_count := 8 + (floor(random() * 5))::int; -- 8-12 messages per chat
    for idx in 1..msg_count loop
      insert into public.messages (chat_id, role, content, created_at)
      values (
        chat_rec.id,
        case when idx % 2 = 1 then 'user'::public.message_role
             else 'assistant'::public.message_role end,
        case when idx % 2 = 1 then
          'Sample user question ' || idx || ' for this chat.'
        else
          E'Here is a sample **assistant** response #' || idx || E'.\n\n' ||
          E'It demonstrates markdown rendering:\n\n' ||
          E'- First bullet point\n' ||
          E'- Second bullet point with `inline code`\n' ||
          E'- Third bullet with a [link](https://example.com)\n\n' ||
          E'```ts\nconst greet = (name: string) => `Hello, ${name}!`;\n```\n\n' ||
          E'Let me know if you need anything else.'
        end,
        chat_rec.updated_at - ((msg_count - idx) * 30 || ' seconds')::interval
      );
    end loop;
  end loop;
end $$;
