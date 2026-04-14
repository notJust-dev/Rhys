import { useAuth } from "@/providers/Supabase/AuthProvider";
import { Pressable, Text, TextInput, View } from "@/tw";
import { useRouter } from "expo-router";
import { useState } from "react";

export default function SignInScreen() {
  const { signInWithEmail } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async () => {
    if (!email.trim() || !password) return;
    setLoading(true);
    setError(null);
    try {
      await signInWithEmail(email.trim(), password);
      router.replace("/chat/new");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Sign in failed");
      setLoading(false);
    }
  };

  const canSubmit = !!email.trim() && !!password && !loading;

  return (
    <View className="flex-1 bg-white px-8 pt-10 gap-4">
      <Text className="text-2xl font-bold text-gray-900">Sign in</Text>
      <Text className="text-base text-gray-500">
        Use your email and password to continue.
      </Text>

      <View className="gap-2 mt-4">
        <Text className="text-sm font-medium text-gray-700">Email</Text>
        <TextInput
          className="border border-gray-200 rounded-xl px-4 py-3 text-base bg-gray-50"
          placeholder="you@example.com"
          placeholderTextColor="#9ca3af"
          autoCapitalize="none"
          autoComplete="email"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          editable={!loading}
        />
      </View>

      <View className="gap-2">
        <Text className="text-sm font-medium text-gray-700">Password</Text>
        <TextInput
          className="border border-gray-200 rounded-xl px-4 py-3 text-base bg-gray-50"
          placeholder="••••••••"
          placeholderTextColor="#9ca3af"
          secureTextEntry
          autoComplete="password"
          value={password}
          onChangeText={setPassword}
          editable={!loading}
          onSubmitEditing={handleSignIn}
        />
      </View>

      {error ? (
        <Text className="text-sm text-red-600">{error}</Text>
      ) : null}

      <Pressable
        className="bg-black rounded-full px-8 py-4 mt-2 items-center"
        onPress={handleSignIn}
        disabled={!canSubmit}
        style={{ opacity: canSubmit ? 1 : 0.5 }}
      >
        <Text className="text-white text-base font-semibold">
          {loading ? "Signing in…" : "Sign in"}
        </Text>
      </Pressable>
    </View>
  );
}
