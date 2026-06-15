/**
 * AppNavigator — the signed-in experience: a frosted bottom tab bar over the
 * warm page. Home is fully built; Garden / Water / You are scaffolded with
 * friendly "coming soon" states (Phase 2).
 */

import React from 'react';
import { Platform, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, Sprout, Droplet, User } from 'lucide-react-native';

import { colors, palette } from '@theme/index';
import { AppTabParamList } from '@app-types/navigation';
import { DashboardScreen } from '@screens/home/DashboardScreen';
import { ComingSoonScreen } from '@screens/ComingSoonScreen';

const Tab = createBottomTabNavigator<AppTabParamList>();

function GardenTab() {
  return (
    <ComingSoonScreen
      icon="🪴"
      title="My garden"
      message="Your beds, plant grid, and growth timelines live here. We're tending to it for the next release."
    />
  );
}

function WaterTab() {
  return (
    <ComingSoonScreen
      icon="💧"
      title="Watering"
      message="A weather-aware watering schedule is on the way — we'll nudge you before the heat of the day."
    />
  );
}

function YouTab() {
  return (
    <ComingSoonScreen
      icon="🌻"
      title="You"
      message="Your profile, streaks, and achievement badges will bloom here soon."
      showSignOut
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
        component={GardenTab}
        options={{
          tabBarIcon: ({ color, focused }) => <Sprout size={23} color={color} strokeWidth={focused ? 2.4 : 2} />,
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
        component={YouTab}
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
