import { posthog } from '@/providers/Posthog/posthog';
// import { enableAdServicesIfResolved } from '@/toolbox/TrackingTransparency/requestTracking';
import * as Sentry from '@sentry/react-native';
import { PropsWithChildren, useEffect, useRef, useState } from 'react';
import Purchases, { CustomerInfo } from 'react-native-purchases';
import { useUser } from '../Supabase/AuthProvider';
import { apiKey, logLevel } from './config';

export default function RevenueCatProvider({ children }: PropsWithChildren) {
  const [isLoading, setIsLoading] = useState(true);

  const user = useUser();
  const lastIdentifiedUserId = useRef<string | null>(null);

  useEffect(() => {
    if (!apiKey) {
      console.warn('RevenueCat API key is not set');
      setIsLoading(false);
      return;
    }

    try {
      Purchases.setLogLevel(logLevel);
      Purchases.configure({ apiKey });

      // enableAdServicesIfResolved();

      const posthogUserId = posthog?.getDistinctId();
      if (posthogUserId) {
        Purchases.setAttributes({ $posthogUserId: posthogUserId });
      }

    } catch (error) {
      Sentry.captureException(error, {
        tags: { feature: 'revenuecat-init' },
      });
    }

    const subscriptionListener = (customerInfo: CustomerInfo) => {
      // const hasPremium = typeof customerInfo.entitlements.active[entitlement] !== "undefined";
      // useSubscription.setState({ isPro: hasPremium });
    };

    Purchases.addCustomerInfoUpdateListener(subscriptionListener);

    setIsLoading(false);

    return () => {
      Purchases.removeCustomerInfoUpdateListener(subscriptionListener);
    };
  }, []);

  // Identify user when they sign in or change
  useEffect(() => {
    if (!apiKey || isLoading || !user) return;

    if (user.id !== lastIdentifiedUserId.current) {
      Purchases.logIn(user.id)
        .then(() => {
          lastIdentifiedUserId.current = user.id;
          // Purchases.setAttributes({ $locale: locale });
        })
        .catch((error) => {
          Sentry.captureException(error, {
            tags: { feature: 'revenuecat', step: 'login' },
            extra: { userId: user.id },
          });
          console.error('Error logging in to RevenueCat:', error);
        });
    }
  }, [user?.id, isLoading]);

  if (isLoading) {
    return null;
  }

  return children;
}
