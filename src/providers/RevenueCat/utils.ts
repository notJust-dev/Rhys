import * as Sentry from '@sentry/react-native';
import { router } from 'expo-router';
import { Alert } from 'react-native';
import Purchases from 'react-native-purchases';
import RevenueCatUI, { PAYWALL_RESULT } from 'react-native-purchases-ui';

export async function presentPaywallIfNeeded(entitlement: string): Promise<boolean> {
  // Present paywall for current offering:
  const paywallResult: PAYWALL_RESULT = await RevenueCatUI.presentPaywallIfNeeded({ requiredEntitlementIdentifier: entitlement });

  switch (paywallResult) {
    case PAYWALL_RESULT.NOT_PRESENTED:
    case PAYWALL_RESULT.ERROR:
      Alert.alert('Error', 'There was an error with your purchase. Please try again.');
      Sentry.captureException(new Error('Error presenting the paywall'));
      return false;
    case PAYWALL_RESULT.CANCELLED:
      return false;
    case PAYWALL_RESULT.PURCHASED:
    case PAYWALL_RESULT.RESTORED:
      router.replace('/subscription-confirmation');
      return true;
    default:
      return false;
  }
}

export async function restorePurchases() {
  try {
    const restore = await Purchases.restorePurchases();
    Alert.alert('Purchases restored', 'Your purchases have been restored');
  } catch (e) {
    console.error(e);
    Sentry.captureException(e);
  }
}
