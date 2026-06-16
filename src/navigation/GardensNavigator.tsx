/**
 * GardensNavigator — the Garden tab's internal stack: list → detail, with
 * create / edit pushed over the top (slide up). Headerless; each screen draws
 * its own top bar. Hosted inside the bottom-tab "Garden" route.
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { colors } from '@theme/index';
import { GardensStackParamList } from '@app-types/navigation';
import { GardensScreen } from '@features/gardens/screens/GardensScreen';
import { GardenDetailScreen } from '@features/gardens/screens/GardenDetailScreen';
import { CreateGardenScreen } from '@features/gardens/screens/CreateGardenScreen';
import { EditGardenScreen } from '@features/gardens/screens/EditGardenScreen';
import { AddPlantScreen } from '@features/plants/screens/AddPlantScreen';
import { PlantDetailScreen } from '@features/plants/screens/PlantDetailScreen';
import { EditPlantScreen } from '@features/plants/screens/EditPlantScreen';
import { AIPlantScanScreen } from '@features/ai/screens/AIPlantScanScreen';
import { AIPlantResultScreen } from '@features/ai/screens/AIPlantResultScreen';

const Stack = createNativeStackNavigator<GardensStackParamList>();

export function GardensNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.surface.page } }}
    >
      <Stack.Screen name="GardensList" component={GardensScreen} />
      <Stack.Screen name="GardenDetail" component={GardenDetailScreen} />
      <Stack.Screen name="CreateGarden" component={CreateGardenScreen} options={{ animation: 'slide_from_bottom' }} />
      <Stack.Screen name="EditGarden" component={EditGardenScreen} options={{ animation: 'slide_from_bottom' }} />
      <Stack.Screen name="AddPlant" component={AddPlantScreen} options={{ animation: 'slide_from_bottom' }} />
      <Stack.Screen name="PlantDetail" component={PlantDetailScreen} />
      <Stack.Screen name="EditPlant" component={EditPlantScreen} options={{ animation: 'slide_from_bottom' }} />
      <Stack.Screen name="AIPlantScan" component={AIPlantScanScreen} options={{ animation: 'slide_from_bottom' }} />
      <Stack.Screen name="AIPlantResult" component={AIPlantResultScreen} />
    </Stack.Navigator>
  );
}
