/**
 * useDeviceLocation — foreground location for weather, with friendly permission
 * handling. On mount it only *checks* the permission (no prompt); the WeatherCard
 * shows an "Enable weather" CTA that calls `request()` to ask. Never blocks Home.
 */

import { useCallback, useEffect, useState } from 'react';
import * as Location from 'expo-location';

import { Coordinates } from '../types/weather.types';

export type LocationStatus = 'loading' | 'granted' | 'denied' | 'unavailable';

export function useDeviceLocation() {
  const [coords, setCoords] = useState<Coordinates | null>(null);
  const [status, setStatus] = useState<LocationStatus>('loading');

  const load = useCallback(async (prompt: boolean) => {
    try {
      let perm = await Location.getForegroundPermissionsAsync();
      if (!perm.granted && prompt && perm.canAskAgain) {
        perm = await Location.requestForegroundPermissionsAsync();
      }
      if (!perm.granted) {
        setStatus('denied');
        return;
      }
      const pos =
        (await Location.getLastKnownPositionAsync()) ??
        (await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Low }));
      if (pos) {
        setCoords({ latitude: pos.coords.latitude, longitude: pos.coords.longitude });
        setStatus('granted');
      } else {
        setStatus('unavailable');
      }
    } catch {
      setStatus('unavailable');
    }
  }, []);

  // Check (don't prompt) on first load.
  useEffect(() => {
    void load(false);
  }, [load]);

  /** Explicitly ask for permission (driven by the WeatherCard CTA). */
  const request = useCallback(() => {
    setStatus('loading');
    void load(true);
  }, [load]);

  return { coords, status, request };
}
