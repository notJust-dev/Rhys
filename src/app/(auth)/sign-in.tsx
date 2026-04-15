import { ControlledInput } from "@/components/form/ControlledInput";
import { useAuth } from "@/providers/Supabase/AuthProvider";
import { Pressable, Text, View } from "@/tw";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
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
      <View className="flex-1 bg-white px-8 pt-10 gap-2">
        <Text className="text-2xl font-bold text-gray-900">Sign in</Text>
        <Text className="text-base text-gray-500 mb-4">
          Use your email and password to continue.
        </Text>

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

        <Pressable
          className="bg-black rounded-full px-8 py-4 mt-4 items-center"
          onPress={handleSubmit(onSubmit)}
          disabled={isSubmitting}
          style={{ opacity: isSubmitting ? 0.5 : 1 }}
        >
          <Text className="text-white text-base font-semibold">
            {isSubmitting ? "Signing in…" : "Sign in"}
          </Text>
        </Pressable>
      </View>
    </FormProvider>
  );
}
