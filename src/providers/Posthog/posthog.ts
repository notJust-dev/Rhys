import PostHog from 'posthog-react-native';
import { posthogApiKey, posthogHost } from './config';

// Check if we're in a browser/client environment
const isClient = typeof window !== 'undefined';

if (!posthogApiKey) {
    console.warn('PostHog API key is not set');
}

// Only initialize PostHog on the client side
export const posthog = isClient && posthogApiKey ? new PostHog(posthogApiKey, {
    host: posthogHost,

    // Enable session recording. Requires enabling in your project settings as well.
    // Default is false.
    enableSessionReplay: true,
    sessionReplayConfig: {
        // Whether text and text input fields are masked. Default is true.
        // Password inputs are always masked regardless
        maskAllTextInputs: true,
        // Whether images are masked. Default is true.
        maskAllImages: true,
        // Enable masking of all sandboxed system views like UIImagePickerController, PHPickerViewController and CNContactPickerViewController. Default is true.
        // iOS only
        maskAllSandboxedViews: true,
        // Capture logs automatically. Default is true.
        // Android only (Native Logcat only)
        captureLog: true,
        // Whether network requests are captured in recordings. Default is true
        // Only metric-like data like speed, size, and response code are captured.
        // No data is captured from the request or response body.
        // iOS only
        captureNetworkTelemetry: true,
        // Throttling delay used to reduce the number of snapshots captured and reduce performance impact
        // The lower the number more snapshots will be captured but higher the performance impact
        // Default is 1000ms
        throttleDelayMs: 1000,
    },
}) : null;