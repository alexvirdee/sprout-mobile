/**
 * AddJournalEntryScreen — log a harvest, note, or milestone. Harvests can carry
 * a quantity + unit + a 1-5 rating; any entry can have one photo. Reached from
 * the journal's "+", a garden/plant journal section, or after completing a
 * harvesting care task (prefilled).
 */

import React, { useState } from 'react';
import { ActivityIndicator, Alert, Image, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import * as ImagePicker from 'expo-image-picker';
import { ArrowLeft, ImagePlus, Star, X } from 'lucide-react-native';

import { AppTextInput, Button, Emoji, IconButton, KeyboardAwareScreen, SegmentedControl, Text } from '@components/index';
import { colors, gutter, palette, radii, spacing } from '@theme/index';
import { GardensStackScreenProps } from '@app-types/navigation';
import { useCreateJournalEntry, useUploadJournalPhoto } from '../hooks/useJournalActions';
import { JOURNAL_UNIT_OPTIONS } from '../utils/journalLabels';
import { JournalEntryType, JournalUnit } from '../types/journal.types';

const TYPE_OPTIONS: { value: JournalEntryType; label: string }[] = [
  { value: 'harvest', label: '🧺 Harvest' },
  { value: 'note', label: '📝 Note' },
  { value: 'milestone', label: '🌟 Milestone' },
];

export function AddJournalEntryScreen({ navigation, route }: GardensStackScreenProps<'AddJournalEntry'>) {
  const { gardenId, plantId, careTaskId, prefillTitle } = route.params;
  const insets = useSafeAreaInsets();
  const create = useCreateJournalEntry();
  const uploadPhoto = useUploadJournalPhoto();

  const [type, setType] = useState<JournalEntryType>(route.params.type ?? 'harvest');
  const [title, setTitle] = useState(prefillTitle ?? '');
  const [note, setNote] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState<JournalUnit>('count');
  const [rating, setRating] = useState(0);
  const [photoUri, setPhotoUri] = useState<string | null>(null);

  const saving = create.isPending || uploadPhoto.isPending;
  const isHarvest = type === 'harvest';

  const addPhoto = () => {
    Alert.alert('Add a photo', undefined, [
      { text: 'Take photo', onPress: () => pick('camera') },
      { text: 'Choose from library', onPress: () => pick('library') },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const pick = async (source: 'camera' | 'library') => {
    const perm =
      source === 'camera'
        ? await ImagePicker.requestCameraPermissionsAsync()
        : await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert('Permission needed', 'Allow photo access to add a photo to your entry.');
      return;
    }
    const res =
      source === 'camera'
        ? await ImagePicker.launchCameraAsync({ mediaTypes: ['images'], allowsEditing: true, quality: 0.6 })
        : await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], allowsEditing: true, quality: 0.6 });
    if (!res.canceled && res.assets[0]) setPhotoUri(res.assets[0].uri);
  };

  const onSave = () => {
    const qtyNum = quantity.trim() ? Number(quantity) : undefined;
    const payload = {
      gardenId,
      ...(plantId ? { plantId } : {}),
      ...(careTaskId ? { careTaskId } : {}),
      type,
      ...(title.trim() ? { title: title.trim() } : {}),
      ...(note.trim() ? { note: note.trim() } : {}),
      ...(isHarvest && qtyNum != null && Number.isFinite(qtyNum) ? { quantity: qtyNum, unit } : {}),
      ...(isHarvest && rating > 0 ? { rating } : {}),
    };
    create.mutate(payload, {
      onSuccess: (entry) => {
        if (photoUri) {
          uploadPhoto.mutate(
            { id: entry.id, uri: photoUri },
            { onSuccess: () => navigation.goBack(), onError: () => navigation.goBack() }
          );
        } else {
          navigation.goBack();
        }
      },
    });
  };

  // A harvest is meaningful with a quantity, a note, or a photo; other types need a note or title.
  const canSave = isHarvest
    ? Boolean(quantity.trim() || note.trim() || photoUri)
    : Boolean(note.trim() || title.trim());

  const header = (
    <View style={styles.topBar}>
      <IconButton accessibilityLabel="Go back" variant="ghost" onPress={() => navigation.goBack()}>
        <ArrowLeft size={22} color={colors.text.body} />
      </IconButton>
      <Text variant="h2" color="strong">
        New entry
      </Text>
      <View style={styles.spacer} />
    </View>
  );

  const footer = (
    <View style={[styles.footer, { paddingBottom: insets.bottom + 12 }]}>
      <Button label="Save entry" fullWidth loading={saving} disabled={!canSave} onPress={onSave} />
    </View>
  );

  return (
    <KeyboardAwareScreen header={header} footer={footer} contentContainerStyle={styles.body}>
      <StatusBar style="dark" />

      <SegmentedControl options={TYPE_OPTIONS} value={type} onChange={(v) => setType(v as JournalEntryType)} />

      {isHarvest ? (
        <View style={styles.section}>
          <Text variant="label" color="strong">
            How much did you harvest?
          </Text>
          <AppTextInput
            value={quantity}
            onChangeText={setQuantity}
            placeholder="Amount"
            keyboardType="decimal-pad"
          />
          <View style={styles.chips}>
            {JOURNAL_UNIT_OPTIONS.map((u) => {
              const active = u.value === unit;
              return (
                <Pressable
                  key={u.value}
                  accessibilityRole="button"
                  accessibilityState={{ selected: active }}
                  onPress={() => setUnit(u.value)}
                  style={[styles.chip, active && styles.chipActive]}
                >
                  <Text variant="caption" color={active ? 'inverse' : 'body'}>
                    {u.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <Text variant="label" color="strong" style={styles.ratingLabel}>
            How was it?
          </Text>
          <View style={styles.stars}>
            {[1, 2, 3, 4, 5].map((i) => (
              <Pressable
                key={i}
                accessibilityRole="button"
                accessibilityLabel={`${i} star${i === 1 ? '' : 's'}`}
                onPress={() => setRating(rating === i ? 0 : i)}
                hitSlop={6}
              >
                <Star
                  size={28}
                  color={palette.gold[500]}
                  fill={i <= rating ? palette.gold[500] : 'transparent'}
                />
              </Pressable>
            ))}
          </View>
        </View>
      ) : null}

      <View style={styles.section}>
        <AppTextInput
          label={isHarvest ? 'Title (optional)' : 'Title'}
          value={title}
          onChangeText={setTitle}
          placeholder={type === 'milestone' ? 'First bloom!' : 'A short headline'}
        />
        <AppTextInput
          label="Notes"
          value={note}
          onChangeText={setNote}
          placeholder={
            isHarvest ? 'Anything to remember about this harvest?' : 'What happened in your garden?'
          }
          multiline
        />
      </View>

      <View style={styles.section}>
        <Text variant="label" color="strong">
          Photo (optional)
        </Text>
        {photoUri ? (
          <View style={styles.photoWrap}>
            <Image source={{ uri: photoUri }} style={styles.photo} resizeMode="cover" />
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Remove photo"
              onPress={() => setPhotoUri(null)}
              style={styles.removePhoto}
            >
              <X size={16} color="#fff" />
            </Pressable>
          </View>
        ) : (
          <Pressable accessibilityRole="button" accessibilityLabel="Add a photo" onPress={addPhoto} style={styles.addPhoto}>
            {uploadPhoto.isPending ? (
              <ActivityIndicator color={palette.green[700]} />
            ) : (
              <>
                <ImagePlus size={22} color={palette.green[700]} />
                <Text variant="body" color="body">
                  Add a photo
                </Text>
              </>
            )}
          </Pressable>
        )}
      </View>

      {create.isError ? (
        <Text variant="bodySmall" color="danger" style={styles.err}>
          We couldn’t save your entry just now. Please try again.
        </Text>
      ) : null}
    </KeyboardAwareScreen>
  );
}

const styles = StyleSheet.create({
  body: { paddingHorizontal: gutter, paddingTop: spacing.sm, paddingBottom: spacing['3xl'], rowGap: spacing.lg },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    columnGap: 8,
    paddingHorizontal: gutter - 4,
    paddingTop: 6,
    paddingBottom: 4,
  },
  spacer: { width: 42 },
  section: { rowGap: spacing.sm },
  footer: {
    paddingHorizontal: gutter,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border.soft,
    backgroundColor: colors.surface.card,
  },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: radii.pill,
    borderWidth: 1.5,
    borderColor: colors.border.default,
    backgroundColor: colors.surface.card,
  },
  chipActive: { backgroundColor: palette.green[500], borderColor: palette.green[500] },
  ratingLabel: { marginTop: spacing.xs },
  stars: { flexDirection: 'row', columnGap: 10 },
  photoWrap: { position: 'relative' },
  photo: { width: '100%', height: 200, borderRadius: radii.lg, backgroundColor: colors.surface.sunken },
  removePhoto: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(0,0,0,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addPhoto: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    columnGap: 8,
    height: 96,
    borderRadius: radii.lg,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: palette.green[200],
    backgroundColor: palette.green[50],
  },
  err: {},
});
