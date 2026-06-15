/**
 * CreateGardenScreen — a calm 4-step wizard (basics → location & light → size →
 * review) sharing one react-hook-form instance, on the app-wide
 * KeyboardAwareScreen (header = progress bar, footer = Back / Continue / Create).
 */

import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft } from 'lucide-react-native';

import { Button, Card, Emoji, IconButton, KeyboardAwareScreen, Text } from '@components/index';
import { colors, palette, spacing, gutter } from '@theme/index';
import { GardensStackScreenProps } from '@app-types/navigation';
import { emptyGardenForm, gardenFormSchema, GardenFormValues, toPayload } from '../garden.schema';
import { GardenBasicsFields, GardenLocationFields, GardenSizeFields } from '../components/GardenForm';
import { useCreateGarden } from '../hooks/useCreateGarden';
import { gardenTypeMeta, sizeSummary, sunExposureMeta } from '../types/garden.types';

const STEPS = [
  { title: 'Garden basics', sub: "Let's set up your peaceful space.", fields: ['name', 'type'] },
  { title: 'Location & light', sub: 'Where does this garden live?', fields: ['locationLabel', 'cityOrZip', 'sunExposure', 'growingZone'] },
  { title: 'Size & notes', sub: 'How much room are you working with?', fields: ['sizeType', 'length', 'width', 'unit', 'notes'] },
  { title: 'Almost ready to plant', sub: 'Review and create your garden.', fields: [] },
] as const;

export function CreateGardenScreen({ navigation }: GardensStackScreenProps<'CreateGarden'>) {
  const insets = useSafeAreaInsets();
  const create = useCreateGarden();
  const [step, setStep] = useState(0);

  const { control, handleSubmit, trigger, getValues, setValue } = useForm<GardenFormValues>({
    resolver: zodResolver(gardenFormSchema),
    defaultValues: emptyGardenForm,
    mode: 'onTouched',
  });

  const isReview = step === STEPS.length - 1;
  const goBack = () => (step === 0 ? navigation.goBack() : setStep((s) => s - 1));

  const next = async () => {
    const fields = STEPS[step].fields;
    const ok = fields.length ? await trigger([...fields] as (keyof GardenFormValues)[]) : true;
    if (ok) setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  const onSubmit = (values: GardenFormValues) => {
    create.mutate(toPayload(values), {
      onSuccess: () => navigation.navigate('GardensList', { flash: 'Garden created 🌱' }),
    });
  };

  const header = (
    <View style={styles.topbar}>
      <IconButton accessibilityLabel="Back" variant="ghost" onPress={goBack}>
        <ArrowLeft size={24} color={colors.text.strong} />
      </IconButton>
      <View style={styles.dots}>
        {STEPS.map((_, i) => (
          <View key={i} style={[styles.dot, i === step ? styles.dotActive : i < step ? styles.dotDone : null]} />
        ))}
      </View>
      <View style={styles.spacer} />
    </View>
  );

  const footer = (
    <View style={[styles.footer, { paddingBottom: insets.bottom + 12 }]}>
      {step > 0 ? (
        <View style={styles.flex}>
          <Button label="Back" variant="ghost" fullWidth onPress={goBack} />
        </View>
      ) : null}
      <View style={step > 0 ? styles.flex2 : styles.flex}>
        {isReview ? (
          <Button label="Create garden" fullWidth loading={create.isPending} onPress={handleSubmit(onSubmit)} />
        ) : (
          <Button label="Continue" fullWidth onPress={next} />
        )}
      </View>
    </View>
  );

  return (
    <KeyboardAwareScreen header={header} footer={footer} contentContainerStyle={styles.content}>
      <StatusBar style="dark" />
      <View style={styles.head}>
        <Text variant="eyebrow" tint={palette.green[700]}>Step {step + 1} of {STEPS.length}</Text>
        <Text variant="display" color="strong" style={styles.title}>{STEPS[step].title}</Text>
        <Text variant="bodyLarge" color="muted">{STEPS[step].sub}</Text>
      </View>

      {step === 0 ? <GardenBasicsFields control={control} /> : null}
      {step === 1 ? <GardenLocationFields control={control} setValue={setValue} /> : null}
      {step === 2 ? <GardenSizeFields control={control} /> : null}
      {isReview ? <ReviewCard values={getValues()} /> : null}

      {create.isError ? (
        <Text variant="bodySmall" color="danger" style={styles.err}>
          We couldn't create your garden just now. Please try again.
        </Text>
      ) : null}
    </KeyboardAwareScreen>
  );
}

function ReviewCard({ values }: { values: GardenFormValues }) {
  const type = gardenTypeMeta(values.type);
  const sun = sunExposureMeta(values.sunExposure);
  const hasDims = !!(values.length.trim() || values.width.trim());
  const size = sizeSummary({
    sizeType: values.sizeType,
    dimensions: hasDims
      ? { length: Number(values.length) || undefined, width: Number(values.width) || undefined, unit: values.unit }
      : undefined,
  });

  const rows: { label: string; value: string; emoji?: string }[] = [
    { label: 'Name', value: values.name || '—' },
    { label: 'Type', value: type.label, emoji: type.emoji },
    { label: 'Location', value: values.locationLabel || 'Not set' },
    { label: 'Sun exposure', value: sun.label, emoji: sun.emoji },
    { label: 'Size', value: size },
    { label: 'Growing zone', value: values.growingZone || 'Not set' },
  ];

  return (
    <Card padding="none" radius="lg">
      {rows.map((r, i) => (
        <View key={r.label}>
          <View style={styles.reviewRow}>
            <Text variant="bodySmall" color="muted">{r.label}</Text>
            <View style={styles.reviewValue}>
              {r.emoji ? <Emoji size={15}>{r.emoji}</Emoji> : null}
              <Text variant="title" color="strong" numberOfLines={1}>{r.value}</Text>
            </View>
          </View>
          {i < rows.length - 1 ? <View style={styles.divider} /> : null}
        </View>
      ))}
    </Card>
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

  reviewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    columnGap: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  reviewValue: { flexDirection: 'row', alignItems: 'center', columnGap: 6, flexShrink: 1 },
  divider: { height: 1, backgroundColor: colors.border.soft, marginHorizontal: 16 },
});
