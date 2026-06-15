/**
 * App — composition root. Providers, in order:
 *   GestureHandlerRootView → SafeAreaProvider → QueryClientProvider →
 *   ThemeProvider (loads fonts, holds splash) → RootNavigator.
 */

import 'react-native-gesture-handler';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClientProvider } from '@tanstack/react-query';

import { ThemeProvider } from '@theme/index';
import { queryClient } from '@services/queryClient';
import { RootNavigator } from '@navigation/RootNavigator';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            <RootNavigator />
          </ThemeProvider>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
