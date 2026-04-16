import * as Sentry from "@sentry/react-native";
import { MutationCache, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { SafeAreaProvider } from "react-native-safe-area-context";
import PostHogProvider from "./Posthog/PosthogProvider";
import SentryProvider from "./Sentry/SentryProvider";
import SupabaseProvider from "./Supabase";

const queryClient = new QueryClient({
  mutationCache: new MutationCache({
    onError: (error, _variables, _context, mutation) => {
      Sentry.captureException(error, {
        tags: { feature: "mutation" },
        extra: { mutationKey: mutation.options.mutationKey },
      });
    },
  }),
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <SupabaseProvider>
          <SentryProvider>
            <PostHogProvider>
              <KeyboardProvider>
                {children}
              </KeyboardProvider>
            </PostHogProvider>
          </SentryProvider>
        </SupabaseProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
