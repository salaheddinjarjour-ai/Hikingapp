import { useEffect, useCallback, useRef } from 'react';
import { useRecordingStore } from '@/stores';
import { useGeolocation } from './useGeolocation';

interface UseTrailRecordingOptions {
  autoPause?: boolean;
  pauseThreshold?: number;
}

export function useTrailRecording(options: UseTrailRecordingOptions = {}) {
  const {
    autoPause = true,
    pauseThreshold = 0.5,
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

  const { position, error: geoError, isLoading: geoLoading } = useGeolocation({
    enableHighAccuracy: true,
    watch: isRecording && !isPaused,
  });

  const lastPositionRef = useRef<{ lat: number; lng: number } | null>(null);
  const timerRef = useRef<number | null>(null);

  const start = useCallback(() => {
    resetRecording();
    startRecording();
    lastPositionRef.current = null;
  }, [resetRecording, startRecording]);

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
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, [stopRecording]);

  useEffect(() => {
    if (isRecording && !isPaused && position) {
      addPosition({
        latitude: position.latitude,
        longitude: position.longitude,
        altitude: position.altitude,
        accuracy: position.accuracy,
        timestamp: position.timestamp,
      });

      if (lastPositionRef.current) {
        const dx = position.latitude - lastPositionRef.current.lat;
        const dy = position.longitude - lastPositionRef.current.lng;
        const movement = Math.sqrt(dx * dx + dy * dy);

        if (autoPause && movement < pauseThreshold) {
          pause();
        }
      }

      lastPositionRef.current = {
        lat: position.latitude,
        lng: position.longitude,
      };
    }
  }, [isRecording, isPaused, position, addPosition, autoPause, pauseThreshold, pause]);

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
