import { Stack } from "expo-router";
import { Platform } from "react-native";

const iosLargeHeader = Platform.select({
  ios: {
    headerLargeTitle: true,
    headerTransparent: true,
    headerBlurEffect: "regular" as const,
    headerLargeTitleShadowVisible: false,
    headerLargeStyle: { backgroundColor: "transparent" },
    headerBackButtonDisplayMode: "minimal" as const,
  },
  default: {},
});

export default function AuthLayout() {
  return (
    <Stack screenOptions={iosLargeHeader}>
      <Stack.Screen name="sign-in" options={{ title: "Sign in" }} />
      <Stack.Screen name="sign-up" options={{ title: "Sign up" }} />
    </Stack>
  );
}
