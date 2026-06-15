/**
 * PlantForm — reusable plant field sections on the app-wide FormTextInput /
 * picker primitives. Exposed as Basics / Planting / Care sections (for the add
 * wizard) plus a combined PlantForm (for edit). Pickers stay as Controllers.
 */

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Control, Controller } from 'react-hook-form';
import { MapPin } from 'lucide-react-native';

import { Button, FormTextInput, Text } from '@components/index';
import { spacing } from '@theme/index';
import { PlantFormValues } from '../plant.schema';
import { PlantTypePicker } from './PlantTypePicker';
import { PlantSourcePicker } from './PlantSourcePicker';
import { PlantCarePicker } from './PlantCarePicker';
import { SUN_PREF_OPTIONS, WATERING_PREF_OPTIONS } from '../types/plant.types';
import { formatPlantedDate, todayISODate } from '../utils/plantDates';

interface SectionProps {
  control: Control<PlantFormValues>;
}

function FieldHeader({ label, hint }: { label: string; hint?: string }) {
  return (
    <View style={styles.fieldHeader}>
      <Text variant="label" color="strong">{label}</Text>
      {hint ? <Text variant="caption" color="muted">{hint}</Text> : null}
    </View>
  );
}

export function PlantBasicsFields({ control }: SectionProps) {
  return (
    <View style={styles.section}>
      <FormTextInput
        control={control}
        name="name"
        label="Plant name"
        placeholder="Tomato"
        autoCapitalize="words"
        returnKeyType="next"
        hint="What are you growing?"
      />
      <FormTextInput
        control={control}
        name="variety"
        label="Variety (optional)"
        placeholder="Cherry · Roma · Genovese"
        autoCapitalize="words"
        returnKeyType="done"
      />
      <View>
        <FieldHeader label="Plant type" hint="Helps Sprout tailor care later." />
        <Controller control={control} name="type" render={({ field }) => <PlantTypePicker value={field.value} onChange={field.onChange} />} />
      </View>
    </View>
  );
}

export function PlantPlantingFields({ control }: SectionProps) {
  return (
    <View style={styles.section}>
      <View>
        <FieldHeader label="Planted date (optional)" />
        <Controller
          control={control}
          name="plantedDate"
          render={({ field }) => (
            <View style={styles.dateRow}>
              <Text variant="title" color={field.value ? 'strong' : 'muted'} style={styles.flex}>
                {formatPlantedDate(field.value || null)}
              </Text>
              <Button label="Today" size="sm" variant="secondary" onPress={() => field.onChange(todayISODate())} />
              <Button label="Clear" size="sm" variant="ghost" onPress={() => field.onChange('')} />
            </View>
          )}
        />
      </View>
      <View>
        <FieldHeader label="Source (optional)" hint="Where did this plant come from?" />
        <Controller control={control} name="source" render={({ field }) => <PlantSourcePicker value={field.value} onChange={field.onChange} />} />
      </View>
      <FormTextInput
        control={control}
        name="locationInGarden"
        label="Location in garden (optional)"
        placeholder="Raised bed 1 · Patio pot"
        returnKeyType="done"
        hint="Where is this plant living?"
        iconLeft={<MapPin size={20} color="#9C9384" />}
      />
    </View>
  );
}

export function PlantCareFields({ control }: SectionProps) {
  return (
    <View style={styles.section}>
      <View>
        <FieldHeader label="Sun preference" hint="How does this plant like to be cared for?" />
        <Controller control={control} name="sunPreference" render={({ field }) => <PlantCarePicker options={SUN_PREF_OPTIONS} value={field.value} onChange={field.onChange} />} />
      </View>
      <View>
        <FieldHeader label="Watering preference" />
        <Controller control={control} name="wateringPreference" render={({ field }) => <PlantCarePicker options={WATERING_PREF_OPTIONS} value={field.value} onChange={field.onChange} />} />
      </View>
      <FormTextInput
        control={control}
        name="notes"
        label="Notes (optional)"
        placeholder="Anything to remember about this plant?"
        multiline
      />
    </View>
  );
}

export function PlantForm({ control }: SectionProps) {
  return (
    <View style={styles.all}>
      <PlantBasicsFields control={control} />
      <PlantPlantingFields control={control} />
      <PlantCareFields control={control} />
    </View>
  );
}

const styles = StyleSheet.create({
  section: { rowGap: spacing.lg },
  all: { rowGap: spacing.xl },
  fieldHeader: { rowGap: 2, marginBottom: 10 },
  flex: { flex: 1 },
  dateRow: { flexDirection: 'row', alignItems: 'center', columnGap: 8 },
});
