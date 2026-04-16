import { useGlobalSearchParams, usePathname } from "expo-router";
import { PostHogProvider } from 'posthog-react-native';
import { PropsWithChildren, useEffect, useRef } from "react";
import { useAuth } from "../Supabase/AuthProvider";
import { posthog } from "./posthog";

export default function SharedPostHogProvider({ children }: PropsWithChildren) {
    const pathname = usePathname();
    const params = useGlobalSearchParams();

    const { user } = useAuth();
    const lastIdentifiedUserId = useRef<string | null>(null);

    // Track the location in your analytics provider here.
    useEffect(() => {
        posthog?.screen(pathname, params)
    }, [pathname, params]);

    // Identify user when they sign in or change
    useEffect(() => {
        if (user && user.id !== lastIdentifiedUserId.current) {
            // Reset PostHog if user changed (e.g., signed out and got new anonymous session)
            if (lastIdentifiedUserId.current !== null) {
                posthog?.reset();
            }
            posthog?.identify(user.id);
            lastIdentifiedUserId.current = user.id;
        }
    }, [user]);

    // Return children without provider during SSR/export
    if (!posthog) {
        return children;
    }

    return (
        <PostHogProvider
            client={posthog}
            options={{
                enableSessionReplay: true
            }}
            autocapture={{
                captureScreens: false, // Screen events are handled differently for v7 and higher
                captureTouches: true,
            }}
        >
            {children}
        </PostHogProvider>
    );
}