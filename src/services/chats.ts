import { useAuth } from "@/providers/Supabase/AuthProvider";
import { supabase } from "@/providers/Supabase/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useChats() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["chats", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("chats")
        .select("*")
        .eq("user_id", user!.id)
        .order("updated_at", { ascending: false })
        .throwOnError();
      return data;
    },
    enabled: !!user,
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chats"] });
    },
  });
}
