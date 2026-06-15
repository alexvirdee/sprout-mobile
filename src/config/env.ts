/**
 * Runtime config. Values resolve from EXPO_PUBLIC_* env vars first (great for
 * local dev / EAS), then fall back to app.json > expo.extra.
 */

import Constants from 'expo-constants';

const extra = (Constants.expoConfig?.extra ?? {}) as {
  apiBaseUrl?: string;
  googleOAuth?: {
    iosClientId?: string;
    androidClientId?: string;
    webClientId?: string;
  };
};

export const env = {
  apiBaseUrl:
    process.env.EXPO_PUBLIC_API_BASE_URL ?? extra.apiBaseUrl ?? 'http://localhost:4000/api',

  google: {
    iosClientId:
      process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID ?? extra.googleOAuth?.iosClientId ?? '',
    androidClientId:
      process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID ?? extra.googleOAuth?.androidClientId ?? '',
    webClientId:
      process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID ?? extra.googleOAuth?.webClientId ?? '',
  },
} as const;

export const isGoogleConfigured = (): boolean =>
  Boolean(env.google.iosClientId || env.google.androidClientId || env.google.webClientId);
