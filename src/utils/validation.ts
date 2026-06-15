/**
 * Zod schemas for the auth forms. Used with react-hook-form via
 * @hookform/resolvers/zod. Error copy stays in Sprout's gentle voice.
 */

import { z } from 'zod';

export const signInSchema = z.object({
  email: z.string().min(1, 'Enter your email').email('That email looks off'),
  password: z.string().min(1, 'Enter your password'),
});

export const signUpSchema = z.object({
  name: z.string().min(2, 'Tell us your name'),
  email: z.string().min(1, 'Enter your email').email('That email looks off'),
  password: z
    .string()
    .min(8, 'Use at least 8 characters')
    .regex(/[a-zA-Z]/, 'Include a letter')
    .regex(/[0-9]/, 'Include a number'),
});

export const forgotPasswordSchema = z.object({
  email: z.string().min(1, 'Enter your email').email('That email looks off'),
});

export type SignInValues = z.infer<typeof signInSchema>;
export type SignUpValues = z.infer<typeof signUpSchema>;
export type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;
