# Supabase Conventions

## RLS Policies

Always wrap `auth.<function>()` and `current_setting()` calls in a subquery when used in RLS policies. Bare calls re-evaluate for every row, which degrades query performance at scale.

```sql
-- Bad
using (auth.uid() = id);

-- Good
using ((select auth.uid()) = id);
```

## Edge Functions

- Written in Deno (TypeScript)
- Shared utilities go in `functions/_shared/`
- CORS headers must be applied to all responses (use `_shared/cors.ts`)

## Types

After any schema change, regenerate TypeScript types:
- Local: `npm run supa:types:local`
- Remote: `npm run supa:types`
