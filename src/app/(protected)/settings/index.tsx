import { supabase } from "@/providers/Supabase/client";
import { Pressable, ScrollView, Text, View } from "@/tw";
import { showFeedbackWidget } from "@sentry/react-native";
import Constants from "expo-constants";
import { useRouter } from "expo-router";
import { SymbolView, type SymbolViewProps } from "expo-symbols";
import { openBrowserAsync } from "expo-web-browser";

const termsOfUseUrl = process.env.EXPO_PUBLIC_TERMS_OF_USE_URL;
const privacyPolicyUrl = process.env.EXPO_PUBLIC_PRIVACY_POLICY_URL;
const appVersion = Constants.expoConfig?.version ?? "1.0.0";

type SettingsRowProps = {
  icon: SymbolViewProps["name"];
  iconColor?: string;
  label: string;
  onPress: () => void;
  chevron?: boolean;
  textColor?: string;
};

function SettingsRow({
  icon,
  iconColor = "gray",
  label,
  onPress,
  chevron = true,
  textColor = "text-gray-900",
}: SettingsRowProps) {
  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center justify-between py-4"
    >
      <View className="flex-row items-center gap-3">
        <SymbolView name={icon} size={22} tintColor={iconColor} />
        <Text className={`text-base ${textColor}`}>{label}</Text>
      </View>
      {chevron ? (
        <SymbolView
          name={{
            ios: "chevron.right",
            android: "chevron_right",
            web: "chevron_right",
          }}
          size={16}
          tintColor="gray"
        />
      ) : null}
    </Pressable>
  );
}

export default function SettingsScreen() {
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <ScrollView className="flex-1 bg-white" contentContainerClassName="px-6 pt-6 pb-8">
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

      <View className="border-t border-gray-100 mt-4 pt-2">
        <Text className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
          About
        </Text>

        <SettingsRow
          icon={{
            ios: "ant",
            android: "bug_report",
            web: "bug_report",
          }}
          label="Report a Bug"
          onPress={() => showFeedbackWidget()}
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

      </View>

      <View className="border-t border-gray-100 mt-4" />

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

      <View className="items-center py-6">
        <Text className="text-sm text-gray-400">
          Version {appVersion}
        </Text>
      </View>
    </ScrollView>
  );
}
