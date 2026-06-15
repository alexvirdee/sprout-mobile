/**
 * KeyboardAwareScreen — the one keyboard-safe form scaffold for the whole app.
 *
 * The correct nesting that fixes the iOS flicker / keyboard bounce:
 *   SafeAreaView → KeyboardAvoidingView → [header] ScrollView [footer]
 * KeyboardAvoidingView WRAPS the ScrollView (never the other way around), and
 * the ScrollView keeps taps alive so the first tap focuses an input instead of
 * dismissing the keyboard.
 *
 *  - `header`  : fixed content above the scroll (e.g. a top bar / progress dots)
 *  - `footer`  : fixed content below the scroll; lifts with the keyboard
 *  - `children`: the scrollable form body
 */

import React from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, ViewStyle } from 'react-native';
import { SafeAreaView, Edge } from 'react-native-safe-area-context';

import { colors, gutter } from '@theme/index';

export interface KeyboardAwareScreenProps {
  children: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  /** Apply the default horizontal screen gutter to the scroll content. */
  padded?: boolean;
  edges?: Edge[];
  background?: string;
  contentContainerStyle?: ViewStyle;
  /** Extra offset (e.g. a header height) for KeyboardAvoidingView on iOS. */
  keyboardOffset?: number;
}

export function KeyboardAwareScreen({
  children,
  header,
  footer,
  padded = true,
  edges = ['top', 'left', 'right'],
  background = colors.surface.page,
  contentContainerStyle,
  keyboardOffset = 0,
}: KeyboardAwareScreenProps) {
  return (
    <SafeAreaView style={[styles.flex, { backgroundColor: background }]} edges={edges}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={keyboardOffset}
      >
        {header}
        <ScrollView
          style={styles.flex}
          contentContainerStyle={[styles.grow, padded && styles.padded, contentContainerStyle]}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive"
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
        {footer}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  grow: { flexGrow: 1 },
  padded: { paddingHorizontal: gutter },
});
