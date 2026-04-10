import { Pressable } from "@/tw";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import { Drawer } from "expo-router/drawer";
import { SymbolView } from 'expo-symbols';

function DrawerToggle() {
  const navigation = useNavigation();

  return (
    <Pressable
      onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
      className="p-2"
    >
      <SymbolView
        name={{ ios: 'line.3.horizontal', android: 'menu', web: 'menu' }}
        size={22}
        tintColor="gray" />
    </Pressable>
  );
}

export default function HomeLayout() {
  return (
    <Drawer>
      <Drawer.Screen
        name="index"
        options={{
          title: "New Chat",
          headerLeft: () => <DrawerToggle />,
        }}
      />
    </Drawer>
  );
}
