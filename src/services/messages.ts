import { supabase } from "@/providers/Supabase/client";
import { Database, Tables } from "@/types/database.types";
import {
  InfiniteData,
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useMemo } from "react";

type MessageRole = Database["public"]["Enums"]["message_role"];
type Message = Tables<"messages">;

export const MESSAGES_PAGE_SIZE = 2;

type MessagesInfiniteData = InfiniteData<Message[], string | null>;

export function useChatMessages(chatId: string | null) {
  const query = useInfiniteQuery<
    Message[],
    Error,
    MessagesInfiniteData,
    readonly ["messages", string | null],
    string | null
  >({
    queryKey: ["messages", chatId],
    queryFn: async ({ pageParam }) => {
      let q = supabase
        .from("messages")
        .select("*")
        .eq("chat_id", chatId!)
        .order("created_at", { ascending: false })
        .limit(MESSAGES_PAGE_SIZE);
      if (pageParam) q = q.lt("created_at", pageParam);
      const { data } = await q.throwOnError();
      return data ?? [];
    },
    initialPageParam: null,
    getNextPageParam: (lastPage) => {
      if (lastPage.length < MESSAGES_PAGE_SIZE) return undefined;
      return lastPage[lastPage.length - 1].created_at;
    },
    enabled: !!chatId,
  });

  const messages = useMemo<Message[]>(() => {
    const pages = query.data?.pages ?? [];
    return pages.flat().slice().reverse();
  }, [query.data]);

  return {
    data: messages,
    fetchNextPage: query.fetchNextPage,
    hasNextPage: query.hasNextPage,
    isFetchingNextPage: query.isFetchingNextPage,
    isLoading: query.isLoading,
  };
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
    onSuccess: (newMessage, variables) => {
      queryClient.setQueryData<MessagesInfiniteData>(
        ["messages", variables.chatId],
        (old) => {
          if (!old) {
            return {
              pages: [[newMessage]],
              pageParams: [null],
            };
          }
          const [first = [], ...rest] = old.pages;
          return {
            ...old,
            pages: [[newMessage, ...first], ...rest],
          };
        },
      );
    },
  });
}
