import { supabase } from "@/providers/Supabase/client";
import type { Message } from "@/types/chat";
import { useCallback, useState } from "react";

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = useCallback(
    async (text: string) => {
      const userMessage: Message = {
        id: Date.now().toString(),
        role: "user",
        content: text,
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);

      const chatMessages = [
        ...messages.map((m) => ({ role: m.role, content: m.content })),
        { role: "user" as const, content: text },
      ];

      try {
        const { data, error } = await supabase.functions.invoke("chat", {
          body: { messages: chatMessages },
        });

        if (error) throw error;

        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: data.choices?.[0]?.message?.content ?? "",
        };

        setMessages((prev) => [...prev, assistantMessage]);
      } catch {
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: "assistant",
            content: "Something went wrong. Please try again.",
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    },
    [messages],
  );

  return { messages, isLoading, sendMessage };
}
