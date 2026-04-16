import { ConfigContext, ExpoConfig } from 'expo/config';

const sentryProject = process.env.EXPO_PUBLIC_SENTRY_PROJECT;
const sentryOrg = process.env.EXPO_PUBLIC_SENTRY_ORG;

const plugins: ExpoConfig['plugins'] = [];

if (sentryProject && sentryOrg) {
    plugins.push([
        '@sentry/react-native/expo',
        {
            url: 'https://sentry.io/',
            project: sentryProject,
            organization: sentryOrg,
        },
    ]);
}

export default ({ config }: ConfigContext): ExpoConfig => ({
    ...config,
    plugins: [
        ...(config.plugins || []),
        ...plugins
    ],
    slug: 'rhys',
    name: 'Rhys',
})