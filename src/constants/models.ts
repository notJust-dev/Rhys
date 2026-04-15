export type ChatProvider = "openai";

export type ChatModel = {
  id: string;
  label: string;
  description: string;
  provider: ChatProvider;
};

export const CHAT_MODELS: readonly ChatModel[] = [
  {
    id: "gpt-4o-mini",
    label: "GPT-4o mini",
    description: "Fast, cheap general-purpose model",
    provider: "openai",
  },
  {
    id: "gpt-4o",
    label: "GPT-4o",
    description: "Flagship multimodal model",
    provider: "openai",
  },
  {
    id: "gpt-4.1",
    label: "GPT-4.1",
    description: "Improved reasoning and long-context",
    provider: "openai",
  },
  {
    id: "gpt-4.1-mini",
    label: "GPT-4.1 mini",
    description: "Smaller, faster GPT-4.1",
    provider: "openai",
  },
  {
    id: "o3-mini",
    label: "o3-mini",
    description: "Reasoning-focused small model",
    provider: "openai",
  },
];

export const DEFAULT_MODEL = CHAT_MODELS[0];

export function getModelById(id: string): ChatModel {
  return CHAT_MODELS.find((m) => m.id === id) ?? DEFAULT_MODEL;
}
