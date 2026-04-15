import { Pressable, View } from "@/tw";
import {
  DropdownMenu,
  DropdownMenuItem,
  Host,
  Text
} from "@expo/ui/jetpack-compose";
import { useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useState } from "react";
import type { ChatListItemMenuProps } from "./ChatListItemMenu";

export function ChatListItemMenu({
  href,
  onDelete,
  children,
}: ChatListItemMenuProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleDelete = () => {
    setOpen(false);
    onDelete();
  };

  return (
    <View className="flex-row items-center">
      <Pressable onPress={() => router.push(href)} className="flex-1">
        {children}
      </Pressable>
      <Host matchContents>
        <DropdownMenu
          expanded={open}
          onDismissRequest={() => setOpen(false)}
        >
          <DropdownMenu.Trigger>
            <Pressable onPress={() => setOpen(true)} className="p-2">
              <SymbolView
                name={{ ios: "ellipsis", android: "more_vert", web: "menu" }}
                size={22}
                tintColor="gray"
              />
            </Pressable>
          </DropdownMenu.Trigger>
          <DropdownMenu.Items>
            <DropdownMenuItem onClick={handleDelete}>
              <DropdownMenuItem.Text>
                <Text>Delete</Text>
              </DropdownMenuItem.Text>
            </DropdownMenuItem>
          </DropdownMenu.Items>
        </DropdownMenu>
      </Host>
    </View>
  );
}
