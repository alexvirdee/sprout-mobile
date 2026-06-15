/**
 * ForgotPasswordScreen — request a reset link. Shows a calm confirmation state
 * once submitted (we never reveal whether an email exists). Uses the app-wide
 * KeyboardAwareScreen + FormTextInput.
 */

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronLeft, Mail } from 'lucide-react-native';

import { Button, EmptyState, FormTextInput, IconButton, KeyboardAwareScreen, Text } from '@components/index';
import { colors, spacing } from '@theme/index';
import { authService } from '@services/authService';
import { forgotPasswordSchema, ForgotPasswordValues } from '@utils/validation';
import { AuthStackScreenProps } from '@app-types/navigation';

export function ForgotPasswordScreen({ navigation }: AuthStackScreenProps<'ForgotPassword'>) {
  const [sentTo, setSentTo] = React.useState<string | null>(null);

  const { control, handleSubmit, formState } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = async (values: ForgotPasswordValues) => {
    try {
      await authService.requestPasswordReset(values.email.trim());
    } catch {
      // Intentionally swallow — we always show the same confirmation.
    }
    setSentTo(values.email.trim());
  };

  return (
    <KeyboardAwareScreen
      header={
        <IconButton accessibilityLabel="Go back" variant="ghost" onPress={() => navigation.goBack()} style={styles.back}>
          <ChevronLeft size={24} color={colors.text.strong} />
        </IconButton>
      }
    >
      {sentTo ? (
        <View style={styles.sent}>
          <EmptyState
            icon="📨"
            title="Check your inbox"
            message={`If an account exists for ${sentTo}, we've sent a link to reset your password.`}
            action={
              <Button label="Back to sign in" variant="secondary" onPress={() => navigation.navigate('SignIn')} />
            }
          />
        </View>
      ) : (
        <>
          <View style={styles.header}>
            <Text variant="display" color="strong">
              Reset your password
            </Text>
            <Text variant="bodyLarge" color="muted">
              Enter your email and we'll send you a link to get back into your garden.
            </Text>
          </View>

          <View style={styles.form}>
            <FormTextInput
              control={control}
              name="email"
              label="Email"
              placeholder="you@garden.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              textContentType="emailAddress"
              returnKeyType="send"
              onSubmitEditing={handleSubmit(onSubmit)}
              iconLeft={<Mail size={20} color={colors.text.subtle} />}
            />
            <Button
              label="Send reset link"
              size="lg"
              fullWidth
              loading={formState.isSubmitting}
              onPress={handleSubmit(onSubmit)}
            />
          </View>
        </>
      )}
    </KeyboardAwareScreen>
  );
}

const styles = StyleSheet.create({
  back: { marginTop: spacing.sm, marginLeft: spacing.base - spacing.sm },
  header: { marginTop: spacing.base, marginBottom: spacing.xl, rowGap: spacing.sm },
  form: { rowGap: spacing.lg },
  sent: { marginTop: spacing['4xl'] },
});
