/**
 * ProfileNavigator — the You tab's internal stack: the account center (home) →
 * edit profile, achievements, preferences, about. Headerless; each screen draws
 * its own top bar. Sub-screens slide up over the dashboard.
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { colors } from '@theme/index';
import { ProfileStackParamList } from '@app-types/navigation';
import { ProfileScreen } from '@features/profile/screens/ProfileScreen';
import { EditProfileScreen } from '@features/profile/screens/EditProfileScreen';
import { AchievementsScreen } from '@features/profile/screens/AchievementsScreen';
import { PreferencesScreen } from '@features/profile/screens/PreferencesScreen';
import { AboutScreen } from '@features/profile/screens/AboutScreen';

const Stack = createNativeStackNavigator<ProfileStackParamList>();

export function ProfileNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="ProfileHome"
      screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.surface.page } }}
    >
      <Stack.Screen name="ProfileHome" component={ProfileScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} options={{ animation: 'slide_from_bottom' }} />
      <Stack.Screen name="Achievements" component={AchievementsScreen} />
      <Stack.Screen name="Preferences" component={PreferencesScreen} />
      <Stack.Screen name="About" component={AboutScreen} />
    </Stack.Navigator>
  );
}
