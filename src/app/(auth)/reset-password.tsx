import { ControlledInput } from "@/components/form/ControlledInput";
import { useAuth } from "@/providers/Supabase/AuthProvider";
import { Pressable, Text, View } from "@/tw";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { z } from "zod";

const resetPasswordSchema = z.object({
  code: z
    .string()
    .trim()
    .regex(/^\d{6}$/, "Enter the 6-digit code"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type ResetPasswordForm = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordScreen() {
  const { email } = useLocalSearchParams<{ email: string }>();
  const { verifyPasswordResetOtp, updatePassword } = useAuth();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const methods = useForm<ResetPasswordForm>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { code: "", password: "" },
    mode: "onBlur",
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async ({ code, password }: ResetPasswordForm) => {
    setError(null);
    if (!email) {
      setError("Missing email. Go back and try again.");
      return;
    }
    try {
      await verifyPasswordResetOtp(email, code);
      await updatePassword(password);
      router.replace("/chat/new");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to reset password");
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
            We sent a 6-digit code to{" "}
            <Text className="font-semibold text-gray-900">{email}</Text>. Enter
            it below along with your new password.
          </Text>

          <ControlledInput<ResetPasswordForm>
            name="code"
            label="Verification code"
            placeholder="123456"
            keyboardType="number-pad"
            autoComplete="one-time-code"
            textContentType="oneTimeCode"
            maxLength={6}
            editable={!isSubmitting}
          />

          <ControlledInput<ResetPasswordForm>
            name="password"
            label="New password"
            placeholder="••••••••"
            secureTextEntry
            autoComplete="new-password"
            editable={!isSubmitting}
            onSubmitEditing={handleSubmit(onSubmit)}
          />

          {error ? <Text className="text-sm text-red-600">{error}</Text> : null}

          <Pressable
            className="bg-black rounded-full px-8 py-4 mt-4 items-center"
            onPress={handleSubmit(onSubmit)}
            disabled={isSubmitting}
            style={{ opacity: isSubmitting ? 0.5 : 1 }}
          >
            <Text className="text-white text-base font-semibold">
              {isSubmitting ? "Resetting…" : "Reset password"}
            </Text>
          </Pressable>
        </View>
      </KeyboardAwareScrollView>
    </FormProvider>
  );
}
