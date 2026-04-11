# Supabase Conventions

## RLS Policies

Always wrap `auth.<function>()` and `current_setting()` calls in a subquery when used in RLS policies. Bare calls re-evaluate for every row, which degrades query performance at scale.

```sql
-- Bad
using (auth.uid() = id);

-- Good
using ((select auth.uid()) = id);
```

## Queries

Even though RLS enforces access control, always filter by `user_id` (or equivalent) in application queries. This lets Postgres use indexes efficiently instead of relying solely on RLS to filter rows.

## Edge Functions

- Written in Deno (TypeScript)
- Shared utilities go in `functions/_shared/`
- CORS headers must be applied to all responses (use `_shared/cors.ts`)

## Types

After any schema change, regenerate TypeScript types:
- Local: `npm run supa:types:local`
- Remote: `npm run supa:types`
