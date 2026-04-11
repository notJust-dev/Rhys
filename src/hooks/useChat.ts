import { randomUUID } from "expo-crypto";
import { supabase } from "@/providers/Supabase/client";
import { useChatById, useCreateChat } from "@/services/chats";
import { useChatMessages, useSaveMessage } from "@/services/messages";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";

export function useChat(id: string) {
  const isNew = id === "new";
  const [createdChatId, setCreatedChatId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Reset created chat id when navigating to a different chat
  useEffect(() => {
    setCreatedChatId(null);
  }, [id]);

  const chatId = isNew ? createdChatId : id;
  const queryClient = useQueryClient();

  const { data: chat } = useChatById(chatId);
  const { data: messages = [] } = useChatMessages(chatId);
  const createChat = useCreateChat();
  const saveMessage = useSaveMessage();

  const sendMessage = useCallback(
    async (text: string) => {
      setIsLoading(true);

      try {
        // Create chat on first message
        let currentChatId = chatId;
        if (!currentChatId) {
          const newChat = await createChat.mutateAsync(text);
          currentChatId = newChat.id;
          setCreatedChatId(currentChatId);
        }

        // Save user message and wait for cache update
        await saveMessage.mutateAsync({ chatId: currentChatId, role: "user", content: text });

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
          chatId: currentChatId,
          role: "assistant",
          content: assistantContent,
        });
      } catch {
        // Show error as a temporary optimistic update
        queryClient.setQueryData(
          ["messages", chatId],
          (old: typeof messages) => [
            ...(old ?? []),
            {
              id: randomUUID(),
              chat_id: chatId!,
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

  const title = chat?.title ?? "New Chat";

  return { title, messages, isLoading, sendMessage };
}
