import { supabase } from "@/providers/Supabase/client";
import { Pressable, Text, View } from "@/tw";
import { useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";

export default function SettingsScreen() {
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

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

      <Pressable
        onPress={() => router.push('/settings/subscription')}
        className="flex-row items-center justify-between py-4"
      >
        <View className="flex-row items-center gap-3">
          <SymbolView
            name={{ ios: "crown", android: "workspace_premium", web: "workspace_premium" }}
            size={22}
            tintColor="gray"
          />
          <Text className="text-base text-gray-900">Manage Subscription</Text>
        </View>
        <SymbolView
          name={{ ios: "chevron.right", android: "chevron_right", web: "chevron_right" }}
          size={16}
          tintColor="gray"
        />
      </Pressable>

      <Pressable
        onPress={handleLogout}
        className="flex-row items-center gap-3 py-4 mt-4 border-t border-gray-100"
      >
        <SymbolView
          name={{ ios: "rectangle.portrait.and.arrow.right", android: "logout", web: "logout" }}
          size={22}
          tintColor="red"
        />
        <Text className="text-base text-red-500">Log Out</Text>
      </Pressable>
    </View>
  );
}
