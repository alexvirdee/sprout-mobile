/**
 * EditProfileScreen — lightweight, polished profile editing on the app-wide
 * KeyboardAwareScreen: avatar (pick / replace / remove), name fields, display
 * name, email, location, bio. Saves via an optimistic PATCH and returns with a
 * "Profile updated" banner.
 */

import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft } from 'lucide-react-native';

import { Button, FormTextInput, IconButton, KeyboardAwareScreen, Text } from '@components/index';
import { colors, gutter, spacing } from '@theme/index';
import { ProfileStackScreenProps } from '@app-types/navigation';
import { useProfile } from '../hooks/useProfile';
import { useUpdateProfile } from '../hooks/useUpdateProfile';
import { useAvatar } from '../hooks/useAvatar';
import { EditableAvatar, LocationAutocomplete } from '../components';
import { profileFormSchema, ProfileFormValues, toFormValues } from '../profile.schema';
import { displayNameOr } from '../utils/profileFormat';

export function EditProfileScreen({ navigation }: ProfileStackScreenProps<'EditProfile'>) {
  const insets = useSafeAreaInsets();
  const { user } = useProfile();
  const update = useUpdateProfile();
  const { upload, remove, isPending: avatarBusy } = useAvatar();

  // Avatar uploads immediately (binary, separate from the text form). `preview`
  // shows the picked image optimistically until the server returns its URL.
  const [preview, setPreview] = useState<string | null>(null);
  const avatarUri = preview ?? user?.avatar ?? null;

  const onPickAvatar = (uri: string) => {
    setPreview(uri);
    upload.mutate(uri, { onSettled: () => setPreview(null) });
  };

  const { control, handleSubmit } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: toFormValues(user),
    mode: 'onTouched',
  });

  const onSubmit = (values: ProfileFormValues) => {
    update.mutate(values, {
      onSuccess: () => navigation.navigate('ProfileHome', { flash: 'Profile updated' }),
    });
  };

  const header = (
    <View style={styles.topbar}>
      <IconButton accessibilityLabel="Back" variant="ghost" onPress={() => navigation.goBack()}>
        <ArrowLeft size={24} color={colors.text.strong} />
      </IconButton>
      <Text variant="h3" color="strong" style={styles.title}>
        Edit profile
      </Text>
      <View style={styles.spacer} />
    </View>
  );

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

      <View style={styles.avatar}>
        <EditableAvatar
          value={avatarUri}
          name={displayNameOr(user?.name)}
          busy={avatarBusy}
          onPick={onPickAvatar}
          onRemove={() => remove.mutate()}
        />
      </View>

      <View style={styles.fields}>
        <View style={styles.row}>
          <View style={styles.col}>
            <FormTextInput control={control} name="firstName" label="First name" placeholder="Ada" autoCapitalize="words" />
          </View>
          <View style={styles.col}>
            <FormTextInput control={control} name="lastName" label="Last name" placeholder="Waters" autoCapitalize="words" />
          </View>
        </View>

        <FormTextInput
          control={control}
          name="displayName"
          label="Display name"
          placeholder="How you'd like to be known"
          autoCapitalize="words"
        />
        <FormTextInput
          control={control}
          name="email"
          label="Email"
          placeholder="you@example.com"
          autoCapitalize="none"
          keyboardType="email-address"
          autoComplete="email"
        />
        <Controller
          control={control}
          name="location"
          render={({ field, fieldState }) => (
            <LocationAutocomplete
              label="Location"
              placeholder="Start typing a city…"
              hint="Optional — helps tailor seasonal tips."
              value={field.value}
              onChange={field.onChange}
              error={fieldState.error?.message}
            />
          )}
        />
        <FormTextInput
          control={control}
          name="bio"
          label="Bio"
          placeholder="Backyard gardener growing herbs and veggies."
          multiline
          maxLength={280}
          hint="Optional — a line about your garden."
        />
      </View>

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
  avatar: { alignItems: 'center', marginBottom: spacing.lg },
  fields: { rowGap: spacing.base },
  row: { flexDirection: 'row', columnGap: spacing.md },
  col: { flex: 1 },
  err: { marginTop: spacing.base },
  footer: {
    paddingHorizontal: gutter,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border.soft,
    backgroundColor: colors.surface.card,
  },
});
