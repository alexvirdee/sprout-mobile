/**
 * ComingSoonScreen — friendly placeholder for the Phase 2 tabs (Garden, Water,
 * You). Keeps the navigation real and on-brand while features land.
 */

import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Button, EmptyState, ScreenContainer } from '@components/index';
import { spacing } from '@theme/index';
import { useAuth } from '@hooks/useAuth';

export interface ComingSoonScreenProps {
  icon?: string;
  title: string;
  message?: string;
  showSignOut?: boolean;
}

export function ComingSoonScreen({ icon = '🌱', title, message, showSignOut = false }: ComingSoonScreenProps) {
  const { logout } = useAuth();
  return (
    <ScreenContainer>
      <View style={styles.center}>
        <EmptyState
          icon={icon}
          title={title}
          message={message}
          action={
            showSignOut ? (
              <Button label="Sign out" variant="secondary" onPress={() => void logout()} />
            ) : undefined
          }
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', paddingBottom: spacing['4xl'] },
});
