import SettingsRow from "@/components/ui/SettingsRow";
import SettingsSection from "@/components/ui/SettingsSection";
import { supabase } from "@/providers/Supabase/client";
import { ScrollView, Text, View } from "@/tw";
import Constants from "expo-constants";
import { useRouter } from "expo-router";
import { openBrowserAsync } from "expo-web-browser";

const termsOfUseUrl = process.env.EXPO_PUBLIC_TERMS_OF_USE_URL;
const privacyPolicyUrl = process.env.EXPO_PUBLIC_PRIVACY_POLICY_URL;
const appVersion = Constants.expoConfig?.version ?? "1.0.0";

export default function SettingsScreen() {
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <ScrollView className="flex-1 bg-gray-100" contentContainerClassName="px-4 pt-6 pb-8 gap-4">
      <SettingsSection title="Account">
        <SettingsRow
          icon={{
            ios: "person.crop.circle",
            android: "person",
            web: "person",
          }}
          label="Edit Profile"
          onPress={() => router.push("/settings/edit-profile")}
        />
        <SettingsRow
          icon={{
            ios: "crown",
            android: "workspace_premium",
            web: "workspace_premium",
          }}
          label="Manage Subscription"
          onPress={() => router.push("/settings/subscription")}
        />
      </SettingsSection>

      <SettingsSection title="About">
        <SettingsRow
          icon={{
            ios: "ant",
            android: "bug_report",
            web: "bug_report",
          }}
          label="Report a Bug"
          onPress={() => router.push("/settings/bug-report")}
        />
        {termsOfUseUrl ? (
          <SettingsRow
            icon={{
              ios: "doc.text",
              android: "description",
              web: "description",
            }}
            label="Terms of Use"
            onPress={() => openBrowserAsync(termsOfUseUrl)}
          />
        ) : null}
        {privacyPolicyUrl ? (
          <SettingsRow
            icon={{
              ios: "lock.shield",
              android: "shield",
              web: "shield",
            }}
            label="Privacy Policy"
            onPress={() => openBrowserAsync(privacyPolicyUrl)}
          />
        ) : null}
      </SettingsSection>

      <SettingsSection>
        <SettingsRow
          icon={{
            ios: "rectangle.portrait.and.arrow.right",
            android: "logout",
            web: "logout",
          }}
          label="Log Out"
          onPress={handleLogout}
          chevron={false}
        />
      </SettingsSection>

      <View className="items-center py-4">
        <Text className="text-sm text-gray-500">Version {appVersion}</Text>
      </View>
    </ScrollView>
  );
}
