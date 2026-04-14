import { Pressable, Text } from "@/tw";
import type { Tables } from "@/types/database.types";
import { useGlobalSearchParams, useRouter } from "expo-router";

export function ChatListItem({ chat }: { chat: Tables<"chats"> }) {
  const router = useRouter();
  const { id: activeChatId } = useGlobalSearchParams<{ id?: string }>();
  const isActive = activeChatId === chat.id;

  return (
    <Pressable
      onPress={() => router.push(`/chat/${chat.id}`)}
      className={`px-4 py-3 rounded-xl ${isActive ? "bg-gray-200" : ""}`}
    >
      <Text className="text-base text-gray-900" numberOfLines={1}>
        {chat.title ?? "Untitled"}
      </Text>
    </Pressable>
  );
}
