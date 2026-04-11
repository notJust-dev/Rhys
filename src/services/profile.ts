import { useAuth } from "@/providers/Supabase/AuthProvider";
import { supabase } from "@/providers/Supabase/client";
import { TablesUpdate } from "@/types/database.types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useProfile() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user!.id)
        .single()
        .throwOnError();
      return data;
    },
    enabled: !!user,
  });
}

export function useUpdateProfile() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updates: TablesUpdate<"profiles">) => {
      await supabase
        .from("profiles")
        .update(updates)
        .eq("id", user!.id)
        .throwOnError();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
}
