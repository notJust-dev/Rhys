import { CHAT_MODELS, getModelById } from "@/constants/models";
import { CustomEvents } from "@/providers/Posthog/events";
import { Pressable, Text, View } from "@/tw";
import { SymbolView } from "expo-symbols";
import { Modal } from "react-native";

type Props = {
  visible: boolean;
  selectedModel: string;
  onSelect: (modelId: string) => void;
  onClose: () => void;
  readOnly?: boolean;
};

export function ModelPickerModal({
  visible,
  selectedModel,
  onSelect,
  onClose,
  readOnly = false,
}: Props) {
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
            {readOnly ? "Model" : "Select model"}
          </Text>
          <View className="gap-1">
            {CHAT_MODELS.map((model) => {
              const isSelected = model.id === selectedModel;
              const dimmed = readOnly && !isSelected;
              return (
                <Pressable
                  key={model.id}
                  disabled={readOnly}
                  onPress={() => {
                    onSelect(model.id);
                    CustomEvents.trackModelSelected({
                      model: model.id,
                      provider: model.provider,
                    });
                    onClose();
                  }}
                  className={`flex-row items-center p-3 rounded-xl ${isSelected ? "bg-gray-100" : ""
                    } ${dimmed ? "opacity-40" : ""}`}
                >
                  <View className="flex-1">
                    <Text className="text-base font-medium text-gray-900">
                      {model.label}
                    </Text>
                    <Text className="text-sm text-gray-500" numberOfLines={1}>
                      {model.description}
                    </Text>
                  </View>
                  {isSelected ? (
                    <SymbolView
                      name={{
                        ios: "checkmark",
                        android: "check",
                        web: "check",
                      }}
                      size={18}
                      tintColor="black"
                    />
                  ) : null}
                </Pressable>
              );
            })}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
