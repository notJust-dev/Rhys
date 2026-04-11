import { supabase } from "@/providers/Supabase/client";
import { Database } from "@/types/database.types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

type MessageRole = Database["public"]["Enums"]["message_role"];

export function useChatMessages(chatId: string | null) {
  return useQuery({
    queryKey: ["messages", chatId],
    queryFn: async () => {
      const { data } = await supabase
        .from("messages")
        .select("*")
        .eq("chat_id", chatId!)
        .order("created_at", { ascending: true })
        .throwOnError();
      return data;
    },
    enabled: !!chatId,
  });
}

export function useSaveMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      chatId,
      role,
      content,
    }: {
      chatId: string;
      role: MessageRole;
      content: string;
    }) => {
      const { data } = await supabase
        .from("messages")
        .insert({ chat_id: chatId, role, content })
        .select()
        .single()
        .throwOnError();
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["messages", variables.chatId],
      });
    },
  });
}
