import { useEffect, useCallback, useRef } from 'react';
import { useRecordingStore } from '@/stores';
import { useGeolocation } from './useGeolocation';

interface UseTrailRecordingOptions {
  autoPause?: boolean;
  pauseThreshold?: number;
}

export function useTrailRecording(options: UseTrailRecordingOptions = {}) {
  const {
    autoPause = false,
    pauseThreshold = 0.0001,
  } = options;

  const {
    isRecording,
    isPaused,
    positions,
    duration,
    distance,
    elevation,
    currentPace,
    averagePace,
    startRecording,
    pauseRecording,
    resumeRecording,
    stopRecording,
    addPosition,
    resetRecording,
  } = useRecordingStore();

  const lastPositionRef = useRef<{ lat: number; lng: number; time: number } | null>(null);
  const timerRef = useRef<number | null>(null);
  const isWatchingRef = useRef(false);

  const { position, error: geoError, isLoading: geoLoading, startWatching, stopWatching } = useGeolocation({
    enableHighAccuracy: true,
    watch: false,
  });

  const start = useCallback(() => {
    resetRecording();
    startRecording();
    lastPositionRef.current = null;
    isWatchingRef.current = true;
    startWatching();
  }, [resetRecording, startRecording, startWatching]);

  const pause = useCallback(() => {
    pauseRecording();
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, [pauseRecording]);

  const resume = useCallback(() => {
    resumeRecording();
    lastPositionRef.current = null;
  }, [resumeRecording]);

  const stop = useCallback(() => {
    stopRecording();
    stopWatching();
    isWatchingRef.current = false;
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, [stopRecording, stopWatching]);

  useEffect(() => {
    if (isRecording && !isPaused && position) {
      const now = Date.now();
      
      if (lastPositionRef.current) {
        const dx = position.latitude - lastPositionRef.current.lat;
        const dy = position.longitude - lastPositionRef.current.lng;
        const movement = Math.sqrt(dx * dx + dy * dy);
        const timeSinceLast = now - lastPositionRef.current.time;

        if (timeSinceLast > 1000) {
          if (autoPause && movement < pauseThreshold) {
            console.log('Auto-pausing due to minimal movement');
          }
          
          addPosition({
            latitude: position.latitude,
            longitude: position.longitude,
            altitude: position.altitude,
            accuracy: position.accuracy,
            timestamp: position.timestamp,
          });

          lastPositionRef.current = {
            lat: position.latitude,
            lng: position.longitude,
            time: now,
          };
        }
      } else {
        addPosition({
          latitude: position.latitude,
          longitude: position.longitude,
          altitude: position.altitude,
          accuracy: position.accuracy,
          timestamp: position.timestamp,
        });

        lastPositionRef.current = {
          lat: position.latitude,
          lng: position.longitude,
          time: now,
        };
      }
    }
  }, [isRecording, isPaused, position, addPosition, autoPause, pauseThreshold]);

  useEffect(() => {
    if (isRecording && !isPaused) {
      timerRef.current = window.setInterval(() => {
        useRecordingStore.setState((state) => ({
          duration: state.duration + 1,
        }));
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRecording, isPaused]);

  useEffect(() => {
    return () => {
      if (isWatchingRef.current) {
        stopWatching();
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [stopWatching]);

  return {
    isRecording,
    isPaused,
    positions,
    duration,
    distance,
    elevation,
    currentPace,
    averagePace,
    geoError,
    geoLoading,
    start,
    pause,
    resume,
    stop,
    reset: resetRecording,
  };
}
