import * as Sentry from '@sentry/react-native';
import { isRunningInExpoGo } from 'expo';
import * as ImagePicker from 'expo-image-picker';
import { useNavigationContainerRef } from 'expo-router';
import { PropsWithChildren, useEffect, useRef } from 'react';
import { Text } from 'react-native';
import { useAuth } from '../Supabase/AuthProvider';
import { disableInDevelopment, dsn } from './config';

const navigationIntegration = Sentry.reactNavigationIntegration({
    enableTimeToInitialDisplay: !isRunningInExpoGo(),
});

const replayIntegration = Sentry.mobileReplayIntegration({
    maskAllText: false,
    maskAllImages: false,
    maskAllVectors: false,
});

const feedbackIntegration = Sentry.feedbackIntegration({
    formTitle: 'Give feedback',
    messagePlaceholder: 'Enter your feedback here',
    submitButtonLabel: 'Send feedback',
    showBranding: false,
    enableScreenshot: true,
    // @ts-ignore
    imagePicker: ImagePicker,

    colorScheme: 'system',
    themeLight: {
        accentBackground: 'black',
    },
    themeDark: {
        accentBackground: 'white',
        accentForeground: 'black',
    },
});

if (dsn) {
    const enabled = !__DEV__ || (__DEV__ && !disableInDevelopment);

    Sentry.init({
        // Disable Sentry in development. Comment this out to test Sentry in development
        enabled,

        dsn,
        sendDefaultPii: true,
        tracesSampleRate: 1.0,
        enableNativeFramesTracking: !isRunningInExpoGo(),

        replaysSessionSampleRate: 0.1,
        replaysOnErrorSampleRate: 1.0,

        integrations: [navigationIntegration, feedbackIntegration, replayIntegration],

        // uncomment the line below to enable Spotlight (https://spotlightjs.com)
        // spotlight: __DEV__,
    });
} else {
    console.warn('Sentry has not been setup. Please check your .env file.');
}

function SentryProvider({ children }: PropsWithChildren) {
    const ref = useNavigationContainerRef();
    const { user } = useAuth();
    const lastIdentifiedUserId = useRef<string | null>(null);

    useEffect(() => {
        if (ref) {
            navigationIntegration.registerNavigationContainer(ref);
        }
    }, [ref]);

    // Set Sentry user context when user changes
    useEffect(() => {
        if (!user) {
            // Clear user context when not authenticated
            if (lastIdentifiedUserId.current !== null) {
                Sentry.setUser(null);
                lastIdentifiedUserId.current = null;
            }
            return;
        }

        if (user.id !== lastIdentifiedUserId.current) {
            // Clear previous user context if user changed
            if (lastIdentifiedUserId.current !== null) {
                Sentry.setUser(null);
            }
            Sentry.setUser({
                id: user.id,
                email: user.email ?? undefined,
                // data: { locale },
            });
            lastIdentifiedUserId.current = user.id;
        }
    }, [user]);

    return (
        <Sentry.ErrorBoundary fallback={<Text>An error has occurred</Text>}>
            {children}
        </Sentry.ErrorBoundary>
    );
}

export default dsn ? Sentry.wrap(SentryProvider) : SentryProvider;