import { ChatsList } from "@/components/ChatsList";
import { Pressable, Text, View } from "@/tw";
import type { DrawerContentComponentProps } from "@react-navigation/drawer";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { Drawer } from "expo-router/drawer";
import { SymbolView } from "expo-symbols";

function DrawerToggle() {
  const navigation = useNavigation();

  return (
    <Pressable
      onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
      className="p-2"
    >
      <SymbolView
        name={{ ios: "line.3.horizontal", android: "menu", web: "menu" }}
        size={22}
        tintColor="gray"
      />
    </Pressable>
  );
}

function DrawerContent({ navigation }: DrawerContentComponentProps) {
  const router = useRouter();

  return (
    <View className="flex-1 bg-white pt-16">
      <Pressable
        onPress={() => {
          router.push("/chat/new");
        }}
        className="flex-row items-center gap-3 mx-4 mb-2 px-4 py-3 rounded-xl"
      >
        <SymbolView
          name={{ ios: "plus.bubble", android: "add", web: "add" }}
          size={20}
          tintColor="gray"
        />
        <Text className="text-base text-gray-900">New Chat</Text>
      </Pressable>

      <ChatsList />

      <View className="px-4 pb-8 border-t border-gray-100">
        <Pressable
          onPress={() => {
            navigation.closeDrawer();
            router.push("/settings");
          }}
          className="flex-row items-center gap-3 px-4 py-3 rounded-xl"
        >
          <SymbolView
            name={{ ios: "gearshape", android: "settings", web: "settings" }}
            size={20}
            tintColor="gray"
          />
          <Text className="text-base text-gray-900">Settings</Text>
        </Pressable>
      </View>
    </View>
  );
}

export default function HomeLayout() {
  return (
    <Drawer
      drawerContent={(props) => <DrawerContent {...props} />}
      initialRouteName="chat/[id]"
    >
      <Drawer.Screen
        name="chat/[id]"
        options={{
          title: "New Chat",
          headerLeft: () => <DrawerToggle />,
          drawerItemStyle: { display: "none" },
        }}
        initialParams={{ id: "new" }}
      />
    </Drawer>
  );
}
