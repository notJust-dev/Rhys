import { useDeleteChat } from "@/services/chats";
import { Text, View } from "@/tw";
import type { Tables } from "@/types/database.types";
import { useGlobalSearchParams, useRouter } from "expo-router";
import { ChatListItemMenu } from "./ChatListItemMenu";

export function ChatListItem({ chat }: { chat: Tables<"chats"> }) {
  const router = useRouter();
  const { id: activeChatId } = useGlobalSearchParams<{ id?: string }>();
  const isActive = activeChatId === chat.id;
  const deleteChat = useDeleteChat();

  const handleDelete = () => {
    if (isActive) router.replace("/chat/new");
    deleteChat.mutate(chat.id);
  };

  return (
    <ChatListItemMenu href={`/chat/${chat.id}`} onDelete={handleDelete}>
      <View
        className={`px-4 py-3 w-full rounded-xl ${
          isActive ? "bg-gray-200" : ""
        }`}
      >
        <Text className="text-base text-gray-900" numberOfLines={1}>
          {chat.title ?? "Untitled"}
        </Text>
      </View>
    </ChatListItemMenu>
  );
}
