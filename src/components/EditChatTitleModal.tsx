import { ControlledInput } from "@/components/form/ControlledInput";
import { useUpdateChatTitle } from "@/services/chats";
import { Pressable, Text, View } from "@/tw";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Modal } from "react-native";
import { z } from "zod";

const renameSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(120, "Too long"),
});

type RenameForm = z.infer<typeof renameSchema>;

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
  const updateTitle = useUpdateChatTitle();
  const methods = useForm<RenameForm>({
    resolver: zodResolver(renameSchema),
    defaultValues: { title: initialTitle ?? "" },
  });
  const { handleSubmit, reset } = methods;

  useEffect(() => {
    if (visible) reset({ title: initialTitle ?? "" });
  }, [visible, initialTitle, reset]);

  const onSubmit = ({ title }: RenameForm) => {
    updateTitle.mutate({ id: chatId, title }, { onSuccess: onClose });
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
          <FormProvider {...methods}>
            <ControlledInput<RenameForm>
              name="title"
              placeholder="Chat title"
              autoFocus
              returnKeyType="done"
              onSubmitEditing={handleSubmit(onSubmit)}
            />
          </FormProvider>
          <View className="flex-row justify-end gap-2 mt-2">
            <Pressable onPress={onClose} className="px-4 py-2 rounded-xl">
              <Text className="text-gray-600 font-medium">Cancel</Text>
            </Pressable>
            <Pressable
              onPress={handleSubmit(onSubmit)}
              disabled={updateTitle.isPending}
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
