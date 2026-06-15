/**
 * GardenForm — the reusable garden field sections, built on the app-wide
 * FormTextInput / AppTextInput primitives. Exposed as three section components
 * (Basics / Location / Size) so the create wizard can show one per step, plus a
 * combined `GardenForm` used by edit. Pickers stay as Controllers (not text).
 */

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Control, Controller, useWatch } from 'react-hook-form';
import { MapPin } from 'lucide-react-native';

import { FormTextInput, SegmentedControl, Text } from '@components/index';
import { colors, spacing } from '@theme/index';
import { GardenFormValues } from '../garden.schema';
import { GardenTypePicker } from './GardenTypePicker';
import { SunExposurePicker } from './SunExposurePicker';
import { SizeSelector } from './SizeSelector';

interface SectionProps {
  control: Control<GardenFormValues>;
}

function FieldHeader({ label, hint }: { label: string; hint?: string }) {
  return (
    <View style={styles.fieldHeader}>
      <Text variant="label" color="strong">{label}</Text>
      {hint ? <Text variant="caption" color="muted">{hint}</Text> : null}
    </View>
  );
}

export function GardenBasicsFields({ control }: SectionProps) {
  return (
    <View style={styles.section}>
      <FormTextInput
        control={control}
        name="name"
        label="Garden name"
        placeholder="Summer Garden"
        autoCapitalize="words"
        returnKeyType="done"
        hint="A simple name helps keep your garden organized."
      />
      <View>
        <FieldHeader label="Garden type" hint="What are you growing in?" />
        <Controller
          control={control}
          name="type"
          render={({ field }) => <GardenTypePicker value={field.value} onChange={field.onChange} />}
        />
      </View>
    </View>
  );
}

export function GardenLocationFields({ control }: SectionProps) {
  return (
    <View style={styles.section}>
      <FormTextInput
        control={control}
        name="locationLabel"
        label="Location label"
        placeholder="Tampa backyard"
        returnKeyType="next"
        hint="Where does this garden live?"
        iconLeft={<MapPin size={20} color={colors.text.subtle} />}
      />
      <FormTextInput
        control={control}
        name="cityOrZip"
        label="City or ZIP (optional)"
        placeholder="Tampa, FL · 33602"
        returnKeyType="next"
      />
      <View>
        <FieldHeader label="Sun exposure" hint="Sun exposure helps Sprout recommend better care later." />
        <Controller
          control={control}
          name="sunExposure"
          render={({ field }) => <SunExposurePicker value={field.value} onChange={field.onChange} />}
        />
      </View>
      <FormTextInput
        control={control}
        name="growingZone"
        label="Growing zone (optional)"
        placeholder="9b"
        autoCapitalize="none"
        returnKeyType="done"
        hint="Not sure? You can change this later."
      />
    </View>
  );
}

export function GardenSizeFields({ control }: SectionProps) {
  const sizeType = useWatch({ control, name: 'sizeType' });

  return (
    <View style={styles.section}>
      <View>
        <FieldHeader label="Garden size" hint="A rough size is plenty for now." />
        <Controller
          control={control}
          name="sizeType"
          render={({ field }) => <SizeSelector value={field.value} onChange={field.onChange} />}
        />
      </View>

      {sizeType === 'custom' ? (
        <View style={styles.dims}>
          <FieldHeader label="Dimensions (optional)" />
          <View style={styles.dimsRow}>
            <FormTextInput
              control={control}
              name="length"
              containerStyle={styles.flex}
              label="Length"
              placeholder="8"
              keyboardType="numeric"
              returnKeyType="next"
            />
            <FormTextInput
              control={control}
              name="width"
              containerStyle={styles.flex}
              label="Width"
              placeholder="4"
              keyboardType="numeric"
              returnKeyType="done"
            />
          </View>
          <Controller
            control={control}
            name="unit"
            render={({ field }) => (
              <SegmentedControl
                size="sm"
                options={[
                  { value: 'ft', label: 'Feet' },
                  { value: 'm', label: 'Meters' },
                ]}
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
        </View>
      ) : null}

      <FormTextInput
        control={control}
        name="notes"
        label="Notes (optional)"
        placeholder="Anything to remember about this space?"
        multiline
      />
    </View>
  );
}

/** All sections stacked — used by the edit screen. */
export function GardenForm({ control }: SectionProps) {
  return (
    <View style={styles.all}>
      <GardenBasicsFields control={control} />
      <GardenLocationFields control={control} />
      <GardenSizeFields control={control} />
    </View>
  );
}

const styles = StyleSheet.create({
  section: { rowGap: spacing.lg },
  all: { rowGap: spacing.xl },
  fieldHeader: { rowGap: 2, marginBottom: 10 },
  flex: { flex: 1 },
  dims: { rowGap: 12 },
  dimsRow: { flexDirection: 'row', columnGap: 12 },
});
