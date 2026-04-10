import 'expo-sqlite/localStorage/install';
import { Platform } from 'react-native';

import { Database } from '@/types/database.types';
import { createClient } from '@supabase/supabase-js';
import { supabasePublishableKey, supabaseUrl } from './config';

if (!supabaseUrl || !supabasePublishableKey) {
    throw new Error('Supabase URL or publishable key is not set');
}

export const supabase = createClient<Database>(
    supabaseUrl,
    supabasePublishableKey,
    {
        auth: {
            ...(Platform.OS !== 'web' ? { storage: localStorage } : {}),
            autoRefreshToken: true,
            persistSession: true,
            detectSessionInUrl: false,
        },
    },
);