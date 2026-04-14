import { useChats } from "@/services/chats";
import type { Tables } from "@/types/database.types";
import { AnimatedLegendList } from "@legendapp/list/reanimated";
import { useCallback } from "react";
import { LinearTransition } from "react-native-reanimated";
import { ChatListItem } from "./ChatListItem";


type Chat = Tables<"chats">;

export function ChatsList() {
  const { data: chats, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useChats();

  const renderItem = useCallback(
    ({ item }: { item: Chat }) => <ChatListItem chat={item} />,
    [],
  );

  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <AnimatedLegendList
      data={chats}
      keyExtractor={(item: Chat) => item.id}
      renderItem={renderItem}
      estimatedItemSize={48}
      contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 32 }}
      showsVerticalScrollIndicator={false}
      onEndReached={handleEndReached}
      onEndReachedThreshold={0.5}
      itemLayoutAnimation={LinearTransition.duration(280)}

    />
  );
}
