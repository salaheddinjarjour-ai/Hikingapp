import { useState, useEffect, useCallback, useRef } from 'react';
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
  const watchIdRef = useRef<number | null>(null);
  const isWatchingRef = useRef(false);

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
          const geoPosition: GeoPosition = {
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            altitude: pos.coords.altitude ?? undefined,
            accuracy: pos.coords.accuracy ?? undefined,
            timestamp: pos.timestamp,
          };
          resolve(geoPosition);
        },
        (err) => reject(err),
        { enableHighAccuracy, maximumAge, timeout }
      );
    });
  }, [enableHighAccuracy, maximumAge, timeout]);

  const startWatching = useCallback(() => {
    if (isWatchingRef.current) return;
    if (!navigator.geolocation) {
      setError('Geolocation is not supported');
      return;
    }

    isWatchingRef.current = true;
    
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

    watchIdRef.current = id;
  }, [enableHighAccuracy, maximumAge, timeout]);

  const stopWatching = useCallback(() => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
      isWatchingRef.current = false;
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      const hasPermission = await requestPermission();
      if (!hasPermission || !mounted) {
        if (mounted) setIsLoading(false);
        return;
      }

      try {
        const pos = await getCurrentPosition();
        if (mounted) {
          setPosition(pos);
          setError(null);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Failed to get location');
        }
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    init();

    return () => {
      mounted = false;
      stopWatching();
    };
  }, [requestPermission, getCurrentPosition, stopWatching]);

  useEffect(() => {
    if (watch && !isLoading && !isWatchingRef.current) {
      startWatching();
    } else if (!watch && isWatchingRef.current) {
      stopWatching();
    }
  }, [watch, isLoading, startWatching, stopWatching]);

  return {
    position,
    error,
    isLoading,
    requestPermission,
    startWatching,
    stopWatching,
  };
}
