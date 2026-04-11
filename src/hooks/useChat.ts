import { randomUUID } from "expo-crypto";
import { supabase } from "@/providers/Supabase/client";
import { useCreateChat } from "@/services/chats";
import { useChatMessages, useSaveMessage } from "@/services/messages";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useRef, useState } from "react";

export function useChat() {
  const [isLoading, setIsLoading] = useState(false);
  const chatIdRef = useRef<string | null>(null);
  const queryClient = useQueryClient();

  const { data: messages = [] } = useChatMessages(chatIdRef.current);
  const createChat = useCreateChat();
  const saveMessage = useSaveMessage();

  const sendMessage = useCallback(
    async (text: string) => {
      setIsLoading(true);

      try {
        // Create chat on first message
        if (!chatIdRef.current) {
          const chat = await createChat.mutateAsync(text);
          chatIdRef.current = chat.id;
        }

        const chatId = chatIdRef.current;

        // Save user message and wait for cache update
        await saveMessage.mutateAsync({ chatId, role: "user", content: text });

        const chatMessages = [
          ...messages.map((m) => ({ role: m.role, content: m.content })),
          { role: "user" as const, content: text },
        ];

        const { data, error } = await supabase.functions.invoke("chat", {
          body: { messages: chatMessages },
        });

        if (error) throw error;

        const assistantContent =
          data.choices?.[0]?.message?.content ?? "";

        // Save assistant message and wait for cache update
        await saveMessage.mutateAsync({
          chatId,
          role: "assistant",
          content: assistantContent,
        });
      } catch {
        // Show error as a temporary optimistic update
        queryClient.setQueryData(
          ["messages", chatIdRef.current],
          (old: typeof messages) => [
            ...(old ?? []),
            {
              id: randomUUID(),
              chat_id: chatIdRef.current!,
              role: "assistant" as const,
              content: "Something went wrong. Please try again.",
              created_at: new Date().toISOString(),
            },
          ],
        );
      } finally {
        setIsLoading(false);
      }
    },
    [messages, createChat, saveMessage, queryClient],
  );

  return { messages, isLoading, sendMessage };
}
