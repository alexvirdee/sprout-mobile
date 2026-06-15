/**
 * AddPlantScreen — a calm stepped flow to add a plant. When launched from a
 * garden, the garden is preselected and step 1 is skipped. Otherwise step 1 is a
 * friendly garden chooser (with a "create a garden first" empty state).
 */

import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Check } from 'lucide-react-native';

import { Button, Emoji, IconButton, KeyboardAwareScreen, Skeleton, Text } from '@components/index';
import { colors, palette, radii, spacing, gutter } from '@theme/index';
import { GardensStackScreenProps } from '@app-types/navigation';
import { useGardens } from '@features/gardens/hooks/useGardens';
import { ACCENT_COLORS as GARDEN_ACCENTS, gardenTypeMeta } from '@features/gardens/types/garden.types';
import { emptyPlantForm, plantFormSchema, PlantFormValues, toPayload } from '../plant.schema';
import { PlantBasicsFields, PlantCareFields, PlantPlantingFields } from '../components/PlantForm';
import { PlantReviewCard } from '../components/PlantReviewCard';
import { PlantEmptyState } from '../components/PlantEmptyState';
import { useCreatePlant } from '../hooks/useCreatePlant';

type StepKey = 'garden' | 'basics' | 'planting' | 'care' | 'review';

const TITLES: Record<StepKey, { title: string; sub: string }> = {
  garden: { title: 'Choose a garden', sub: 'Where is this plant growing?' },
  basics: { title: 'Plant basics', sub: 'What are you growing?' },
  planting: { title: 'Planting details', sub: 'A few optional details — you can add more later.' },
  care: { title: 'Care preferences', sub: 'How does this plant like to be cared for?' },
  review: { title: 'Almost planted', sub: 'Review and add your plant.' },
};

const STEP_FIELDS: Record<StepKey, (keyof PlantFormValues)[]> = {
  garden: ['gardenId'],
  basics: ['name', 'variety', 'type'],
  planting: ['plantedDate', 'source', 'locationInGarden'],
  care: ['sunPreference', 'wateringPreference', 'notes'],
  review: [],
};

export function AddPlantScreen({ navigation, route }: GardensStackScreenProps<'AddPlant'>) {
  const insets = useSafeAreaInsets();
  const presetGardenId = route.params?.gardenId;
  const presetName = route.params?.name;

  const create = useCreatePlant();
  const gardensQuery = useGardens();
  const gardens = gardensQuery.data ?? [];

  const steps: StepKey[] = useMemo(
    () => (presetGardenId ? ['basics', 'planting', 'care', 'review'] : ['garden', 'basics', 'planting', 'care', 'review']),
    [presetGardenId]
  );
  const [step, setStep] = useState(0);

  const { control, handleSubmit, trigger, getValues, watch, setValue } = useForm<PlantFormValues>({
    resolver: zodResolver(plantFormSchema),
    defaultValues: { ...emptyPlantForm(presetGardenId ?? ''), name: presetName ?? '' },
    mode: 'onTouched',
  });

  const current = steps[step];
  const isReview = current === 'review';
  const selectedGardenId = watch('gardenId');
  const selectedGarden = gardens.find((g) => g.id === selectedGardenId);
  const noGardens = !gardensQuery.isLoading && gardens.length === 0;

  const goBack = () => (step === 0 ? navigation.goBack() : setStep((s) => s - 1));

  const next = async () => {
    const fields = STEP_FIELDS[current];
    const ok = fields.length ? await trigger(fields) : true;
    if (ok) setStep((s) => Math.min(s + 1, steps.length - 1));
  };

  const onSubmit = (values: PlantFormValues) => {
    create.mutate(toPayload(values), {
      onSuccess: () => navigation.navigate('GardenDetail', { id: values.gardenId, flash: 'Plant added 🌱' }),
    });
  };

  const header = (
    <View style={styles.topbar}>
      <IconButton accessibilityLabel="Back" variant="ghost" onPress={goBack}>
        <ArrowLeft size={24} color={colors.text.strong} />
      </IconButton>
      <View style={styles.dots}>
        {steps.map((_, i) => (
          <View key={i} style={[styles.dot, i === step ? styles.dotActive : i < step ? styles.dotDone : null]} />
        ))}
      </View>
      <View style={styles.spacer} />
    </View>
  );

  const footer =
    current === 'garden' && noGardens ? undefined : (
      <View style={[styles.footer, { paddingBottom: insets.bottom + 12 }]}>
        {step > 0 ? (
          <View style={styles.flex}>
            <Button label="Back" variant="ghost" fullWidth onPress={goBack} />
          </View>
        ) : null}
        <View style={step > 0 ? styles.flex2 : styles.flex}>
          {isReview ? (
            <Button label="Add plant" fullWidth loading={create.isPending} onPress={handleSubmit(onSubmit)} />
          ) : (
            <Button
              label="Continue"
              fullWidth
              onPress={next}
              disabled={current === 'garden' && !selectedGardenId}
            />
          )}
        </View>
      </View>
    );

  return (
    <KeyboardAwareScreen header={header} footer={footer} contentContainerStyle={styles.content}>
      <StatusBar style="dark" />
      <View style={styles.head}>
        <Text variant="eyebrow" tint={palette.green[700]}>Step {step + 1} of {steps.length}</Text>
        <Text variant="display" color="strong" style={styles.title}>{TITLES[current].title}</Text>
        <Text variant="bodyLarge" color="muted">{TITLES[current].sub}</Text>
      </View>

      {current === 'garden' ? (
        gardensQuery.isLoading ? (
          <View style={styles.list}>
            <Skeleton height={64} radius={radii.lg} />
            <Skeleton height={64} radius={radii.lg} />
          </View>
        ) : noGardens ? (
          <PlantEmptyState
            emoji="🏡"
            title="Create a garden first"
            body="Plants live inside gardens. Set up a garden, then start adding what you're growing."
            ctaLabel="Create garden"
            onCta={() => navigation.navigate('CreateGarden')}
          />
        ) : (
          <View style={styles.list}>
            {gardens.map((g) => {
              const meta = gardenTypeMeta(g.type);
              const active = g.id === selectedGardenId;
              return (
                <Pressable
                  key={g.id}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: active }}
                  onPress={() => setValue('gardenId', g.id, { shouldValidate: true })}
                  style={[styles.gardenRow, active && styles.gardenRowActive]}
                >
                  <LinearGradient colors={GARDEN_ACCENTS[meta.accent].grad} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.gardenDisc}>
                    <Emoji size={20}>{meta.emoji}</Emoji>
                  </LinearGradient>
                  <View style={styles.flex}>
                    <Text variant="title" color="strong" numberOfLines={1}>{g.name}</Text>
                    <Text variant="caption" color="muted">{meta.label} · {g.plantCount} plants</Text>
                  </View>
                  <View style={[styles.radio, active && styles.radioActive]}>
                    {active ? <Check size={13} color="#fff" strokeWidth={3} /> : null}
                  </View>
                </Pressable>
              );
            })}
          </View>
        )
      ) : null}

      {current === 'basics' ? <PlantBasicsFields control={control} /> : null}
      {current === 'planting' ? <PlantPlantingFields control={control} /> : null}
      {current === 'care' ? <PlantCareFields control={control} /> : null}
      {isReview ? <PlantReviewCard values={getValues()} gardenName={selectedGarden?.name ?? ''} /> : null}

      {create.isError ? (
        <Text variant="bodySmall" color="danger" style={styles.err}>
          We couldn't add your plant just now. Please try again.
        </Text>
      ) : null}
    </KeyboardAwareScreen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  flex2: { flex: 2 },
  content: { paddingBottom: spacing['3xl'] },
  topbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: gutter - 8,
    paddingTop: 6,
    paddingBottom: 4,
  },
  spacer: { width: 40 },
  dots: { flexDirection: 'row', columnGap: 6 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: palette.neutral[300] },
  dotActive: { backgroundColor: palette.green[500], width: 22 },
  dotDone: { backgroundColor: palette.green[300] },
  head: { paddingTop: spacing.base, paddingBottom: spacing.lg, rowGap: 6 },
  title: { marginTop: 2 },
  err: { marginTop: spacing.base },
  footer: {
    flexDirection: 'row',
    columnGap: 12,
    paddingHorizontal: gutter,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border.soft,
    backgroundColor: colors.surface.card,
  },
  list: { rowGap: 10 },
  gardenRow: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 12,
    padding: 12,
    backgroundColor: colors.surface.card,
    borderWidth: 1.5,
    borderColor: colors.border.soft,
    borderRadius: radii.lg,
  },
  gardenRowActive: { borderColor: palette.green[400], backgroundColor: palette.green[50] },
  gardenDisc: { width: 44, height: 44, borderRadius: radii.md, alignItems: 'center', justifyContent: 'center' },
  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border.default,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioActive: { borderColor: palette.green[500], backgroundColor: palette.green[500] },
});
