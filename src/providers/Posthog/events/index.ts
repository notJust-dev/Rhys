import { posthog } from '../posthog';
import * as AuthEvents from './auth';
import * as CustomEvents from './custom';

export { AuthEvents, CustomEvents };

/**
 * Analytics events for PostHog tracking
 * These events help understand user behavior and grow the application
 */


// ============================================
// APP LIFECYCLE EVENTS
// ============================================

export function trackAppOpened() {
  posthog?.capture('app_opened');
}

export function trackOnboardingStarted() {
  posthog?.capture('onboarding_started');
}

export function trackOnboardingCompleted() {
  posthog?.capture('onboarding_completed');
}

export function trackReviewRequested() {
  posthog?.capture('review_requested');
}

export function trackReviewSubmitted() {
  posthog?.capture('review_submitted');
}

// ============================================
// USER PROPERTIES
// ============================================

export function identifyUser(userId: string, properties?: Record<string, any>) {
  posthog?.identify(userId, properties);
}

export function setUserProperties(properties: {
  isPro?: boolean;
}) {
  posthog?.capture('$set', {
    $set: properties,
  });
}

// ============================================
// SUBSCRIPTION / MONETIZATION EVENTS
// ============================================

export function trackPaywallViewed(params: {
  source: string;
}) {
  posthog?.capture('paywall_viewed', params);
}

export function trackSubscriptionStarted(params?: {
  plan?: string;
  source?: string;
}) {
  posthog?.capture('subscription_started', {
    ...(params?.plan && { plan: params.plan }),
    ...(params?.source && { source: params.source }),
  });
}
