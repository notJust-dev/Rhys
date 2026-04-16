import Button from "@/components/ui/Button";
import { useAuth } from "@/providers/Supabase/AuthProvider";
import { Text, View } from "@/tw";
import { useState } from "react";

export default function WelcomeScreen() {
  const { signInAnonymously } = useAuth();
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

      <Button
        title="Continue with email"
        href="/sign-in"
        disabled={loading}
        className="mt-4 w-full"
      />

      <Button
        title={"Continue as Guest"}
        variant="link"
        onPress={handleContinueAsGuest}
        disabled={loading}
        className="w-full"
      />
    </View>
  );
}
