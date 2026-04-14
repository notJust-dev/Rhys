import { MessageInput } from "@/components/MessageInput";
import { MessageList } from "@/components/MessageList";
import { useChatContext } from "@/providers/ChatProvider";
import { SafeAreaView } from "@/tw";
import { Stack } from "expo-router";
import {
  KeyboardGestureArea,
  KeyboardStickyView,
} from "react-native-keyboard-controller";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export function ChatScreenContent() {
  const { bottom } = useSafeAreaInsets();
  const { title } = useChatContext();

  return (
    <SafeAreaView edges={['bottom']} className="flex-1 bg-white">
      <Stack.Screen options={{ title }} />

      <KeyboardGestureArea
        interpolator="ios"
        offset={60}
        style={{ flex: 1 }}
      >
        <MessageList />

        <KeyboardStickyView offset={{ opened: bottom }}>
          <MessageInput />
        </KeyboardStickyView>
      </KeyboardGestureArea>
    </SafeAreaView>
  );
}
