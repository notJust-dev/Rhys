import { ControlledInput } from "@/components/form/ControlledInput";
import Button from "@/components/ui/Button";
import { useAuth } from "@/providers/Supabase/AuthProvider";
import { Link, Text, View } from "@/tw";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { z } from "zod";

const signInSchema = z.object({
  email: z.string().trim().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

type SignInForm = z.infer<typeof signInSchema>;

export default function SignInScreen() {
  const { signInWithEmail } = useAuth();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const methods = useForm<SignInForm>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
    mode: "onBlur",
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async ({ email, password }: SignInForm) => {
    setError(null);
    try {
      await signInWithEmail(email, password);
      router.replace("/chat/new");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Sign in failed");
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
          <ControlledInput<SignInForm>
            name="email"
            label="Email"
            placeholder="you@example.com"
            autoCapitalize="none"
            autoComplete="email"
            keyboardType="email-address"
            editable={!isSubmitting}
          />

          <ControlledInput<SignInForm>
            name="password"
            label="Password"
            placeholder="••••••••"
            secureTextEntry
            autoComplete="password"
            editable={!isSubmitting}
            onSubmitEditing={handleSubmit(onSubmit)}
          />

          {error ? <Text className="text-sm text-red-600">{error}</Text> : null}

          <Link
            href="/forgot-password"
            className="text-sm text-gray-600 font-medium"
          >
            Forgot password?
          </Link>

          <Button
            title={isSubmitting ? "Signing in…" : "Sign in"}
            onPress={handleSubmit(onSubmit)}
            disabled={isSubmitting}
            className="mt-4"
          />

          <View className="flex-row justify-center mt-4">
            <Text className="text-gray-500 text-sm">Don't have an account? </Text>
            <Link href="/sign-up" className="text-black text-sm font-semibold">
              Sign up
            </Link>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </FormProvider>
  );
}
