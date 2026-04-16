import { ControlledInput } from "@/components/form/ControlledInput";
import Button from "@/components/ui/Button";
import { useProfile, useUpdateProfile } from "@/services/profile";
import { Text, View } from "@/tw";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

const editProfileSchema = z.object({
  name: z.string().trim().max(80, "Name is too long"),
});

type EditProfileForm = z.infer<typeof editProfileSchema>;

export default function EditProfileScreen() {
  const { data: profile, isLoading } = useProfile();
  const updateProfile = useUpdateProfile();

  const methods = useForm<EditProfileForm>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: { name: "" },
  });
  const { handleSubmit, reset } = methods;

  useEffect(() => {
    if (profile) reset({ name: profile.name ?? "" });
  }, [profile, reset]);

  const onSubmit = ({ name }: EditProfileForm) => {
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
    <FormProvider {...methods}>
      <View className="flex-1 bg-white px-6 pt-6 gap-2">
        <ControlledInput<EditProfileForm>
          name="name"
          label="Name"
          placeholder="Your name"
        />

        <Button
          title="Save"
          onPress={handleSubmit(onSubmit)}
          disabled={updateProfile.isPending}
          className="mt-2"
        />
      </View>
    </FormProvider>
  );
}
