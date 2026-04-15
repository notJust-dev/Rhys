import { useUpdateChatTitle } from "@/services/chats";
import { Pressable, Text, TextInput, View } from "@/tw";
import { useEffect, useState } from "react";
import { Modal } from "react-native";

type Props = {
  visible: boolean;
  chatId: string;
  initialTitle: string | null;
  onClose: () => void;
};

export function EditChatTitleModal({
  visible,
  chatId,
  initialTitle,
  onClose,
}: Props) {
  const [value, setValue] = useState(initialTitle ?? "");
  const updateTitle = useUpdateChatTitle();

  useEffect(() => {
    if (visible) setValue(initialTitle ?? "");
  }, [visible, initialTitle]);

  const handleSave = () => {
    const trimmed = value.trim();
    if (!trimmed) return;
    updateTitle.mutate(
      { id: chatId, title: trimmed },
      { onSuccess: onClose },
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable
        onPress={onClose}
        className="flex-1 bg-neutral-800/60 justify-center px-8"
      >
        <Pressable onPress={() => { }} className="bg-white rounded-2xl p-5">
          <Text className="text-lg font-semibold text-gray-900 mb-3">
            Rename chat
          </Text>
          <TextInput
            value={value}
            onChangeText={setValue}
            autoFocus
            placeholder="Chat title"
            className="border border-gray-300 rounded-xl px-4 py-3 text-base text-gray-900"
            onSubmitEditing={handleSave}
            returnKeyType="done"
          />
          <View className="flex-row justify-end gap-2 mt-4">
            <Pressable onPress={onClose} className="px-4 py-2 rounded-xl">
              <Text className="text-gray-600 font-medium">Cancel</Text>
            </Pressable>
            <Pressable
              onPress={handleSave}
              disabled={updateTitle.isPending || !value.trim()}
              className="px-4 py-2 rounded-xl bg-black"
            >
              <Text className="text-white font-medium">Save</Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
