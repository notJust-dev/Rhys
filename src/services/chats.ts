import { useAuth } from "@/providers/Supabase/AuthProvider";
import { supabase } from "@/providers/Supabase/client";
import type { Tables } from "@/types/database.types";
import {
  InfiniteData,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useMemo } from "react";

type Chat = Tables<"chats">;

export const CHATS_PAGE_SIZE = 20;

type ChatsInfiniteData = InfiniteData<Chat[], string | null>;

export function useChats() {
  const { user } = useAuth();

  const query = useInfiniteQuery<
    Chat[],
    Error,
    ChatsInfiniteData,
    readonly ["chats", string | undefined],
    string | null
  >({
    queryKey: ["chats", user?.id],
    queryFn: async ({ pageParam }) => {
      let q = supabase
        .from("chats")
        .select("*")
        .eq("user_id", user!.id)
        .order("updated_at", { ascending: false })
        .limit(CHATS_PAGE_SIZE);
      if (pageParam) q = q.lt("updated_at", pageParam);
      const { data } = await q.throwOnError();
      return data ?? [];
    },
    initialPageParam: null,
    getNextPageParam: (lastPage) => {
      if (lastPage.length < CHATS_PAGE_SIZE) return undefined;
      return lastPage[lastPage.length - 1].updated_at;
    },
    enabled: !!user,
  });

  const chats = useMemo<Chat[]>(
    () => query.data?.pages.flat() ?? [],
    [query.data],
  );

  return {
    data: chats,
    fetchNextPage: query.fetchNextPage,
    hasNextPage: query.hasNextPage,
    isFetchingNextPage: query.isFetchingNextPage,
    isLoading: query.isLoading,
  };
}

export function useChatById(id: string | null) {
  return useQuery({
    queryKey: ["chat", id],
    queryFn: async () => {
      const { data } = await supabase
        .from("chats")
        .select("*")
        .eq("id", id!)
        .single()
        .throwOnError();
      return data;
    },
    enabled: !!id,
  });
}

export function useUpdateChatTitle() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, title }: { id: string; title: string }) => {
      const { data } = await supabase
        .from("chats")
        .update({ title })
        .eq("id", id)
        .select()
        .single()
        .throwOnError();
      return data;
    },
    onSuccess: (updated) => {
      queryClient.setQueryData<ChatsInfiniteData>(
        ["chats", user?.id],
        (old) => {
          if (!old) return old;
          return {
            ...old,
            pages: old.pages.map((page) =>
              page.map((chat) => (chat.id === updated.id ? updated : chat)),
            ),
          };
        },
      );
      queryClient.setQueryData(["chat", updated.id], updated);
    },
  });
}

export function useDeleteChat() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await supabase.from("chats").delete().eq("id", id).throwOnError();
      return id;
    },
    onSuccess: (deletedId) => {
      queryClient.setQueryData<ChatsInfiniteData>(
        ["chats", user?.id],
        (old) => {
          if (!old) return old;
          return {
            ...old,
            pages: old.pages.map((page) =>
              page.filter((chat) => chat.id !== deletedId),
            ),
          };
        },
      );
      queryClient.removeQueries({ queryKey: ["chat", deletedId] });
      queryClient.removeQueries({ queryKey: ["messages", deletedId] });
    },
  });
}

export function useCreateChat() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (title?: string) => {
      const { data } = await supabase
        .from("chats")
        .insert({ user_id: user!.id, title: title ?? null })
        .select()
        .single()
        .throwOnError();
      return data;
    },
    onSuccess: (newChat) => {
      queryClient.setQueryData<ChatsInfiniteData>(
        ["chats", user?.id],
        (old) => {
          if (!old) {
            return { pages: [[newChat]], pageParams: [null] };
          }
          const [first = [], ...rest] = old.pages;
          return {
            ...old,
            pages: [[newChat, ...first], ...rest],
          };
        },
      );
    },
  });
}
