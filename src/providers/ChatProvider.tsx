import { invokeFunctionStream } from "@/providers/Supabase/functions";
import { useChatById, useCreateChat } from "@/services/chats";
import { useChatMessages, useSaveMessage } from "@/services/messages";
import type { Tables } from "@/types/database.types";
import { InfiniteData, useQueryClient } from "@tanstack/react-query";
import { randomUUID } from "expo-crypto";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type PropsWithChildren,
} from "react";

type Message = Tables<"messages">;
type MessagesInfiniteData = InfiniteData<Message[], string | null>;

type ChatContextValue = {
  chatId: string | null;
  title: string;
  messages: Message[];
  isLoading: boolean;
  streamingContent: string;
  sendMessage: (text: string) => Promise<void>;
  fetchNextPage: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
};

const ChatContext = createContext<ChatContextValue | null>(null);

export function ChatProvider({
  chatId: routeId,
  children,
}: PropsWithChildren<{ chatId: string }>) {
  const isNew = routeId === "new";
  const [createdChatId, setCreatedChatId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [streamingContent, setStreamingContent] = useState("");

  useEffect(() => {
    setCreatedChatId(null);
    setStreamingContent("");
  }, [routeId]);

  const chatId = isNew ? createdChatId : routeId;
  const queryClient = useQueryClient();

  const { data: chat } = useChatById(chatId);
  const {
    data: messages = [],
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useChatMessages(chatId);
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

        const { reader, headers } = await invokeFunctionStream("chat", {
          chatId: currentChatId,
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
          const messageId = headers.get("x-message-id");
          const messageCreatedAt = headers.get("x-message-created-at");
          if (messageId && messageCreatedAt) {
            const saved: Message = {
              id: messageId,
              chat_id: currentChatId,
              role: "assistant",
              content: assistantContent,
              created_at: messageCreatedAt,
            };
            queryClient.setQueryData<MessagesInfiniteData>(
              ["messages", currentChatId],
              (old) => {
                if (!old) {
                  return { pages: [[saved]], pageParams: [null] };
                }
                const [first = [], ...rest] = old.pages;
                return {
                  ...old,
                  pages: [[saved, ...first], ...rest],
                };
              },
            );
          }
        }
      } catch {
        queryClient.setQueryData<MessagesInfiniteData>(
          ["messages", chatId],
          (old) => {
            const errorMessage: Message = {
              id: randomUUID(),
              chat_id: chatId!,
              role: "assistant",
              content: "Something went wrong. Please try again.",
              created_at: new Date().toISOString(),
            };
            if (!old) {
              return { pages: [[errorMessage]], pageParams: [null] };
            }
            const [first = [], ...rest] = old.pages;
            return {
              ...old,
              pages: [[errorMessage, ...first], ...rest],
            };
          },
        );
      } finally {
        setStreamingContent("");
        setIsLoading(false);
      }
    },
    [chatId, messages, createChat, saveMessage, queryClient],
  );

  const title = chat?.title ?? "New Chat";

  return (
    <ChatContext.Provider
      value={{
        chatId,
        title,
        messages,
        isLoading,
        streamingContent,
        sendMessage,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChatContext() {
  const ctx = useContext(ChatContext);
  if (!ctx) {
    throw new Error("useChatContext must be used within a ChatProvider");
  }
  return ctx;
}
