import { Platform } from 'react-native';
import Purchases, { LOG_LEVEL } from 'react-native-purchases';

export const iosApiKey: string | undefined =
  process.env.EXPO_PUBLIC_REVENUECAT_API_KEY_IOS;

export const androidApiKey: string | undefined =
  process.env.EXPO_PUBLIC_REVENUECAT_API_KEY_ANDROID;

export const testApiKey: string | undefined =
  process.env.EXPO_PUBLIC_REVENUECAT_API_KEY_TEST;

export const apiKey =
  __DEV__
    ? testApiKey
    : Platform.select<string>({
      ios: iosApiKey,
      android: androidApiKey,
    });

export const logLevel: LOG_LEVEL =
  process.env.EXPO_PUBLIC_REVENUECAT_LOG_LEVEL as LOG_LEVEL || Purchases.LOG_LEVEL.DEBUG;

// export const entitlement =
//   process.env.EXPO_PUBLIC_REVENUECAT_ENTITLEMENT || 'premium';
