/**
 * Auth form validation — the Zod schemas that back the sign in / sign up forms
 * (used via zodResolver in the screens).
 */

import { signInSchema, signUpSchema } from '@utils/validation';

describe('signUpSchema', () => {
  it('accepts a valid sign up', () => {
    expect(signUpSchema.safeParse({ name: 'Alex', email: 'alex@example.com', password: 'Password1' }).success).toBe(true);
  });
  it('rejects a short password', () => {
    expect(signUpSchema.safeParse({ name: 'Alex', email: 'alex@example.com', password: 'short' }).success).toBe(false);
  });
  it('rejects a password with no number', () => {
    expect(signUpSchema.safeParse({ name: 'Alex', email: 'alex@example.com', password: 'PasswordOnly' }).success).toBe(false);
  });
  it('rejects an invalid email', () => {
    expect(signUpSchema.safeParse({ name: 'Alex', email: 'not-an-email', password: 'Password1' }).success).toBe(false);
  });
  it('rejects a missing name', () => {
    expect(signUpSchema.safeParse({ name: '', email: 'alex@example.com', password: 'Password1' }).success).toBe(false);
  });
});

describe('signInSchema', () => {
  it('accepts valid credentials', () => {
    expect(signInSchema.safeParse({ email: 'alex@example.com', password: 'anything' }).success).toBe(true);
  });
  it('rejects an empty email', () => {
    expect(signInSchema.safeParse({ email: '', password: 'anything' }).success).toBe(false);
  });
  it('rejects an invalid email', () => {
    expect(signInSchema.safeParse({ email: 'nope', password: 'anything' }).success).toBe(false);
  });
  it('rejects an empty password', () => {
    expect(signInSchema.safeParse({ email: 'alex@example.com', password: '' }).success).toBe(false);
  });
});
