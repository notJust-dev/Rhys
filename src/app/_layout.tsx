import "../global.css";

import { Providers } from "@/providers";
import { useSubscription } from "@/providers/RevenueCat/RevenueCatProvider";
import { useAuth } from "@/providers/Supabase/AuthProvider";
import { Stack } from "expo-router";

export function RootStack() {
  const { isAuthenticated } = useAuth();
  const { isSubscribed } = useSubscription();

  return (
    <Stack>
      <Stack.Protected guard={!isAuthenticated}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      </Stack.Protected>

      <Stack.Protected guard={isAuthenticated && !isSubscribed}>
        <Stack.Screen
          name="paywall"
          options={{ headerShown: false, gestureEnabled: false }}
        />
      </Stack.Protected>

      <Stack.Protected guard={isAuthenticated && isSubscribed}>
        <Stack.Screen name="(protected)" options={{ headerShown: false }} />
      </Stack.Protected>

      <Stack.Screen name="subscription-confirmation" options={{ headerShown: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <Providers>
      <RootStack />
    </Providers>
  );
}
