import { Stack } from "expo-router";

export default function ProtectedLayout() {
  return (
    <Stack>
      <Stack.Screen name="(home)" options={{ headerShown: false }} />
      <Stack.Screen
        name="settings"
        options={{
          title: "Settings",
          presentation: "modal",
          headerShown: false
        }}
      />
    </Stack>
  );
}
