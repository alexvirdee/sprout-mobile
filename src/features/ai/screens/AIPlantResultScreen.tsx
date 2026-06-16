/**
 * AIPlantResultScreen — review + confirm an AI identification, then add it to a
 * garden. Shows the photo + honest headline + confidence + possible matches +
 * care summary, then reuses the existing plant form sections (prefilled) for
 * light editing, and the existing Plants API to create the plant.
 *
 * The scan result lives in this screen's state. Tapping "Create Garden" pushes
 * the create flow over this screen; backing out returns here with the result
 * intact (after creating, the gardens list refetches so the new garden appears
 * if you return). Preserving across a full create→list navigation is left simple
 * for V1.
 */

import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft } from 'lucide-react-native';

import { Button, IconButton, KeyboardAwareScreen, SectionHeader, Text } from '@components/index';
import { colors, gutter, spacing } from '@theme/index';
import { GardensStackScreenProps } from '@app-types/navigation';
import { useGardens } from '@features/gardens/hooks/useGardens';
import { emptyPlantForm, plantFormSchema, PlantFormValues, toPayload } from '@features/plants/plant.schema';
import { PlantBasicsFields, PlantCareFields } from '@features/plants/components/PlantForm';
import { useCreatePlant } from '@features/plants/hooks/useCreatePlant';
import { PlantPayload } from '@features/plants/types/plant.types';
import {
  AIPlantDisclaimer,
  GardenSelectionCard,
  PlantIdentificationCard,
  PossibleMatchesList,
} from '../components';
import { PlantMatch } from '../types/ai.types';

export function AIPlantResultScreen({ navigation, route }: GardensStackScreenProps<'AIPlantResult'>) {
  const { imageUri, result } = route.params;
  const insets = useSafeAreaInsets();
  const create = useCreatePlant();
  const gardensQuery = useGardens();
  const gardens = gardensQuery.data ?? [];

  const [scientificName, setScientificName] = useState<string | null>(result.scientificName);

  const { control, handleSubmit, setValue, watch } = useForm<PlantFormValues>({
    resolver: zodResolver(plantFormSchema),
    defaultValues: {
      ...emptyPlantForm(''),
      name: result.commonName ?? '',
      type: result.plantType,
      sunPreference: result.careSummary.sunPreference,
      wateringPreference: result.careSummary.wateringPreference,
      notes: result.careSummary.notes,
    },
    mode: 'onTouched',
  });

  const gardenId = watch('gardenId');
  const nameValue = watch('name');

  const onSelectMatch = (m: PlantMatch) => {
    setValue('name', m.commonName, { shouldValidate: true });
    setScientificName(m.scientificName);
  };

  const onSubmit = (values: PlantFormValues) => {
    const payload: PlantPayload = {
      ...toPayload(values),
      source: 'ai_scan',
      aiIdentified: true,
      identificationConfidence: result.confidence,
      ...(scientificName ? { scientificName } : {}),
      aiIdentificationData: result as unknown as Record<string, unknown>,
    };
    create.mutate(payload, {
      onSuccess: () => navigation.navigate('GardenDetail', { id: values.gardenId, flash: 'Added to your garden 🌱' }),
    });
  };

  const header = (
    <View style={styles.topbar}>
      <IconButton accessibilityLabel="Back" variant="ghost" onPress={() => navigation.goBack()}>
        <ArrowLeft size={24} color={colors.text.strong} />
      </IconButton>
      <Text variant="h3" color="strong" style={styles.title}>
        Review plant
      </Text>
      <View style={styles.spacer} />
    </View>
  );

  const footer = (
    <View style={[styles.footer, { paddingBottom: insets.bottom + 12 }]}>
      <View style={styles.flex}>
        <Button label="Retake" variant="ghost" fullWidth onPress={() => navigation.goBack()} />
      </View>
      <View style={styles.flex2}>
        <Button
          label="Add to Garden"
          fullWidth
          loading={create.isPending}
          disabled={!gardenId}
          onPress={handleSubmit(onSubmit)}
        />
      </View>
    </View>
  );

  return (
    <KeyboardAwareScreen header={header} footer={footer} contentContainerStyle={styles.content}>
      <StatusBar style="dark" />

      <PlantIdentificationCard result={result} imageUri={imageUri} />

      <View style={styles.section}>
        <PossibleMatchesList matches={result.possibleMatches} selectedName={nameValue} onSelect={onSelectMatch} />
      </View>

      <View style={styles.section}>
        <SectionHeader title="Plant details" />
        <View style={styles.fields}>
          <PlantBasicsFields control={control} />
          <PlantCareFields control={control} />
        </View>
      </View>

      <View style={styles.section}>
        <SectionHeader title="Add to garden" />
        <GardenSelectionCard
          gardens={gardens}
          selectedId={gardenId}
          loading={gardensQuery.isLoading}
          onSelect={(id) => setValue('gardenId', id, { shouldValidate: true })}
          onCreateGarden={() => navigation.navigate('CreateGarden')}
        />
      </View>

      {create.isError ? (
        <Text variant="bodySmall" color="danger" style={styles.err}>
          We couldn’t add your plant just now. Please try again.
        </Text>
      ) : null}

      <View style={styles.disclaimer}>
        <AIPlantDisclaimer text={result.disclaimer} />
      </View>
    </KeyboardAwareScreen>
  );
}

const styles = StyleSheet.create({
  content: { paddingTop: spacing.base, paddingBottom: spacing['3xl'] },
  topbar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: gutter - 8,
    paddingTop: 6,
    paddingBottom: 4,
  },
  title: { flex: 1, textAlign: 'center' },
  spacer: { width: 40 },
  flex: { flex: 1 },
  flex2: { flex: 2 },
  section: { marginTop: spacing.xl },
  fields: { rowGap: spacing.lg },
  err: { marginTop: spacing.base },
  disclaimer: { marginTop: spacing.lg },
  footer: {
    flexDirection: 'row',
    columnGap: 12,
    paddingHorizontal: gutter,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border.soft,
    backgroundColor: colors.surface.card,
  },
});
