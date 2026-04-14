import { View } from "@/tw";
import type { Tables } from "@/types/database.types";
import { Markdown } from "./Markdown";

export function MessageBubble({ message }: { message: Tables<"messages"> }) {
  const isUser = message.role === "user";
  const content = message.content || "…";

  return (
    <View className={`px-4 py-2 ${isUser ? "items-end" : ""}`}>
      <View
        className={
          isUser ? "max-w-[85%] rounded-2xl px-4 py-3 bg-gray-200" : "w-full"
        }
      >
        <Markdown content={content} />
      </View>
    </View>
  );
}
