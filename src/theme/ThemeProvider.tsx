/**
 * ThemeProvider — loads the brand webfonts, holds the splash screen until they
 * are ready, and exposes the theme via context. Most components can import
 * `theme` directly, but `useTheme()` is provided for parity and future theming
 * (e.g. a dark "evening garden" mode).
 */

import React, { createContext, useContext, useCallback } from 'react';
import { useColorScheme, View } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import {
  useFonts as useOutfit,
  Outfit_300Light,
  Outfit_400Regular,
  Outfit_500Medium,
  Outfit_600SemiBold,
  Outfit_700Bold,
  Outfit_800ExtraBold,
} from '@expo-google-fonts/outfit';
import {
  HankenGrotesk_400Regular,
  HankenGrotesk_500Medium,
  HankenGrotesk_600SemiBold,
  HankenGrotesk_700Bold,
} from '@expo-google-fonts/hanken-grotesk';
import {
  JetBrainsMono_400Regular,
  JetBrainsMono_500Medium,
} from '@expo-google-fonts/jetbrains-mono';

import { useAuthStore } from '@store/authStore';
import { theme, Theme } from './index';

// Default is filled at module-eval time; to stay safe against the index <-> this
// circular import, we seed with an empty object and always supply the real theme
// via the Provider below (so the default is never actually used in-app).
const ThemeContext = createContext<Theme>({} as Theme);

export const useTheme = (): Theme => useContext(ThemeContext);

export type ColorScheme = 'light' | 'dark';

/**
 * Resolve a user theme preference + the device scheme into the active scheme.
 * "system" follows the device; otherwise the explicit choice wins.
 */
export function resolveScheme(
  preference: 'light' | 'dark' | 'system' | undefined,
  deviceScheme: ColorScheme | null | undefined
): ColorScheme {
  if (preference === 'light' || preference === 'dark') return preference;
  return deviceScheme ?? 'light';
}

// Keep the native splash visible while we load fonts.
void SplashScreen.preventAutoHideAsync();

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [fontsLoaded, fontError] = useOutfit({
    Outfit_300Light,
    Outfit_400Regular,
    Outfit_500Medium,
    Outfit_600SemiBold,
    Outfit_700Bold,
    Outfit_800ExtraBold,
    HankenGrotesk_400Regular,
    HankenGrotesk_500Medium,
    HankenGrotesk_600SemiBold,
    HankenGrotesk_700Bold,
    JetBrainsMono_400Regular,
    JetBrainsMono_500Medium,
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  // Resolve the active color scheme from the user's saved preference + device.
  // This is the dark-mode *foundation*: the scheme is computed and reacts to
  // changes, but both schemes currently map to the light palette. When a dark
  // palette exists, map `dark` to it below — no other call sites change.
  const themePreference = useAuthStore((s) => s.user?.themePreference);
  const deviceScheme = useColorScheme();
  const scheme = resolveScheme(themePreference, deviceScheme);
  const palettes: Record<ColorScheme, Theme> = { light: theme, dark: theme };
  const activeTheme = palettes[scheme];

  // Render nothing until fonts resolve (success or error) so we never flash
  // the system font. The native splash stays up during this window.
  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <ThemeContext.Provider value={activeTheme}>
      <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
        {children}
      </View>
    </ThemeContext.Provider>
  );
}
