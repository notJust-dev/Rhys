import { useAuth } from "@/providers/Supabase/AuthProvider";
import { Pressable, Text, View } from "@/tw";
import { useRouter } from "expo-router";
import { useState } from "react";

export default function WelcomeScreen() {
  const { signInAnonymously } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleContinueAsGuest = async () => {
    setLoading(true);
    try {
      await signInAnonymously();
    } catch {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-white items-center justify-center px-8 gap-4">
      <Text className="text-3xl font-bold text-gray-900">Welcome to AIChat</Text>
      <Text className="text-base text-gray-500 text-center">
        Your AI assistant, ready to help with anything.
      </Text>

      <Pressable
        className="bg-black rounded-full px-8 py-4 mt-4 w-full items-center"
        onPress={() => router.push("/sign-in")}
        disabled={loading}
      >
        <Text className="text-white text-base font-semibold">
          Continue with email
        </Text>
      </Pressable>

      <Pressable
        className="rounded-full px-8 py-4 w-full items-center border border-gray-300"
        onPress={handleContinueAsGuest}
        disabled={loading}
        style={{ opacity: loading ? 0.5 : 1 }}
      >
        <Text className="text-gray-900 text-base font-semibold">
          {loading ? "Signing in…" : "Continue as Guest"}
        </Text>
      </Pressable>
    </View>
  );
}
