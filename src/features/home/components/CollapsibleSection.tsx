/**
 * CollapsibleSection — a section header (title + chevron, optional trailing
 * action) over collapsible content. Tapping the title row animates the content
 * open/closed. Used to make Home sections collapsible + reorderable.
 */

import React from 'react';
import { LayoutAnimation, Platform, Pressable, StyleSheet, UIManager, View } from 'react-native';
import { ChevronDown } from 'lucide-react-native';

import { Text } from '@components/index';
import { colors, palette } from '@theme/index';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export interface CollapsibleSectionProps {
  title: string;
  collapsed: boolean;
  onToggle: () => void;
  actionLabel?: string;
  onAction?: () => void;
  children: React.ReactNode;
}

export function CollapsibleSection({ title, collapsed, onToggle, actionLabel, onAction, children }: CollapsibleSectionProps) {
  const toggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    onToggle();
  };

  return (
    <View>
      <View style={styles.header}>
        <Pressable accessibilityRole="button" onPress={toggle} hitSlop={6} style={styles.headerLeft}>
          <Text variant="h3" color="strong">
            {title}
          </Text>
          <View style={[styles.chevron, collapsed && styles.chevronCollapsed]}>
            <ChevronDown size={18} color={colors.text.subtle} />
          </View>
        </Pressable>
        {actionLabel && !collapsed ? (
          <Pressable accessibilityRole="button" onPress={onAction} hitSlop={8}>
            <Text variant="label" tint={palette.green[700]}>
              {actionLabel}
            </Text>
          </Pressable>
        ) : null}
      </View>
      {!collapsed ? <View>{children}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  headerLeft: { flexDirection: 'row', alignItems: 'center', columnGap: 6 },
  chevron: { transform: [{ rotate: '0deg' }] },
  chevronCollapsed: { transform: [{ rotate: '-90deg' }] },
});
