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
      <View className="flex-row items-center justify-between px-6 pb-4">
        <Text className="text-xl font-semibold text-gray-900">Chat AI</Text>
        <Pressable
          onPress={() => {
            navigation.closeDrawer();
            router.push("/settings");
          }}
          className="p-2 -mr-2"
          hitSlop={8}
        >
          <SymbolView
            name={{ ios: "gearshape", android: "settings", web: "settings" }}
            size={22}
            tintColor="gray"
          />
        </Pressable>
      </View>

      <ChatsList />

      <Pressable
        onPress={() => {
          navigation.closeDrawer();
          router.push("/chat/new");
        }}
        className="absolute bottom-10 right-6 bg-black rounded-full px-7 py-5 flex-row items-center gap-3 shadow-lg"
      >
        <SymbolView
          name={{ ios: "square.and.pencil", android: "add", web: "add" }}
          size={24}
          tintColor="white"
        />
        <Text className="text-white text-lg font-semibold">Chat</Text>
      </Pressable>
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
