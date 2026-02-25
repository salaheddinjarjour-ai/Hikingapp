import { create } from 'zustand';
import type { GeoPosition, RecordingState } from '@/types';

interface RecordingStore extends RecordingState {
  startRecording: () => void;
  pauseRecording: () => void;
  resumeRecording: () => void;
  stopRecording: () => void;
  addPosition: (position: GeoPosition) => void;
  resetRecording: () => void;
}

const initialState: RecordingState = {
  isRecording: false,
  isPaused: false,
  positions: [],
  duration: 0,
  distance: 0,
  elevation: 0,
  currentPace: 0,
  averagePace: 0,
};

export const useRecordingStore = create<RecordingStore>((set, get) => ({
  ...initialState,

  startRecording: () => set({ isRecording: true, isPaused: false }),

  pauseRecording: () => set({ isPaused: true }),

  resumeRecording: () => set({ isPaused: false }),

  stopRecording: () => set({ isRecording: false }),

  addPosition: (position) => {
    const state = get();
    if (!state.isRecording || state.isPaused) return;

    const positions = [...state.positions, position];
    const newDistance = calculateTotalDistance(positions);
    const elevation = calculateElevationGain(positions);
    const duration = positions.length > 1 
      ? (position.timestamp - positions[0].timestamp) / 1000 
      : 0;
    const averagePace = duration > 0 ? (newDistance / (duration / 3600)) : 0;

    set({
      positions,
      distance: newDistance,
      elevation,
      duration,
      averagePace,
    });
  },

  resetRecording: () => set(initialState),
}));

function calculateTotalDistance(positions: GeoPosition[]): number {
  if (positions.length < 2) return 0;

  let total = 0;
  for (let i = 1; i < positions.length; i++) {
    total += haversineDistance(
      positions[i - 1].latitude,
      positions[i - 1].longitude,
      positions[i].latitude,
      positions[i].longitude
    );
  }
  return total;
}

function calculateElevationGain(positions: GeoPosition[]): number {
  if (positions.length < 2) return 0;

  let gain = 0;
  for (let i = 1; i < positions.length; i++) {
    const prevAlt = positions[i - 1].altitude || 0;
    const currAlt = positions[i].altitude || 0;
    if (currAlt > prevAlt) {
      gain += currAlt - prevAlt;
    }
  }
  return gain;
}

function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180);
}
