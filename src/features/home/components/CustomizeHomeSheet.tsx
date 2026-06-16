/**
 * CustomizeHomeSheet — a bottom sheet to reorder (move up/down) and show/hide
 * the Home dashboard sections. Saved per device via useHomeLayout.
 */

import React from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowDown, ArrowUp, X } from 'lucide-react-native';

import { Button, IconButton, Switch, Text } from '@components/index';
import { colors, gutter, palette, radii, spacing } from '@theme/index';
import { HOME_SECTIONS, HomeSectionKey, useHomeLayout } from '../hooks/useHomeLayout';

export interface CustomizeHomeSheetProps {
  visible: boolean;
  onClose: () => void;
}

const titleFor = (key: HomeSectionKey) => HOME_SECTIONS.find((s) => s.key === key)?.title ?? key;

export function CustomizeHomeSheet({ visible, onClose }: CustomizeHomeSheetProps) {
  const insets = useSafeAreaInsets();
  const order = useHomeLayout((s) => s.order);
  const hidden = useHomeLayout((s) => s.hidden);
  const move = useHomeLayout((s) => s.move);
  const toggleHidden = useHomeLayout((s) => s.toggleHidden);
  const reset = useHomeLayout((s) => s.reset);

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} accessibilityLabel="Close" />
        <View style={[styles.sheet, { paddingBottom: insets.bottom + 16 }]}>
          <View style={styles.handle} />
          <View style={styles.headerRow}>
            <Text variant="h2" color="strong">
              Customize Home
            </Text>
            <IconButton accessibilityLabel="Close" variant="ghost" onPress={onClose}>
              <X size={20} color={colors.text.body} />
            </IconButton>
          </View>
          <Text variant="bodySmall" color="muted" style={styles.subtitle}>
            Reorder or hide sections. Your layout is saved on this device.
          </Text>

          <View style={styles.list}>
            {order.map((key, i) => (
              <View key={key} style={styles.row}>
                <Text variant="title" color={hidden[key] ? 'muted' : 'strong'} style={styles.flex}>
                  {titleFor(key)}
                </Text>
                <Pressable
                  accessibilityLabel={`Move ${titleFor(key)} up`}
                  disabled={i === 0}
                  onPress={() => move(key, 'up')}
                  hitSlop={6}
                  style={styles.arrow}
                >
                  <ArrowUp size={18} color={i === 0 ? colors.text.subtle : colors.text.body} />
                </Pressable>
                <Pressable
                  accessibilityLabel={`Move ${titleFor(key)} down`}
                  disabled={i === order.length - 1}
                  onPress={() => move(key, 'down')}
                  hitSlop={6}
                  style={styles.arrow}
                >
                  <ArrowDown size={18} color={i === order.length - 1 ? colors.text.subtle : colors.text.body} />
                </Pressable>
                <Switch value={!hidden[key]} onValueChange={() => toggleHidden(key)} />
              </View>
            ))}
          </View>

          <Button label="Reset to default" variant="ghost" fullWidth onPress={reset} />
          <Button label="Done" fullWidth onPress={onClose} style={styles.done} />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'flex-end' },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(42,32,23,0.4)' },
  sheet: {
    backgroundColor: colors.surface.card,
    borderTopLeftRadius: radii.xl,
    borderTopRightRadius: radii.xl,
    paddingHorizontal: gutter,
    paddingTop: 10,
  },
  handle: { alignSelf: 'center', width: 40, height: 4, borderRadius: 2, backgroundColor: palette.neutral[300], marginBottom: spacing.base },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  subtitle: { marginTop: 4 },
  list: { marginTop: spacing.base, marginBottom: spacing.base },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.soft,
  },
  flex: { flex: 1 },
  arrow: { padding: 4 },
  done: { marginTop: 8 },
});
