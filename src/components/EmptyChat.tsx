import { useChatContext } from "@/providers/ChatProvider";
import { Pressable, ScrollView, Text, View } from "@/tw";

const STARTERS = [
  {
    title: "Brainstorm names",
    prompt: "Brainstorm 10 creative names for a new productivity app.",
  },
  {
    title: "Explain a concept",
    prompt: "Explain how transformers work in simple terms.",
  },
  {
    title: "Draft an email",
    prompt: "Draft a polite follow-up email for a job interview.",
  },
  {
    title: "Plan a trip",
    prompt: "Plan a 3-day weekend trip to Lisbon.",
  },
];

export function EmptyChat() {
  const { sendMessage, isLoading } = useChatContext();

  return (
    <View className="items-center">
      <View className="flex-1">
        <Text className="text-gray-400 text-base mb-6">
          How can I help you today?
        </Text>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="px-4 gap-2"
      >
        {STARTERS.map((starter) => (
          <Pressable
            key={starter.title}
            disabled={isLoading}
            onPress={() => sendMessage(starter.prompt)}
            className="px-4 py-3 rounded-2xl border border-gray-200 bg-white max-w-56"
          >
            <Text
              className="text-sm font-medium text-gray-900"
              numberOfLines={1}
            >
              {starter.title}
            </Text>
            <Text className="text-xs text-gray-500 mt-1" numberOfLines={2}>
              {starter.prompt}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}
