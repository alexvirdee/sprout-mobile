/**
 * ScreenContainer — the standard screen wrapper. Handles safe-area insets, the
 * warm page background, optional horizontal gutters, and optional scrolling so
 * screens don't each re-implement this scaffolding.
 */

import React from 'react';
import { ScrollView, StyleSheet, View, ViewStyle } from 'react-native';
import { SafeAreaView, Edge } from 'react-native-safe-area-context';

import { colors, gutter } from '@theme/index';

export interface ScreenContainerProps {
  children: React.ReactNode;
  scroll?: boolean;
  padded?: boolean;
  /** Background color override (defaults to the warm page cream). */
  background?: string;
  edges?: Edge[];
  contentContainerStyle?: ViewStyle;
  style?: ViewStyle;
}

export function ScreenContainer({
  children,
  scroll = false,
  padded = true,
  background = colors.surface.page,
  edges = ['top', 'left', 'right'],
  contentContainerStyle,
  style,
}: ScreenContainerProps) {
  const pad: ViewStyle = padded ? { paddingHorizontal: gutter } : {};

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: background }, style]} edges={edges}>
      {scroll ? (
        <ScrollView
          style={styles.flex}
          contentContainerStyle={[pad, contentContainerStyle]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {children}
        </ScrollView>
      ) : (
        <View style={[styles.flex, pad, contentContainerStyle]}>{children}</View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  flex: { flex: 1 },
});
