import { posthog } from '../posthog';

// ============================================
// CHAT EVENTS
// ============================================

export function trackChatCreated(params: { model: string; provider: string }) {
  posthog?.capture('chat_created', params);
}

export function trackMessageSent(params: { chatId: string; isFirstMessage: boolean }) {
  posthog?.capture('message_sent', params);
}

export function trackChatDeleted() {
  posthog?.capture('chat_deleted');
}

// ============================================
// ENGAGEMENT EVENTS
// ============================================

export function trackModelSelected(params: { model: string; provider: string }) {
  posthog?.capture('model_selected', params);
}

export function trackConversationStarterTapped(params: { title: string }) {
  posthog?.capture('conversation_starter_tapped', params);
}
