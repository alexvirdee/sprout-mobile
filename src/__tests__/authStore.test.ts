/**
 * authStore — state machine: loading → authenticated after login, unauthenticated
 * after logout, restore on bootstrap, and clear on an invalid token. Verifies the
 * token is saved/cleared in secure storage.
 */

import { useAuthStore } from '@store/authStore';
import * as SecureStore from 'expo-secure-store';
import { User } from '@app-types/models';

const USER: User = { id: '1', name: 'Alex', email: 'alex@example.com', authProvider: 'credentials', avatar: null, createdAt: '2026-01-01' };

function mockFetchOnce(status: number, body: unknown) {
  (global.fetch as jest.Mock).mockResolvedValueOnce({
    ok: status >= 200 && status < 300,
    status,
    text: async () => JSON.stringify(body),
  });
}

beforeEach(() => {
  global.fetch = jest.fn();
  jest.clearAllMocks();
  useAuthStore.setState({ status: 'loading', user: null, token: null, isDemo: false, error: null });
});

it('starts in the loading state', () => {
  expect(useAuthStore.getState().status).toBe('loading');
});

it('authenticates and stores the token after login', async () => {
  mockFetchOnce(200, { token: 'jwt-abc', user: USER });
  await useAuthStore.getState().login('alex@example.com', 'Password1');

  const s = useAuthStore.getState();
  expect(s.status).toBe('authenticated');
  expect(s.user?.email).toBe('alex@example.com');
  expect(s.token).toBe('jwt-abc');
  expect(s.error).toBeNull();
  expect(SecureStore.setItemAsync).toHaveBeenCalledWith('sprout.token', 'jwt-abc');
});

it('sets an error and stays unauthenticated on a failed login', async () => {
  mockFetchOnce(401, { message: 'Invalid email or password' });
  await expect(useAuthStore.getState().login('alex@example.com', 'wrong')).rejects.toBeDefined();

  const s = useAuthStore.getState();
  expect(s.status).not.toBe('authenticated');
  expect(s.error).toBe('Invalid email or password');
  expect(SecureStore.setItemAsync).not.toHaveBeenCalled();
});

it('clears the token and state on logout', async () => {
  useAuthStore.setState({ status: 'authenticated', user: USER, token: 'jwt-abc', isDemo: false, error: null });
  await useAuthStore.getState().logout();

  const s = useAuthStore.getState();
  expect(s.status).toBe('unauthenticated');
  expect(s.user).toBeNull();
  expect(s.token).toBeNull();
  expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith('sprout.token');
});

it('restores the session on bootstrap when the stored token is valid', async () => {
  (SecureStore.getItemAsync as jest.Mock).mockResolvedValueOnce('jwt-abc');
  mockFetchOnce(200, { user: USER });
  await useAuthStore.getState().bootstrap();

  const s = useAuthStore.getState();
  expect(s.status).toBe('authenticated');
  expect(s.user?.email).toBe('alex@example.com');
});

it('clears the session on bootstrap when the token is invalid', async () => {
  (SecureStore.getItemAsync as jest.Mock).mockResolvedValueOnce('bad-token');
  mockFetchOnce(401, { message: 'Invalid or expired token' });
  await useAuthStore.getState().bootstrap();

  const s = useAuthStore.getState();
  expect(s.status).toBe('unauthenticated');
  expect(s.user).toBeNull();
  expect(SecureStore.deleteItemAsync).toHaveBeenCalled();
});

it('goes straight to unauthenticated on bootstrap when there is no token', async () => {
  (SecureStore.getItemAsync as jest.Mock).mockResolvedValueOnce(null);
  await useAuthStore.getState().bootstrap();
  expect(useAuthStore.getState().status).toBe('unauthenticated');
  expect(global.fetch).not.toHaveBeenCalled();
});
