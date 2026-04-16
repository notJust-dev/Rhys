import { posthog } from '../posthog';

// ============================================
// ONBOARDING EVENTS
// ============================================

export function trackOnboardingStarted() {
    posthog?.capture('onboarding_started');
}

export function trackOnboardingCompleted() {
    posthog?.capture('onboarding_completed');
}

export function trackOnboardingStepCompleted(params: {
    step: string;
    value?: string | string[];
}) {
    posthog?.capture('onboarding_step_completed', params);
}


export function trackOnboardingAbandoned(params: { step: string }) {
    posthog?.capture('onboarding_abandoned', params);
}

export function trackOnboardingPaywallPurchased() {
    posthog?.capture('onboarding_paywall_purchased');
}

export function trackOnboardingPaywallSkipped() {
    posthog?.capture('onboarding_paywall_skipped');
}