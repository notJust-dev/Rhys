import { Database } from '@/types/database.types';
import { createClient } from "@supabase/supabase-js";
import 'expo-sqlite/localStorage/install';
import { Platform } from "react-native";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabasePublishableKey = process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

export const supabase = createClient<Database>(supabaseUrl, supabasePublishableKey, {
    auth: {
        ...(Platform.OS !== 'web' ? { storage: localStorage } : {}),
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    },

});
