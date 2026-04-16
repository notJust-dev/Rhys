import { ControlledInput } from "@/components/form/ControlledInput";
import Button from "@/components/ui/Button";
import { useAuth } from "@/providers/Supabase/AuthProvider";
import { useProfile } from "@/services/profile";
import { Text, View } from "@/tw";
import * as Sentry from "@sentry/react-native";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Alert } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { z } from "zod";

const bugReportSchema = z.object({
  message: z.string().trim().min(1, "Please describe the issue"),
});

type BugReportForm = z.infer<typeof bugReportSchema>;

export default function BugReportScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { data: profile } = useProfile();
  const [submitting, setSubmitting] = useState(false);

  const methods = useForm<BugReportForm>({
    resolver: zodResolver(bugReportSchema),
    defaultValues: { message: "" },
  });

  const { handleSubmit } = methods;

  const onSubmit = async ({ message }: BugReportForm) => {
    setSubmitting(true);
    try {
      Sentry.captureFeedback({
        message,
        name: profile?.name ?? undefined,
        email: user?.email ?? undefined,
      });
      Alert.alert("Thanks!", "Your bug report has been sent.", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch {
      Alert.alert("Error", "Failed to send the report. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <FormProvider {...methods}>
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="handled"
        style={{ backgroundColor: "white" }}
        mode="layout"
      >
        <View className="px-6 pt-6 gap-2">
          <Text className="text-base text-gray-500 mb-4">
            Describe the issue you encountered and we'll look into it.
          </Text>

          <ControlledInput<BugReportForm>
            name="message"
            label="What happened?"
            placeholder="Describe the bug..."
            multiline
            numberOfLines={5}
            className="min-h-32"
            textAlignVertical="top"
            editable={!submitting}
          />

          <Button
            title={submitting ? "Sending…" : "Submit"}
            onPress={handleSubmit(onSubmit)}
            disabled={submitting}
            className="mt-2"
          />
        </View>
      </KeyboardAwareScrollView>
    </FormProvider>
  );
}
