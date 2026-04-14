import { ChatScreenContent } from "@/components/ChatScreenContent";
import { ChatProvider } from "@/providers/ChatProvider";
import { useLocalSearchParams } from "expo-router";

export default function ChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <ChatProvider chatId={id!}>
      <ChatScreenContent />
    </ChatProvider>
  );
}
