/**
 * AppNavigator — the signed-in experience: a frosted bottom tab bar over the
 * warm page. Home, Garden, and You are built; Water is scaffolded with a
 * friendly "coming soon" state (Phase 2). The Garden tab hosts its own stack
 * (list → detail → create/edit) and hides the tab bar on the sub-screens.
 */

import React from 'react';
import { Platform, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { Home, Sprout, Droplet, User } from 'lucide-react-native';

import { colors, palette } from '@theme/index';
import { AppTabParamList } from '@app-types/navigation';
import { DashboardScreen } from '@screens/home/DashboardScreen';
import { ProfileScreen } from '@screens/profile/ProfileScreen';
import { GardensNavigator } from './GardensNavigator';
import { ComingSoonScreen } from '@screens/ComingSoonScreen';

const Tab = createBottomTabNavigator<AppTabParamList>();

function WaterTab() {
  return (
    <ComingSoonScreen
      icon="💧"
      title="Watering"
      message="A weather-aware watering schedule is on the way — we'll nudge you before the heat of the day."
    />
  );
}

export function AppNavigator() {
  return (
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
        component={DashboardScreen}
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
        component={WaterTab}
        options={{
          tabBarIcon: ({ color, focused }) => <Droplet size={23} color={color} strokeWidth={focused ? 2.4 : 2} />,
        }}
      />
      <Tab.Screen
        name="You"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, focused }) => <User size={23} color={color} strokeWidth={focused ? 2.4 : 2} />,
        }}
      />
    </Tab.Navigator>
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
