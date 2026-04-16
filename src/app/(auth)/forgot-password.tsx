import { ControlledInput } from "@/components/form/ControlledInput";
import Button from "@/components/ui/Button";
import { useAuth } from "@/providers/Supabase/AuthProvider";
import { Text, View } from "@/tw";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { z } from "zod";

const forgotPasswordSchema = z.object({
  email: z.string().trim().email("Enter a valid email"),
});

type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordScreen() {
  const { resetPasswordForEmail } = useAuth();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const methods = useForm<ForgotPasswordForm>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
    mode: "onBlur",
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async ({ email }: ForgotPasswordForm) => {
    setError(null);
    try {
      await resetPasswordForEmail(email);
      router.push({ pathname: "/reset-password", params: { email } });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to send reset email");
    }
  };

  return (
    <FormProvider {...methods}>
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="handled"
        contentInsetAdjustmentBehavior="automatic"
        style={{ backgroundColor: "white" }}
        mode="layout"
      >
        <View className="px-8 pt-6 gap-2">
          <Text className="text-base text-gray-500 mb-4">
            Enter the email associated with your account and we'll send you a
            verification code.
          </Text>

          <ControlledInput<ForgotPasswordForm>
            name="email"
            label="Email"
            placeholder="you@example.com"
            autoCapitalize="none"
            autoComplete="email"
            keyboardType="email-address"
            editable={!isSubmitting}
            onSubmitEditing={handleSubmit(onSubmit)}
          />

          {error ? (
            <Text className="text-sm text-red-600">{error}</Text>
          ) : null}

          <Button
            title={isSubmitting ? "Sending…" : "Send code"}
            onPress={handleSubmit(onSubmit)}
            disabled={isSubmitting}
            className="mt-4"
          />
        </View>
      </KeyboardAwareScrollView>
    </FormProvider>
  );
}
