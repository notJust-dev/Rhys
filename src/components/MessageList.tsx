import { EmptyChat } from "@/components/EmptyChat";
import { MessageBubble } from "@/components/MessageBubble";
import { View } from "@/tw";
import type { Tables } from "@/types/database.types";
import { KeyboardAvoidingLegendList } from "@legendapp/list/keyboard";
import { useCallback, useMemo } from "react";
import { ActivityIndicator } from "react-native";
import { useAnimatedScrollHandler } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Message = Tables<"messages">;

type Props = {
  messages: Message[];
  streamingContent: string;
  isLoading: boolean;
};

export function MessageList({
  messages,
  streamingContent,
  isLoading,
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
    ({ item }: { item: Message }) => <MessageBubble message={item} />,
    [],
  );

  const handleScroll = useAnimatedScrollHandler({
    onScroll: (_event) => {},
  });

  const showTypingIndicator = isLoading && !streamingContent;

  const ListFooter = useCallback(
    () =>
      showTypingIndicator ? (
        <View className="px-4 py-3 items-start">
          <ActivityIndicator size="small" color="#9ca3af" />
        </View>
      ) : null,
    [showTypingIndicator],
  );


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
      ListFooterComponent={ListFooter}
      ListEmptyComponent={EmptyChat}
    />
  );
}
