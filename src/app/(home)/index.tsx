import { MessageInput } from "@/components/MessageInput";
import { SafeAreaView, Text, View } from "@/tw";
import { useCallback } from "react";
import type { LayoutChangeEvent } from "react-native";
import {
  KeyboardChatScrollView,
  KeyboardGestureArea,
  KeyboardStickyView,
} from "react-native-keyboard-controller";
import { useSharedValue, withTiming } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const MIN_INPUT_HEIGHT = 36;
const MARGIN = 8;

export default function Index() {
  const { bottom } = useSafeAreaInsets();
  const extraContentPadding = useSharedValue(0);

  const onInputLayout = useCallback(
    (e: LayoutChangeEvent) => {
      extraContentPadding.value = withTiming(
        Math.max(e.nativeEvent.layout.height - MIN_INPUT_HEIGHT, 0),
        { duration: 250 },
      );
    },
    [extraContentPadding],
  );

  return (
    <SafeAreaView edges={['bottom']} className="flex-1 bg-white">
      <KeyboardGestureArea
        interpolator="ios"
        textInputNativeID="chat-input"
        style={{ flex: 1 }}
      >
        <KeyboardChatScrollView
          keyboardDismissMode="interactive"
          offset={bottom - MARGIN}
          extraContentPadding={extraContentPadding}
        >
          <View className="flex-1 items-center justify-center py-20">
            <Text className="text-gray-400 text-base">
              How can I help you today?
            </Text>
          </View>
        </KeyboardChatScrollView>

        <KeyboardStickyView offset={{ opened: bottom - MARGIN }}>
          <MessageInput
            onSend={(message) => console.log(message)}
            onLayout={onInputLayout}
          />
        </KeyboardStickyView>
      </KeyboardGestureArea>
    </SafeAreaView>
  );
}
