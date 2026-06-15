/**
 * Edit-profile form schema. All values are plain strings so react-hook-form's
 * input and output types line up (the app-wide form convention).
 */

import { z } from 'zod';

import { User } from '@app-types/models';

export const profileFormSchema = z.object({
  firstName: z.string().trim().max(50, 'Keep it under 50 characters'),
  lastName: z.string().trim().max(50, 'Keep it under 50 characters'),
  displayName: z.string().trim().min(1, 'Display name is required').max(50, 'Keep it under 50 characters'),
  email: z.string().trim().email('Enter a valid email'),
  location: z.string().trim().max(120, 'Keep it under 120 characters'),
  bio: z.string().trim().max(280, 'Keep it under 280 characters'),
});

export type ProfileFormValues = z.infer<typeof profileFormSchema>;

export function toFormValues(user: User | null): ProfileFormValues {
  return {
    firstName: user?.firstName ?? '',
    lastName: user?.lastName ?? '',
    displayName: user?.displayName ?? user?.name ?? '',
    email: user?.email ?? '',
    location: user?.location ?? '',
    bio: user?.bio ?? '',
  };
}
