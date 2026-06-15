/**
 * EditableAvatar — avatar with a camera affordance that opens the photo picker.
 * Picking emits the local image URI via onPick (the parent uploads it); a busy
 * overlay shows while the upload is in flight. "Remove" emits onRemove.
 */

import React from 'react';
import { ActivityIndicator, Alert, Pressable, StyleSheet, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Camera, X } from 'lucide-react-native';

import { Avatar, Text } from '@components/index';
import { colors, palette } from '@theme/index';

export interface EditableAvatarProps {
  /** Current avatar URL, or a local preview URI while uploading. */
  value?: string | null;
  name?: string;
  busy?: boolean;
  onPick: (uri: string) => void;
  onRemove: () => void;
}

export function EditableAvatar({ value, name, busy = false, onPick, onRemove }: EditableAvatarProps) {
  const pick = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert('Allow photo access', 'To choose a profile picture, enable photo access for Sprout in Settings.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled && result.assets[0]?.uri) onPick(result.assets[0].uri);
  };

  const onPressAvatar = () => {
    if (busy) return;
    if (value) {
      Alert.alert('Profile photo', undefined, [
        { text: 'Choose new photo', onPress: () => void pick() },
        { text: 'Remove photo', style: 'destructive', onPress: onRemove },
        { text: 'Cancel', style: 'cancel' },
      ]);
    } else {
      void pick();
    }
  };

  return (
    <View style={styles.wrap}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Change profile photo"
        onPress={onPressAvatar}
        disabled={busy}
        style={styles.avatarWrap}
      >
        <Avatar name={name} source={value} size="xl" ring />
        {busy ? (
          <View style={styles.overlay}>
            <ActivityIndicator color="#fff" />
          </View>
        ) : (
          <View style={styles.badge}>
            <Camera size={15} color="#fff" />
          </View>
        )}
      </Pressable>

      <Pressable onPress={onPressAvatar} hitSlop={6} disabled={busy}>
        <Text variant="label" tint={palette.green[700]} style={styles.cta}>
          {value ? 'Change photo' : 'Add a photo'}
        </Text>
      </Pressable>

      {value && !busy ? (
        <Pressable onPress={onRemove} hitSlop={6} style={styles.removeRow}>
          <X size={13} color={colors.text.muted} />
          <Text variant="caption" color="muted">
            Remove
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', rowGap: 6 },
  avatarWrap: { position: 'relative' },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 40,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: palette.green[600],
    borderWidth: 2.5,
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cta: { marginTop: 4 },
  removeRow: { flexDirection: 'row', alignItems: 'center', columnGap: 4 },
});
