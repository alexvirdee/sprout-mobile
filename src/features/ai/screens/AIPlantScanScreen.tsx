/**
 * AIPlantScanScreen — the scan entry: take a photo or choose one from the
 * library, then send it for identification. Handles permissions and errors
 * gracefully and shows a friendly loading state while the AI looks.
 */

import React, { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import * as ImagePicker from 'expo-image-picker';
import { ArrowLeft, Camera, Images } from 'lucide-react-native';

import { Button, Card, Emoji, IconButton, Text } from '@components/index';
import { colors, gutter, palette, spacing } from '@theme/index';
import { GardensStackScreenProps } from '@app-types/navigation';
import { usePlantIdentification } from '../hooks/usePlantIdentification';
import { PlantScanLoading } from '../components';

export function AIPlantScanScreen({ navigation }: GardensStackScreenProps<'AIPlantScan'>) {
  const insets = useSafeAreaInsets();
  const identify = usePlantIdentification();
  const [error, setError] = useState<string | null>(null);

  const runIdentify = (uri: string) => {
    setError(null);
    identify.mutate(uri, {
      onSuccess: (result) => navigation.navigate('AIPlantResult', { imageUri: uri, result }),
      onError: (e) => setError(e.message || 'Sprout couldn’t read that photo. Please try again.'),
    });
  };

  const takePhoto = async () => {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) {
      Alert.alert(
        'Camera access needed',
        'Sprout uses your camera to help identify plants and add them to your garden. You can enable it in Settings.'
      );
      return;
    }
    const res = await ImagePicker.launchCameraAsync({ mediaTypes: ['images'], allowsEditing: true, quality: 0.6 });
    if (!res.canceled && res.assets[0]?.uri) runIdentify(res.assets[0].uri);
  };

  const chooseFromLibrary = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert(
        'Photo access needed',
        'Sprout needs access to your photos to identify a plant from your library. You can enable it in Settings.'
      );
      return;
    }
    const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], allowsEditing: true, quality: 0.6 });
    if (!res.canceled && res.assets[0]?.uri) runIdentify(res.assets[0].uri);
  };

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      <View style={[styles.topBar, { paddingTop: insets.top + 8 }]}>
        <IconButton accessibilityLabel="Go back" variant="ghost" onPress={() => navigation.goBack()}>
          <ArrowLeft size={22} color={colors.text.body} />
        </IconButton>
        <Text variant="h2" color="strong">
          Scan a plant
        </Text>
        <View style={styles.spacer} />
      </View>

      <View style={styles.body}>
        {identify.isPending ? (
          <PlantScanLoading />
        ) : (
          <>
            <View style={styles.hero}>
              <Emoji size={64}>🪴</Emoji>
              <Text variant="h1" color="strong" align="center" style={styles.heroTitle}>
                Snap a photo
              </Text>
              <Text variant="bodyLarge" color="muted" align="center">
                Point your camera at a plant and Sprout will suggest what it might be.
              </Text>
            </View>

            <View style={styles.actions}>
              <Button
                label="Take photo"
                fullWidth
                iconLeft={<Camera size={18} color="#fff" />}
                onPress={() => void takePhoto()}
              />
              <Button
                label="Choose from library"
                variant="secondary"
                fullWidth
                iconLeft={<Images size={18} color={palette.green[700]} />}
                onPress={() => void chooseFromLibrary()}
              />
            </View>

            {error ? (
              <Card padding="md" radius="lg" style={styles.errorCard}>
                <Text variant="bodySmall" color="danger" align="center">
                  {error}
                </Text>
              </Card>
            ) : null}

            <Text variant="caption" color="subtle" align="center" style={styles.note}>
              Sprout’s identification is a helpful guess — you’ll confirm before adding.
            </Text>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.surface.page },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 8,
    paddingHorizontal: gutter,
    paddingBottom: spacing.base,
  },
  spacer: { width: 42 },
  body: { flex: 1, paddingHorizontal: gutter, justifyContent: 'center' },
  hero: { alignItems: 'center', rowGap: 8, marginBottom: spacing.xl },
  heroTitle: { marginTop: spacing.sm },
  actions: { rowGap: spacing.md },
  errorCard: { marginTop: spacing.lg },
  note: { marginTop: spacing.lg },
});
