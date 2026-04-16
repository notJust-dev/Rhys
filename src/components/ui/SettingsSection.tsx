import { Text, View } from "@/tw";
import type { ReactNode } from "react";

type Props = {
  title?: string;
  children: ReactNode;
};

export default function SettingsSection({ title, children }: Props) {
  return (
    <View className="gap-2">
      {title ? (
        <Text className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-4">
          {title}
        </Text>
      ) : null}
      <View className="bg-white rounded-xl px-4">{children}</View>
    </View>
  );
}
