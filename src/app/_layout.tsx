import "../global.css";

import { Providers } from "@/providers";
import { useAuth } from "@/providers/Supabase/AuthProvider";
import { Stack } from "expo-router";
export function RootStack() {
  const { isAuthenticated } = useAuth();

  return (
    <Stack>
      <Stack.Protected guard={!isAuthenticated}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
      </Stack.Protected>

      <Stack.Protected guard={isAuthenticated}>
        <Stack.Screen name="(home)" options={{ headerShown: false }} />
      </Stack.Protected>
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
