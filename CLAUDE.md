# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- **Dev server**: `npm start` (Expo dev server)
- **iOS**: `npm run ios`
- **Android**: `npm run android`
- **Web**: `npm run web`
- **Lint**: `npm run lint`
- **Supabase Edge Functions locally**: `npm run supa:serve`
- **Generate DB types (remote)**: `npm run supa:types`
- **Generate DB types (local)**: `npm run supa:types:local`

## Architecture

Expo 55 + React Native 0.83 chat app with Supabase backend and OpenAI integration.

**Routing**: Expo Router (file-based) in `src/app/`. Unauthenticated users see `index.tsx` (welcome screen); authenticated users enter `(home)/` group (drawer layout with chat screen).

**Styling**: Tailwind CSS v4 via NativeWind v5. Use CSS-wrapped components from `src/tw/` (View, Text, Pressable, etc.) which accept `className` props. Do not use raw React Native components with `style` props.

**Provider stack** (in `src/providers/index.tsx`): SafeAreaProvider → QueryClientProvider → SupabaseProvider → AuthProvider → KeyboardProvider.

**Auth**: Anonymous sign-in via Supabase. AuthProvider (`src/providers/Supabase/AuthProvider.tsx`) manages session state and exposes it through React Context. A database trigger auto-creates a `profiles` row on signup.

**Chat flow**: `useChat` hook (`src/hooks/useChat.ts`) manages message state locally, invokes the `chat` Supabase Edge Function (`supabase/functions/chat/index.ts`) which proxies to OpenAI GPT-4o-mini.

**Keyboard handling**: Uses `react-native-keyboard-controller` for smooth keyboard-aware scrolling and sticky input positioning.

## Key Conventions

- Path aliases: `@/*` → `./src/*`, `@/assets/*` → `./assets/*`
- Database types are auto-generated in `src/types/database.types.ts` — regenerate after schema changes with `npm run supa:types:local`
- Supabase-specific conventions (RLS, Edge Functions) are in `supabase/CLAUDE.md`
- React Compiler and typed routes are enabled (`app.json` experiments)

## Known Issues

- `expo-dev-client` pinned to 55.0.24 due to iOS build failure in v55.0.26+ (https://github.com/expo/expo/issues/44677)
