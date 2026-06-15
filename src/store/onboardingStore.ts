/**
 * onboardingStore — remembers whether the user has seen the welcome flow.
 * Persisted in AsyncStorage (non-sensitive, so no secure store needed).
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';

const KEY = 'sprout.onboarded';

interface OnboardingState {
  hydrated: boolean;
  hasOnboarded: boolean;
  hydrate: () => Promise<void>;
  complete: () => Promise<void>;
  reset: () => Promise<void>;
}

export const useOnboardingStore = create<OnboardingState>((set) => ({
  hydrated: false,
  hasOnboarded: false,

  hydrate: async () => {
    try {
      const value = await AsyncStorage.getItem(KEY);
      set({ hasOnboarded: value === 'true', hydrated: true });
    } catch {
      set({ hydrated: true });
    }
  },

  complete: async () => {
    set({ hasOnboarded: true });
    await AsyncStorage.setItem(KEY, 'true');
  },

  reset: async () => {
    set({ hasOnboarded: false });
    await AsyncStorage.removeItem(KEY);
  },
}));
