/**
 * ProfileHeader — the warm identity header on a meadow gradient: avatar (with an
 * edit affordance), name, optional @handle, email, and member-since. Tapping the
 * avatar or the "Edit profile" pill opens the edit flow.
 */

import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Pencil } from 'lucide-react-native';

import { Avatar, Badge, Button, Text } from '@components/index';
import { gradients, gutter, palette, spacing } from '@theme/index';
import { User } from '@app-types/models';
import { displayNameOr, memberSinceLabel } from '../utils/profileFormat';

export interface ProfileHeaderProps {
  user: User | null;
  isDemo: boolean;
  topInset: number;
  onEditPress: () => void;
}

export function ProfileHeader({ user, isDemo, topInset, onEditPress }: ProfileHeaderProps) {
  const name = displayNameOr(user?.name);
  const handle = user?.displayName && user.displayName !== user?.name ? user.displayName : undefined;
  const since = memberSinceLabel(user?.createdAt);

  return (
    <LinearGradient
      colors={gradients.meadow.colors}
      start={gradients.meadow.start}
      end={gradients.meadow.end}
      style={[styles.header, { paddingTop: topInset + spacing.xl }]}
    >
      <Pressable accessibilityRole="button" accessibilityLabel="Edit profile photo" onPress={onEditPress} style={styles.avatarWrap}>
        <Avatar name={name} source={user?.avatar} size="xl" ring />
        <View style={styles.editDot}>
          <Pencil size={13} color="#fff" />
        </View>
      </Pressable>

      <Text variant="h1" color="strong" align="center" style={styles.name}>
        {name}
      </Text>
      {handle ? (
        <Text variant="bodySmall" color="muted" align="center">
          @{handle}
        </Text>
      ) : null}
      {user?.email ? (
        <Text variant="body" color="muted" align="center" style={styles.email}>
          {user.email}
        </Text>
      ) : null}

      {isDemo ? (
        <View style={styles.meta}>
          <Badge label="Demo mode" tone="gold" dot />
        </View>
      ) : since ? (
        <Text variant="caption" color="subtle" align="center" style={styles.since}>
          {since}
        </Text>
      ) : null}

      <Button
        label="Edit profile"
        variant="secondary"
        size="sm"
        iconLeft={<Pencil size={15} color={palette.green[700]} />}
        onPress={onEditPress}
        style={styles.editBtn}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  header: { alignItems: 'center', paddingHorizontal: gutter, paddingBottom: spacing.xl },
  avatarWrap: { position: 'relative' },
  editDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: palette.green[600],
    borderWidth: 2.5,
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: { marginTop: spacing.md },
  email: { marginTop: 2 },
  meta: { marginTop: spacing.md },
  since: { marginTop: 8 },
  editBtn: { marginTop: spacing.base, alignSelf: 'center' },
});
