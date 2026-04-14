import { MessageBubble } from "@/components/MessageBubble";
import { Text, View } from "@/tw";
import type { Tables } from "@/types/database.types";
import { KeyboardAvoidingLegendList } from "@legendapp/list/keyboard";
import { useCallback, useMemo } from "react";
import { useAnimatedScrollHandler } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Message = Tables<"messages">;

type Props = {
  messages: Message[];
  streamingContent: string;
};

export function MessageList({
  messages,
  streamingContent,
}: Props) {
  const insets = useSafeAreaInsets();

  const data = useMemo<Message[]>(() => {
    if (!streamingContent) return messages;
    return [
      ...messages,
      {
        id: "streaming",
        chat_id: "",
        role: "assistant",
        content: streamingContent,
        created_at: new Date().toISOString(),
      },
    ];
  }, [messages, streamingContent]);

  const renderItem = useCallback(
    ({ item }: { item: Message }) => (
      <MessageBubble message={item} />
    ),
    [],
  );

  const handleScroll = useAnimatedScrollHandler({
    onScroll: (_event) => { },
  });

  if (data.length === 0) {
    return (
      <View className="flex-1 items-center justify-center py-20">
        <Text className="text-gray-400 text-base">
          How can I help you today?
        </Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingLegendList
      data={data}
      keyExtractor={(item: Message) => item.id}
      renderItem={renderItem}
      estimatedItemSize={80}
      alignItemsAtEnd
      initialScrollAtEnd
      maintainVisibleContentPosition
      maintainScrollAtEnd
      maintainScrollAtEndThreshold={0.1}
      recycleItems
      safeAreaInsetBottom={insets.bottom}
      contentContainerStyle={{ paddingTop: 16, gap: 4 }}
      onScroll={handleScroll}
    />
  );
}
