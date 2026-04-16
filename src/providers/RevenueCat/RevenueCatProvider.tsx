import { posthog } from '@/providers/Posthog/posthog';
import * as Sentry from '@sentry/react-native';
import { PropsWithChildren, createContext, useContext, useEffect, useRef, useState } from 'react';
import Purchases, { CustomerInfo } from 'react-native-purchases';
import { useUser } from '../Supabase/AuthProvider';
import { apiKey, entitlements, logLevel } from './config';

type SubscriptionState = {
  isPro: boolean;
  isPlus: boolean;
  isSubscribed: boolean;
  isLoading: boolean;
};

const SubscriptionContext = createContext<SubscriptionState>({
  isPro: false,
  isPlus: false,
  isSubscribed: false,
  isLoading: true,
});

export function useSubscription() {
  return useContext(SubscriptionContext);
}

function resolveEntitlements(active: Record<string, unknown>) {
  const isPro = typeof active[entitlements.pro] !== 'undefined';
  const isPlus = typeof active[entitlements.plus] !== 'undefined';
  return { isPro, isPlus, isSubscribed: isPro || isPlus };
}

export default function RevenueCatProvider({ children }: PropsWithChildren) {
  const [isLoading, setIsLoading] = useState(true);
  const [subscription, setSubscription] = useState<Omit<SubscriptionState, 'isLoading'>>({
    isPro: false,
    isPlus: false,
    isSubscribed: false,
  });

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

      const posthogUserId = posthog?.getDistinctId();
      if (posthogUserId) {
        Purchases.setAttributes({ $posthogUserId: posthogUserId });
      }
    } catch (error) {
      Sentry.captureException(error, {
        tags: { feature: 'revenuecat-init' },
      });
    }

    Purchases.getCustomerInfo()
      .then((info) => setSubscription(resolveEntitlements(info.entitlements.active)))
      .catch(() => {})
      .finally(() => setIsLoading(false));

    const listener = (info: CustomerInfo) => {
      setSubscription(resolveEntitlements(info.entitlements.active));
    };

    Purchases.addCustomerInfoUpdateListener(listener);

    return () => {
      Purchases.removeCustomerInfoUpdateListener(listener);
    };
  }, []);

  useEffect(() => {
    if (!apiKey || isLoading || !user) return;

    if (user.id !== lastIdentifiedUserId.current) {
      Purchases.logIn(user.id)
        .then(() => {
          lastIdentifiedUserId.current = user.id;
        })
        .catch((error) => {
          Sentry.captureException(error, {
            tags: { feature: 'revenuecat', step: 'login' },
            extra: { userId: user.id },
          });
        });
    }
  }, [user?.id, isLoading]);

  if (isLoading) {
    return null;
  }

  return (
    <SubscriptionContext.Provider
      value={{ ...subscription, isLoading }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
}
