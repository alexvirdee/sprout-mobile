/**
 * LocationAutocomplete — a text field with a city/place type-ahead powered by
 * the free Open-Meteo geocoding API. Type "Ta" → "Tampa, FL" etc. Free text is
 * still allowed; picking a suggestion fills the formatted label and (optionally)
 * reports the selected place's coordinates via `onSelectPlace`.
 *
 * Use inside a KeyboardAwareScreen whose ScrollView sets
 * keyboardShouldPersistTaps="handled" so suggestion taps register while the
 * keyboard is open.
 */

import React, { useEffect, useRef, useState } from 'react';
import { Keyboard, Pressable, StyleSheet, View } from 'react-native';
import { MapPin } from 'lucide-react-native';

import { useCitySearch } from '@hooks/useCitySearch';
import { formatPlace, GeoPlace, placeSubtitle } from '@services/geocoding';
import { colors, palette } from '@theme/index';
import { AppTextInput } from './ui/AppTextInput';
import { Card } from './ui/Card';
import { Text } from './ui/Text';
import { Spinner } from './feedback/LoadingState';

export interface LocationAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  /** Fired when a suggestion is chosen — carries lat/long for the picked place. */
  onSelectPlace?: (place: GeoPlace) => void;
  label?: string;
  placeholder?: string;
  hint?: string;
  error?: string;
}

export function LocationAutocomplete({
  value,
  onChange,
  onSelectPlace,
  label,
  placeholder,
  hint,
  error,
}: LocationAutocompleteProps) {
  const [focused, setFocused] = useState(false);
  // Suppress search right after a pick (or for an already-set value on mount) so
  // we don't immediately re-search the selected text.
  const [suppressed, setSuppressed] = useState(() => value.trim().length > 0);
  const blurTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { data: places = [], isFetching } = useCitySearch(suppressed ? '' : value);

  useEffect(
    () => () => {
      if (blurTimer.current) clearTimeout(blurTimer.current);
    },
    []
  );

  const open = focused && !suppressed && value.trim().length >= 2;
  const showList = open && (places.length > 0 || isFetching);

  const choose = (place: GeoPlace) => {
    setSuppressed(true);
    onChange(formatPlace(place));
    onSelectPlace?.(place);
    Keyboard.dismiss();
    setFocused(false);
  };

  return (
    <View>
      <AppTextInput
        label={label}
        hint={hint}
        error={error}
        placeholder={placeholder}
        value={value}
        onChangeText={(t) => {
          onChange(t);
          if (suppressed) setSuppressed(false);
        }}
        autoCapitalize="words"
        autoCorrect={false}
        iconLeft={<MapPin size={18} color={colors.text.muted} />}
        returnKeyType="done"
        onFocus={() => {
          if (blurTimer.current) clearTimeout(blurTimer.current);
          setFocused(true);
        }}
        onBlur={() => {
          blurTimer.current = setTimeout(() => setFocused(false), 150);
        }}
      />

      {showList ? (
        <Card padding="none" radius="md" elevation="md" style={styles.dropdown}>
          {places.length === 0 && isFetching ? (
            <View style={styles.loading}>
              <Spinner />
              <Text variant="caption" color="muted">
                Searching…
              </Text>
            </View>
          ) : (
            places.map((p, i) => (
              <Pressable
                key={p.id}
                accessibilityRole="button"
                onPress={() => choose(p)}
                style={({ pressed }) => [styles.row, i > 0 && styles.rowBorder, pressed && styles.rowPressed]}
              >
                <MapPin size={15} color={palette.green[600]} />
                <View style={styles.rowText}>
                  <Text variant="bodySmall" color="strong">
                    {formatPlace(p)}
                  </Text>
                  {placeSubtitle(p) ? (
                    <Text variant="caption" color="subtle">
                      {placeSubtitle(p)}
                    </Text>
                  ) : null}
                </View>
              </Pressable>
            ))
          )}
        </Card>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  dropdown: { marginTop: 6, overflow: 'hidden' },
  loading: { flexDirection: 'row', alignItems: 'center', columnGap: 8, padding: 14 },
  row: { flexDirection: 'row', alignItems: 'center', columnGap: 10, paddingHorizontal: 14, paddingVertical: 12 },
  rowText: { flex: 1, rowGap: 1 },
  rowBorder: { borderTopWidth: 1, borderTopColor: colors.border.soft },
  rowPressed: { backgroundColor: colors.surface.sunken },
});
