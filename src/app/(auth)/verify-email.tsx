import { ControlledInput } from "@/components/form/ControlledInput";
import Button from "@/components/ui/Button";
import { useAuth } from "@/providers/Supabase/AuthProvider";
import { Pressable, Text, View } from "@/tw";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { z } from "zod";

const verifyEmailSchema = z.object({
  code: z
    .string()
    .trim()
    .regex(/^\d{6}$/, "Enter the 6-digit code"),
});

type VerifyEmailForm = z.infer<typeof verifyEmailSchema>;

export default function VerifyEmailScreen() {
  const { email } = useLocalSearchParams<{ email: string }>();
  const { verifySignUpOtp, resendSignUpOtp } = useAuth();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [resendStatus, setResendStatus] = useState<string | null>(null);
  const [resending, setResending] = useState(false);

  const methods = useForm<VerifyEmailForm>({
    resolver: zodResolver(verifyEmailSchema),
    defaultValues: { code: "" },
    mode: "onBlur",
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async ({ code }: VerifyEmailForm) => {
    setError(null);
    if (!email) {
      setError("Missing email. Go back and try again.");
      return;
    }
    try {
      await verifySignUpOtp(email, code);
      router.replace("/chat/new");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to verify email");
    }
  };

  const handleResend = async () => {
    if (!email) return;
    setResendStatus(null);
    setError(null);
    setResending(true);
    try {
      await resendSignUpOtp(email);
      setResendStatus("A new code was sent.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to resend code");
    } finally {
      setResending(false);
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
            it below to confirm your email.
          </Text>

          <ControlledInput<VerifyEmailForm>
            name="code"
            label="Verification code"
            placeholder="123456"
            keyboardType="number-pad"
            autoComplete="one-time-code"
            textContentType="oneTimeCode"
            maxLength={6}
            editable={!isSubmitting}
            onSubmitEditing={handleSubmit(onSubmit)}
          />

          {error ? <Text className="text-sm text-red-600">{error}</Text> : null}
          {resendStatus ? (
            <Text className="text-sm text-green-600">{resendStatus}</Text>
          ) : null}

          <Button
            title={isSubmitting ? "Verifying…" : "Verify email"}
            onPress={handleSubmit(onSubmit)}
            disabled={isSubmitting}
            className="mt-4"
          />

          <Pressable
            onPress={handleResend}
            disabled={resending || isSubmitting}
            className="items-center mt-3"
          >
            <Text className="text-sm text-gray-600 font-medium">
              {resending ? "Sending…" : "Resend code"}
            </Text>
          </Pressable>
        </View>
      </KeyboardAwareScrollView>
    </FormProvider>
  );
}
