/**
 * ForgotPasswordScreen — request a reset link. Shows a calm confirmation state
 * once submitted (we never reveal whether an email exists).
 */

import React from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronLeft, Mail } from 'lucide-react-native';

import { Button, EmptyState, IconButton, Input, ScreenContainer, Text } from '@components/index';
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
    <ScreenContainer scroll>
      <IconButton
        accessibilityLabel="Go back"
        variant="ghost"
        onPress={() => navigation.goBack()}
        style={styles.back}
      >
        <ChevronLeft size={24} color={colors.text.strong} />
      </IconButton>

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
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View style={styles.header}>
            <Text variant="display" color="strong">
              Reset your password
            </Text>
            <Text variant="bodyLarge" color="muted">
              Enter your email and we'll send you a link to get back into your garden.
            </Text>
          </View>

          <View style={styles.form}>
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value }, fieldState }) => (
                <Input
                  label="Email"
                  placeholder="you@garden.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  iconLeft={<Mail size={20} color={colors.text.subtle} />}
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={fieldState.error?.message}
                />
              )}
            />
            <Button
              label="Send reset link"
              size="lg"
              fullWidth
              loading={formState.isSubmitting}
              onPress={handleSubmit(onSubmit)}
            />
          </View>
        </KeyboardAvoidingView>
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  back: { marginTop: spacing.sm, marginLeft: -spacing.sm },
  header: { marginTop: spacing.base, marginBottom: spacing.xl, rowGap: spacing.sm },
  form: { rowGap: spacing.lg },
  sent: { marginTop: spacing['4xl'] },
});
