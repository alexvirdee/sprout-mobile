/**
 * EditGardenScreen — edit every garden field using the same GardenForm as create
 * (single scroll), on the app-wide KeyboardAwareScreen. Hydrates from the cached
 * garden, saves via PATCH, and returns to the detail screen with a banner.
 */

import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft } from 'lucide-react-native';

import { Button, IconButton, KeyboardAwareScreen, Spinner, Text } from '@components/index';
import { colors, spacing, gutter } from '@theme/index';
import { GardensStackScreenProps } from '@app-types/navigation';
import { emptyGardenForm, gardenFormSchema, GardenFormValues, toFormValues, toPayload } from '../garden.schema';
import { GardenForm } from '../components/GardenForm';
import { useGarden } from '../hooks/useGarden';
import { useUpdateGarden } from '../hooks/useUpdateGarden';

export function EditGardenScreen({ navigation, route }: GardensStackScreenProps<'EditGarden'>) {
  const { id } = route.params;
  const insets = useSafeAreaInsets();
  const { data: garden, isLoading } = useGarden(id);
  const update = useUpdateGarden(id);

  const { control, handleSubmit, reset, setValue } = useForm<GardenFormValues>({
    resolver: zodResolver(gardenFormSchema),
    defaultValues: emptyGardenForm,
    mode: 'onTouched',
  });

  useEffect(() => {
    if (garden) reset(toFormValues(garden));
  }, [garden, reset]);

  const onSubmit = (values: GardenFormValues) => {
    update.mutate(toPayload(values), {
      onSuccess: () => navigation.navigate('GardenDetail', { id, flash: 'Garden updated' }),
    });
  };

  const header = (
    <View style={styles.topbar}>
      <IconButton accessibilityLabel="Back" variant="ghost" onPress={() => navigation.goBack()}>
        <ArrowLeft size={24} color={colors.text.strong} />
      </IconButton>
      <Text variant="h3" color="strong" style={styles.title}>Edit garden</Text>
      <View style={styles.spacer} />
    </View>
  );

  if (isLoading && !garden) {
    return (
      <KeyboardAwareScreen header={header} padded={false}>
        <View style={styles.center}>
          <Spinner />
        </View>
      </KeyboardAwareScreen>
    );
  }

  return (
    <KeyboardAwareScreen
      header={header}
      contentContainerStyle={styles.content}
      footer={
        <View style={[styles.footer, { paddingBottom: insets.bottom + 12 }]}>
          <Button label="Save changes" fullWidth loading={update.isPending} onPress={handleSubmit(onSubmit)} />
        </View>
      }
    >
      <StatusBar style="dark" />
      <GardenForm control={control} setValue={setValue} />
      {update.isError ? (
        <Text variant="bodySmall" color="danger" style={styles.err}>
          We couldn't save your changes just now. Please try again.
        </Text>
      ) : null}
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
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  err: { marginTop: spacing.base },
  footer: {
    paddingHorizontal: gutter,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border.soft,
    backgroundColor: colors.surface.card,
  },
});
