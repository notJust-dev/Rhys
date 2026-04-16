import { posthog } from '../posthog';

export function trackSignUp() {
  posthog?.capture('sign_up');
}

export function trackSignIn(params: { method: 'email' | 'anonymous' }) {
  posthog?.capture('sign_in', params);
}

export function trackEmailVerified() {
  posthog?.capture('email_verified');
}

export function trackPasswordResetCompleted() {
  posthog?.capture('password_reset_completed');
}
