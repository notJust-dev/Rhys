import * as Sentry from "@sentry/react-native";
import { useRouter } from "expo-router";
import { StyleSheet } from "react-native";
import RevenueCatUI from "react-native-purchases-ui";

export default function PaywallScreen() {
  const router = useRouter();

  return (
    <RevenueCatUI.Paywall
      style={StyleSheet.absoluteFill}
      onPurchaseCompleted={() => {
        router.replace("/subscription-confirmation");
      }}
      onRestoreCompleted={() => {
        router.replace("/subscription-confirmation");
      }}
      onDismiss={() => {
        if (router.canGoBack()) router.back();
      }}
      onPurchaseError={({ error }) => {
        Sentry.captureException(error, {
          tags: { feature: "paywall", step: "purchase" },
        });
      }}
      onRestoreError={({ error }) => {
        Sentry.captureException(error, {
          tags: { feature: "paywall", step: "restore" },
        });
      }}
    />
  );
}
