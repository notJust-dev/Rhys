import { Pressable, Text, TextInput, View } from "@/tw";
import { useCallback, useState } from "react";
import type { LayoutChangeEvent } from "react-native";

export function MessageInput({
  onSend,
  onLayout,
  isLoading,
}: {
  onSend: (message: string) => void;
  onLayout?: (e: LayoutChangeEvent) => void;
  isLoading?: boolean;
}) {
  const [text, setText] = useState("");

  const handleSend = useCallback(() => {
    const trimmed = text.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setText("");
  }, [text, onSend]);

  return (
    <View className="bg-white px-4 py-2 flex-row items-end gap-2" onLayout={onLayout}>
      <TextInput
        className="flex-1 min-h-[36px] max-h-[120px] rounded-2xl bg-gray-100 px-4 py-2 text-base"
        placeholder="Message"
        placeholderTextColor="#9ca3af"
        value={text}
        onChangeText={setText}
        multiline
        onSubmitEditing={handleSend}
        submitBehavior="blurAndSubmit"
      />
      <Pressable
        className="h-9 w-9 items-center justify-center rounded-full bg-black"
        onPress={handleSend}
        disabled={!text.trim() || isLoading}
        style={{ opacity: text.trim() && !isLoading ? 1 : 0.4 }}
      >
        <Text className="text-white text-base font-bold">↑</Text>
      </Pressable>
    </View>
  );
}
