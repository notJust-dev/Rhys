import { useChats } from "@/services/chats";
import { ScrollView } from "@/tw";
import { ChatListItem } from "./ChatListItem";

export function ChatsList() {
  const { data: chats = [] } = useChats();

  return (
    <ScrollView className="flex-1 px-4">
      {chats.map((chat) => (
        <ChatListItem key={chat.id} chat={chat} />
      ))}
    </ScrollView>
  );
}
