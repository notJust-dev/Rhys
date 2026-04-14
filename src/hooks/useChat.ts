import { randomUUID } from "expo-crypto";
import { invokeFunctionStream } from "@/providers/Supabase/functions";
import { useChatById, useCreateChat } from "@/services/chats";
import { useChatMessages, useSaveMessage } from "@/services/messages";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";

export function useChat(id: string) {
  const isNew = id === "new";
  const [createdChatId, setCreatedChatId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [streamingContent, setStreamingContent] = useState("");

  useEffect(() => {
    setCreatedChatId(null);
    setStreamingContent("");
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
      setStreamingContent("");

      try {
        let currentChatId = chatId;
        if (!currentChatId) {
          const newChat = await createChat.mutateAsync(text);
          currentChatId = newChat.id;
          setCreatedChatId(currentChatId);
        }

        await saveMessage.mutateAsync({
          chatId: currentChatId,
          role: "user",
          content: text,
        });

        const chatMessages = [
          ...messages.map((m) => ({ role: m.role, content: m.content })),
          { role: "user" as const, content: text },
        ];

        const reader = await invokeFunctionStream("chat", {
          messages: chatMessages,
        });

        const decoder = new TextDecoder();
        let assistantContent = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          assistantContent += decoder.decode(value, { stream: true });
          setStreamingContent(assistantContent);
        }

        if (assistantContent) {
          await saveMessage.mutateAsync({
            chatId: currentChatId,
            role: "assistant",
            content: assistantContent,
          });
        }
      } catch {
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
        setStreamingContent("");
        setIsLoading(false);
      }
    },
    [chatId, messages, createChat, saveMessage, queryClient],
  );

  const title = chat?.title ?? "New Chat";

  return { title, messages, isLoading, streamingContent, sendMessage };
}
