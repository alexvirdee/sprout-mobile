/**
 * RootNavigator — decides which world the user is in:
 *   loading        → Splash (token check / font warm-up)
 *   not onboarded  → Onboarding
 *   not signed in  → Auth stack
 *   signed in      → App (tabs)
 *
 * Kicking off bootstrap (session restore) and onboarding hydration happens here.
 */

import React, { useEffect } from 'react';
import { DefaultTheme, NavigationContainer, Theme as NavTheme } from '@react-navigation/native';

import { colors, palette } from '@theme/index';
import { useAuthStore } from '@store/authStore';
import { useOnboardingStore } from '@store/onboardingStore';
import { SplashScreen } from '@screens/SplashScreen';
import { OnboardingScreen } from '@screens/onboarding/OnboardingScreen';
import { AuthNavigator } from './AuthNavigator';
import { AppNavigator } from './AppNavigator';

const navTheme: NavTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.surface.page,
    card: colors.surface.card,
    text: colors.text.strong,
    primary: palette.green[600],
    border: colors.border.soft,
    notification: palette.terra[400],
  },
};

export function RootNavigator() {
  const status = useAuthStore((s) => s.status);
  const bootstrap = useAuthStore((s) => s.bootstrap);

  const onboardingHydrated = useOnboardingStore((s) => s.hydrated);
  const hasOnboarded = useOnboardingStore((s) => s.hasOnboarded);
  const hydrateOnboarding = useOnboardingStore((s) => s.hydrate);

  useEffect(() => {
    void hydrateOnboarding();
    void bootstrap();
  }, [hydrateOnboarding, bootstrap]);

  const booting = status === 'loading' || !onboardingHydrated;

  return (
    <NavigationContainer theme={navTheme}>
      {booting ? (
        <SplashScreen />
      ) : !hasOnboarded ? (
        <OnboardingScreen />
      ) : status !== 'authenticated' ? (
        <AuthNavigator />
      ) : (
        <AppNavigator />
      )}
    </NavigationContainer>
  );
}
