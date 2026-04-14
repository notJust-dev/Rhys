import { Text, View } from "@/tw";

export function EmptyChat() {
  return (
    <View className="flex-1 items-center justify-center py-20">
      <Text className="text-gray-400 text-base">
        How can I help you today?
      </Text>
    </View>
  );
}
