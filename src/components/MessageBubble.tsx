import { Text, View } from "@/tw";
import type { Tables } from "@/types/database.types";

export function MessageBubble({ message }: { message: Tables<"messages"> }) {
  const isUser = message.role === "user";

  return (
    <View className={`px-4 py-2 ${isUser ? "items-end" : "items-start"}`}>
      <View
        className={`max-w-[85%] rounded-2xl px-4 py-3 ${
          isUser ? "bg-black" : "bg-gray-100"
        }`}
      >
        <Text
          className={`text-base ${isUser ? "text-white" : "text-gray-900"}`}
        >
          {message.content || "…"}
        </Text>
      </View>
    </View>
  );
}
