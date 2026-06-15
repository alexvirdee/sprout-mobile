/**
 * QuickAddPlantModal — the 60-second fast path: a name + garden is all it takes.
 * "Add more details" hands off to the full stepped flow with the name carried.
 */

import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Pressable, StyleSheet, View } from 'react-native';

import { AppTextInput, Button, Text } from '@components/index';
import { colors, radii, spacing } from '@theme/index';
import { useCreatePlant } from '../hooks/useCreatePlant';
import { todayISODate } from '../utils/plantDates';

export interface QuickAddPlantModalProps {
  visible: boolean;
  gardenId: string;
  gardenName: string;
  onClose: () => void;
  onAdded: () => void;
  onAddDetails: (name: string) => void;
}

export function QuickAddPlantModal({ visible, gardenId, gardenName, onClose, onAdded, onAddDetails }: QuickAddPlantModalProps) {
  const [name, setName] = useState('');
  const create = useCreatePlant();

  if (!visible) return null;

  const submit = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    create.mutate(
      {
        gardenId,
        name: trimmed,
        type: 'other',
        source: 'unknown',
        sunPreference: 'not_sure',
        wateringPreference: 'not_sure',
        plantedDate: todayISODate(),
      },
      {
        onSuccess: () => {
          setName('');
          onAdded();
        },
        onError: () => Alert.alert('Hmm', 'We could not add that plant just now. Please try again.'),
      },
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.overlay}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Pressable style={styles.backdrop} onPress={onClose} accessibilityLabel="Close" />
      <View style={styles.sheet}>
        <View style={styles.handle} />
        <Text variant="h3" color="strong">Quick add a plant</Text>
        <Text variant="caption" color="muted" style={styles.sub}>Adding to {gardenName}</Text>

        <AppTextInput
          label="Plant name"
          placeholder="Tomato · Basil · Rosemary"
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
          autoFocus
          returnKeyType="done"
          onSubmitEditing={submit}
          containerStyle={styles.input}
        />

        <Button label="Add plant 🌱" fullWidth loading={create.isPending} onPress={submit} />
        <Button label="Add more details" variant="ghost" fullWidth onPress={() => onAddDetails(name.trim())} />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  overlay: { ...StyleSheet.absoluteFillObject, justifyContent: 'flex-end' },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(42,32,23,0.35)' },
  sheet: {
    backgroundColor: colors.surface.card,
    borderTopLeftRadius: radii.xl,
    borderTopRightRadius: radii.xl,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing['3xl'],
    rowGap: spacing.sm,
  },
  handle: { alignSelf: 'center', width: 40, height: 5, borderRadius: 3, backgroundColor: colors.border.default, marginBottom: spacing.sm },
  sub: { marginBottom: spacing.xs },
  input: { marginBottom: spacing.sm },
});
