import { EmptyChat } from "@/components/EmptyChat";
import { MessageBubble } from "@/components/MessageBubble";
import { useChatContext } from "@/providers/ChatProvider";
import { Pressable, View } from "@/tw";
import { Animated } from "@/tw/animated";
import type { Tables } from "@/types/database.types";
import { KeyboardAvoidingLegendList } from "@legendapp/list/keyboard";
import type { LegendListRef } from "@legendapp/list/react-native";
import { SymbolView } from "expo-symbols";
import { useCallback, useMemo, useRef } from "react";
import { ActivityIndicator } from "react-native";
import { useReanimatedKeyboardAnimation } from "react-native-keyboard-controller";
import {
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Message = Tables<"messages">;

const SCROLL_BUTTON_THRESHOLD = 200;

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
  const scrollButtonOpacity = useSharedValue(0);
  const { height: keyboardHeight } = useReanimatedKeyboardAnimation();

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

  const handleScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      const distanceFromBottom =
        event.contentSize.height -
        (event.contentOffset.y + event.layoutMeasurement.height);
      const target = distanceFromBottom > SCROLL_BUTTON_THRESHOLD ? 1 : 0;
      if (scrollButtonOpacity.value !== target) {
        scrollButtonOpacity.value = withTiming(target, { duration: 150 });
      }
    },
  });

  const scrollButtonStyle = useAnimatedStyle(() => ({
    opacity: scrollButtonOpacity.value,
    transform: [
      { translateY: Math.min(keyboardHeight.value + insets.bottom, 0) },
    ],
  }));

  const scrollToBottom = useCallback(() => {
    listRef.current?.scrollToEnd({ animated: true });
  }, []);

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
      <Animated.View
        style={scrollButtonStyle}
        className="absolute self-center bottom-4"
      >
        <Pressable
          onPress={scrollToBottom}
          className="w-10 h-10 rounded-full bg-white border border-gray-200 items-center justify-center shadow"
        >
          <SymbolView
            name={{
              ios: "arrow.down",
              android: "arrow_downward",
              web: "arrow_downward",
            }}
            size={18}
            tintColor="gray"
          />
        </Pressable>
      </Animated.View>
    </View>
  );
}
