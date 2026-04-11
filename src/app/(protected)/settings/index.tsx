import { Pressable, Text, View } from "@/tw";
import { useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";

export default function SettingsScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-white px-6 pt-6">
      <Pressable
        onPress={() => router.push("/settings/edit-profile")}
        className="flex-row items-center justify-between py-4"
      >
        <View className="flex-row items-center gap-3">
          <SymbolView
            name={{ ios: "person.crop.circle", android: "person", web: "person" }}
            size={22}
            tintColor="gray"
          />
          <Text className="text-base text-gray-900">Edit Profile</Text>
        </View>
        <SymbolView
          name={{ ios: "chevron.right", android: "chevron_right", web: "chevron_right" }}
          size={16}
          tintColor="gray"
        />
      </Pressable>
    </View>
  );
}
