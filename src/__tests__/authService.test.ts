/**
 * authService — calls the right endpoints with the right method/body, omits the
 * auth header on signup/login, and attaches the stored bearer token on /me.
 */

import { authService } from '@services/authService';
import * as SecureStore from 'expo-secure-store';

const BASE = 'http://localhost:4000/api';

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
});

it('signup → POST /auth/signup with body and no Authorization header', async () => {
  mockFetchOnce(201, { token: 't', user: { id: '1' } });
  await authService.signup({ name: 'Alex', email: 'alex@example.com', password: 'Password1' });

  const [url, opts] = (global.fetch as jest.Mock).mock.calls[0];
  expect(url).toBe(`${BASE}/auth/signup`);
  expect(opts.method).toBe('POST');
  expect(opts.headers.Authorization).toBeUndefined();
  expect(JSON.parse(opts.body)).toEqual({ name: 'Alex', email: 'alex@example.com', password: 'Password1' });
});

it('login → POST /auth/login', async () => {
  mockFetchOnce(200, { token: 't', user: { id: '1' } });
  await authService.login({ email: 'alex@example.com', password: 'Password1' });

  const [url, opts] = (global.fetch as jest.Mock).mock.calls[0];
  expect(url).toBe(`${BASE}/auth/login`);
  expect(opts.method).toBe('POST');
});

it('me → GET /auth/me with Authorization header from stored token', async () => {
  (SecureStore.getItemAsync as jest.Mock).mockResolvedValueOnce('stored-jwt');
  mockFetchOnce(200, { user: { id: '1' } });
  await authService.me();

  const [url, opts] = (global.fetch as jest.Mock).mock.calls[0];
  expect(url).toBe(`${BASE}/auth/me`);
  expect(opts.method).toBe('GET');
  expect(opts.headers.Authorization).toBe('Bearer stored-jwt');
});

it('throws a typed ApiError on a non-2xx response', async () => {
  mockFetchOnce(401, { message: 'Invalid email or password' });
  await expect(authService.login({ email: 'a@b.com', password: 'x' })).rejects.toMatchObject({
    status: 401,
    message: 'Invalid email or password',
  });
});
