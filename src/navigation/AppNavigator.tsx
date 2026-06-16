/**
 * AppNavigator — the signed-in experience: a frosted bottom tab bar over the
 * warm page. Home, Garden, Water, and You are all built. The Garden and Water
 * tabs each host their own stack and hide the tab bar on their sub-screens.
 * A headless WateringReminderManager keeps the daily reminder in sync.
 */

import React from 'react';
import { Platform, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { Home, Sprout, Droplet, User } from 'lucide-react-native';

import { colors, palette } from '@theme/index';
import { AppTabParamList } from '@app-types/navigation';
import { HomeScreen } from '@features/home/screens/HomeScreen';
import { GardensNavigator } from './GardensNavigator';
import { WateringNavigator } from './WateringNavigator';
import { ProfileNavigator } from './ProfileNavigator';
import { WateringReminderManager } from '@features/watering/components/WateringReminderManager';
import { CareReminderManager } from '@features/care/components/CareReminderManager';

const Tab = createBottomTabNavigator<AppTabParamList>();

export function AppNavigator() {
  return (
    <>
      <WateringReminderManager />
      <CareReminderManager />
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: palette.green[700],
          tabBarInactiveTintColor: colors.text.subtle,
          tabBarStyle: styles.tabBar,
          tabBarLabelStyle: styles.tabLabel,
          tabBarItemStyle: styles.tabItem,
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            tabBarIcon: ({ color, focused }) => <Home size={23} color={color} strokeWidth={focused ? 2.4 : 2} />,
          }}
        />
        <Tab.Screen
          name="Garden"
          component={GardensNavigator}
          options={({ route }) => {
            const focusedRoute = getFocusedRouteNameFromRoute(route) ?? 'GardensList';
            return {
              tabBarIcon: ({ color, focused }) => <Sprout size={23} color={color} strokeWidth={focused ? 2.4 : 2} />,
              tabBarStyle: focusedRoute === 'GardensList' ? styles.tabBar : { display: 'none' },
            };
          }}
        />
        <Tab.Screen
          name="Water"
          component={WateringNavigator}
          options={({ route }) => {
            const focusedRoute = getFocusedRouteNameFromRoute(route) ?? 'WateringHome';
            return {
              tabBarIcon: ({ color, focused }) => <Droplet size={23} color={color} strokeWidth={focused ? 2.4 : 2} />,
              tabBarStyle: focusedRoute === 'WateringHome' ? styles.tabBar : { display: 'none' },
            };
          }}
        />
        <Tab.Screen
          name="You"
          component={ProfileNavigator}
          options={({ route }) => {
            const focusedRoute = getFocusedRouteNameFromRoute(route) ?? 'ProfileHome';
            return {
              tabBarIcon: ({ color, focused }) => <User size={23} color={color} strokeWidth={focused ? 2.4 : 2} />,
              tabBarStyle: focusedRoute === 'ProfileHome' ? styles.tabBar : { display: 'none' },
            };
          }}
        />
      </Tab.Navigator>
    </>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    backgroundColor: 'rgba(255,255,255,0.94)',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border.soft,
    height: Platform.OS === 'ios' ? 84 : 68,
    paddingTop: 8,
    paddingBottom: Platform.OS === 'ios' ? 28 : 12,
  },
  tabItem: { paddingTop: 2 },
  tabLabel: {
    fontFamily: 'Outfit_600SemiBold',
    fontSize: 11,
    marginTop: 2,
  },
});
