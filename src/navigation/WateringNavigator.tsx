/**
 * WateringNavigator — the Water tab's internal stack: the dashboard (home) →
 * history, with the per-garden log screen pushed over the top (slide up).
 * Headerless; each screen draws its own top bar.
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { colors } from '@theme/index';
import { WateringStackParamList } from '@app-types/navigation';
import { WateringScreen } from '@features/watering/screens/WateringScreen';
import { WateringHistoryScreen } from '@features/watering/screens/WateringHistoryScreen';
import { LogWateringScreen } from '@features/watering/screens/LogWateringScreen';

const Stack = createNativeStackNavigator<WateringStackParamList>();

export function WateringNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.surface.page } }}
    >
      <Stack.Screen name="WateringHome" component={WateringScreen} />
      <Stack.Screen name="WateringHistory" component={WateringHistoryScreen} />
      <Stack.Screen name="LogWatering" component={LogWateringScreen} options={{ animation: 'slide_from_bottom' }} />
    </Stack.Navigator>
  );
}
