import { EmptyChat } from "@/components/EmptyChat";
import { MessageBubble } from "@/components/MessageBubble";
import { ScrollToBottomButton } from "@/components/ScrollToBottomButton";
import { useChatContext } from "@/providers/ChatProvider";
import { View } from "@/tw";
import type { Tables } from "@/types/database.types";
import { KeyboardAvoidingLegendList } from "@legendapp/list/keyboard";
import type { LegendListRef } from "@legendapp/list/react-native";
import { useCallback, useMemo, useRef } from "react";
import { ActivityIndicator } from "react-native";
import {
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Message = Tables<"messages">;

export function MessageList() {
  const {
    messages,
    streamingContent,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useChatContext();
  const insets = useSafeAreaInsets();
  const listRef = useRef<LegendListRef>(null);
  const distanceFromBottom = useSharedValue(0);

  const handleScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      distanceFromBottom.value =
        event.contentSize.height -
        (event.contentOffset.y + event.layoutMeasurement.height);
    },
  });

  const showTypingIndicator = isLoading && !streamingContent;

  const data = useMemo<Message[]>(() => {
    const base = messages;
    if (streamingContent) {
      return [
        ...base,
        {
          id: "streaming",
          chat_id: "",
          role: "assistant",
          content: streamingContent,
          created_at: new Date().toISOString(),
        },
      ];
    }
    if (showTypingIndicator) {
      return [
        ...base,
        {
          id: "typing",
          chat_id: "",
          role: "assistant",
          content: "",
          created_at: new Date().toISOString(),
        },
      ];
    }
    return base;
  }, [messages, streamingContent, showTypingIndicator]);

  const renderItem = useCallback(
    ({ item }: { item: Message }) =>
      item.id === "typing" ? (
        <View className="px-4 py-3 items-start">
          <ActivityIndicator size="small" color="#9ca3af" />
        </View>
      ) : (
        <MessageBubble message={item} />
      ),
    [],
  );

  const ListHeader = useCallback(
    () => (
      <View className="h-10 items-center justify-center">
        {isFetchingNextPage ? (
          <ActivityIndicator size="small" color="#9ca3af" />
        ) : null}
      </View>
    ),
    [isFetchingNextPage],
  );

  const handleStartReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <View className="flex-1">
      <KeyboardAvoidingLegendList
        ref={listRef}
        data={data}
        keyExtractor={(item: Message) => item.id}
        renderItem={renderItem}
        estimatedItemSize={80}
        alignItemsAtEnd
        initialScrollAtEnd
        maintainVisibleContentPosition={{ data: true }}
        maintainScrollAtEnd
        maintainScrollAtEndThreshold={0.1}
        recycleItems
        safeAreaInsetBottom={insets.bottom}
        contentContainerStyle={{ paddingTop: 16, gap: 4 }}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={EmptyChat}
        onStartReached={handleStartReached}
        onStartReachedThreshold={0.1}
      />
      <ScrollToBottomButton
        listRef={listRef}
        distanceFromBottom={distanceFromBottom}
      />
    </View>
  );
}
