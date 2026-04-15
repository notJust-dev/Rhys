import { MessageInput } from "@/components/MessageInput";
import { MessageList } from "@/components/MessageList";
import { ModelPickerModal } from "@/components/ModelPickerModal";
import { useChatContext } from "@/providers/ChatProvider";
import { Pressable, SafeAreaView } from "@/tw";
import { Stack } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useState } from "react";
import {
  KeyboardGestureArea,
  KeyboardStickyView,
} from "react-native-keyboard-controller";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export function ChatScreenContent() {
  const { bottom } = useSafeAreaInsets();
  const { title, isNew, selectedModel, setSelectedModel } = useChatContext();
  const [pickerOpen, setPickerOpen] = useState(false);

  return (
    <SafeAreaView edges={['bottom']} className="flex-1 bg-white">
      <Stack.Screen
        options={{
          title,
          headerRight: () => (
            <Pressable
              onPress={() => setPickerOpen(true)}
              className="p-2"
              hitSlop={8}
            >
              <SymbolView
                name={{
                  ios: "slider.horizontal.3",
                  android: "tune",
                  web: "tune",
                }}
                size={22}
                tintColor="gray"
              />
            </Pressable>
          ),
        }}
      />

      <ModelPickerModal
        visible={pickerOpen}
        selectedModel={selectedModel}
        onSelect={setSelectedModel}
        onClose={() => setPickerOpen(false)}
        readOnly={!isNew}
      />

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
