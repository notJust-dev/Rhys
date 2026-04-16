import { Pressable, Text, View } from "@/tw";
import { SymbolView, type SymbolViewProps } from "expo-symbols";

type SettingsRowProps = {
  icon: SymbolViewProps["name"];
  iconColor?: string;
  label: string;
  onPress: () => void;
  chevron?: boolean;
  textColor?: string;
};

export default function SettingsRow({
  icon,
  iconColor = "gray",
  label,
  onPress,
  chevron = true,
  textColor = "text-gray-900",
}: SettingsRowProps) {
  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center justify-between py-4"
    >
      <View className="flex-row items-center gap-3">
        <SymbolView name={icon} size={22} tintColor={iconColor} />
        <Text className={`text-base ${textColor}`}>{label}</Text>
      </View>
      {chevron ? (
        <SymbolView
          name={{
            ios: "chevron.right",
            android: "chevron_right",
            web: "chevron_right",
          }}
          size={16}
          tintColor="gray"
        />
      ) : null}
    </Pressable>
  );
}
