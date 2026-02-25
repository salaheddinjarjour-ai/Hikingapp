import { useState, useEffect, useCallback } from 'react';
import type { GeoPosition } from '@/types';

interface UseGeolocationOptions {
  enableHighAccuracy?: boolean;
  maximumAge?: number;
  timeout?: number;
  watch?: boolean;
}

interface UseGeolocationResult {
  position: GeoPosition | null;
  error: string | null;
  isLoading: boolean;
  requestPermission: () => Promise<boolean>;
  startWatching: () => void;
  stopWatching: () => void;
}

export function useGeolocation(options: UseGeolocationOptions = {}): UseGeolocationResult {
  const {
    enableHighAccuracy = true,
    maximumAge = 5000,
    timeout = 10000,
    watch = false,
  } = options;

  const [position, setPosition] = useState<GeoPosition | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [watchId, setWatchId] = useState<number | null>(null);

  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser');
      return false;
    }

    try {
      const permission = await navigator.permissions.query({ name: 'geolocation' });
      if (permission.state === 'denied') {
        setError('Geolocation permission denied');
        return false;
      }
      return true;
    } catch {
      return true;
    }
  }, []);

  const getCurrentPosition = useCallback((): Promise<GeoPosition> => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const position: GeoPosition = {
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            altitude: pos.coords.altitude ?? undefined,
            accuracy: pos.coords.accuracy ?? undefined,
            timestamp: pos.timestamp,
          };
          resolve(position);
        },
        (err) => reject(err),
        { enableHighAccuracy, maximumAge, timeout }
      );
    });
  }, [enableHighAccuracy, maximumAge, timeout]);

  const startWatching = useCallback(() => {
    if (watchId !== null) return;

    const id = navigator.geolocation.watchPosition(
      (pos) => {
        const newPosition: GeoPosition = {
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          altitude: pos.coords.altitude ?? undefined,
          accuracy: pos.coords.accuracy ?? undefined,
          timestamp: pos.timestamp,
        };
        setPosition(newPosition);
        setError(null);
        setIsLoading(false);
      },
      (err) => {
        setError(err.message);
        setIsLoading(false);
      },
      { enableHighAccuracy, maximumAge, timeout }
    );

    setWatchId(id);
  }, [enableHighAccuracy, maximumAge, timeout, watchId]);

  const stopWatching = useCallback(() => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
    }
  }, [watchId]);

  useEffect(() => {
    const init = async () => {
      const hasPermission = await requestPermission();
      if (!hasPermission) {
        setIsLoading(false);
        return;
      }

      try {
        const pos = await getCurrentPosition();
        setPosition(pos);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to get location');
      } finally {
        setIsLoading(false);
      }
    };

    init();

    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, []);

  useEffect(() => {
    if (watch && isLoading === false) {
      startWatching();
    }
  }, [watch]);

  return {
    position,
    error,
    isLoading,
    requestPermission,
    startWatching,
    stopWatching,
  };
}
