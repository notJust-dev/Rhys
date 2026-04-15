import { ControlledInput } from "@/components/form/ControlledInput";
import { useAuth } from "@/providers/Supabase/AuthProvider";
import { Link, Pressable, Text, View } from "@/tw";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { z } from "zod";

const signUpSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(80, "Name is too long"),
  email: z.string().trim().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type SignUpForm = z.infer<typeof signUpSchema>;

export default function SignUpScreen() {
  const { signUpWithEmail } = useAuth();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const methods = useForm<SignUpForm>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { name: "", email: "", password: "" },
    mode: "onBlur",
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async ({ name, email, password }: SignUpForm) => {
    setError(null);
    try {
      await signUpWithEmail(email, password, name);
      router.replace("/chat/new");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Sign up failed");
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
          <ControlledInput<SignUpForm>
            name="name"
            label="Name"
            placeholder="Your name"
            autoCapitalize="words"
            autoComplete="name"
            editable={!isSubmitting}
          />

          <ControlledInput<SignUpForm>
            name="email"
            label="Email"
            placeholder="you@example.com"
            autoCapitalize="none"
            autoComplete="email"
            keyboardType="email-address"
            editable={!isSubmitting}
          />

          <ControlledInput<SignUpForm>
            name="password"
            label="Password"
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
              {isSubmitting ? "Creating account…" : "Sign up"}
            </Text>
          </Pressable>

          <View className="flex-row justify-center mt-4">
            <Text className="text-gray-500 text-sm">
              Already have an account?{" "}
            </Text>
            <Link href="/sign-in" className="text-black text-sm font-semibold">
              Sign in
            </Link>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </FormProvider>
  );
}
