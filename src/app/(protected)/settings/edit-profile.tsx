import { useProfile, useUpdateProfile } from "@/services/profile";
import { Pressable, Text, TextInput, View } from "@/tw";
import { useEffect, useState } from "react";

export default function EditProfileScreen() {
  const { data: profile, isLoading } = useProfile();
  const updateProfile = useUpdateProfile();

  const [name, setName] = useState("");

  useEffect(() => {
    if (profile) {
      setName(profile.name ?? "");
    }
  }, [profile]);

  const handleSave = () => {
    updateProfile.mutate({
      name: name || null,
      updated_at: new Date().toISOString(),
    });
  };

  if (isLoading) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <Text className="text-gray-400">Loading...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white px-6 pt-6 gap-6">
      <View className="gap-2">
        <Text className="text-sm font-medium text-gray-500">Name</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Your name"
          className="border border-gray-200 rounded-xl px-4 py-3 text-base"
        />
      </View>

      <Pressable
        onPress={handleSave}
        disabled={updateProfile.isPending}
        className="bg-black rounded-full py-4 items-center mt-2"
        style={{ opacity: updateProfile.isPending ? 0.5 : 1 }}
      >
        <Text className="text-white text-base font-semibold">
          Save
        </Text>
      </Pressable>
    </View>
  );
}
