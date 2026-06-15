/**
 * Token storage backed by expo-secure-store (Keychain / Keystore). Never store
 * JWTs in AsyncStorage — they belong in the secure enclave.
 */

import * as SecureStore from 'expo-secure-store';

import { AuthTokens } from '@app-types/api';

const ACCESS_KEY = 'sprout.accessToken';
const REFRESH_KEY = 'sprout.refreshToken';

export async function getAccessToken(): Promise<string | null> {
  return SecureStore.getItemAsync(ACCESS_KEY);
}

export async function getRefreshToken(): Promise<string | null> {
  return SecureStore.getItemAsync(REFRESH_KEY);
}

export async function setTokens(tokens: AuthTokens): Promise<void> {
  await Promise.all([
    SecureStore.setItemAsync(ACCESS_KEY, tokens.accessToken),
    SecureStore.setItemAsync(REFRESH_KEY, tokens.refreshToken),
  ]);
}

export async function clearTokens(): Promise<void> {
  await Promise.all([
    SecureStore.deleteItemAsync(ACCESS_KEY),
    SecureStore.deleteItemAsync(REFRESH_KEY),
  ]);
}
