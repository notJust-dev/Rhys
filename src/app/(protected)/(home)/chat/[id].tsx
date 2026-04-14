import { MessageInput } from "@/components/MessageInput";
import { MessageList } from "@/components/MessageList";
import { useChat } from "@/hooks/useChat";
import { SafeAreaView } from "@/tw";
import { Stack, useLocalSearchParams } from "expo-router";
import {
  KeyboardGestureArea,
  KeyboardStickyView,
} from "react-native-keyboard-controller";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { bottom } = useSafeAreaInsets();
  const { title, messages, isLoading, streamingContent, sendMessage } =
    useChat(id!);

  return (
    <SafeAreaView edges={['bottom']} className="flex-1 bg-white">
      <Stack.Screen options={{ title }} />

      <KeyboardGestureArea
        interpolator="ios"
        offset={60}
        style={{ flex: 1 }}
      >
        <MessageList
          messages={messages}
          streamingContent={streamingContent}
        />

        <KeyboardStickyView offset={{ opened: bottom }}>
          <MessageInput
            onSend={sendMessage}
            isLoading={isLoading}
          />
        </KeyboardStickyView>
      </KeyboardGestureArea>
    </SafeAreaView>
  );
}
