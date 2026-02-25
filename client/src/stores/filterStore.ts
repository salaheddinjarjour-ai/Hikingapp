import { create } from 'zustand';
import type { FilterOptions, Difficulty, TerrainType } from '@/types';

interface FilterStore extends FilterOptions {
  setDifficulty: (difficulty: Difficulty[]) => void;
  setTerrain: (terrain: TerrainType[]) => void;
  updateTerrain: (terrain: TerrainType[]) => void;
  setDistance: (distance: [number, number]) => void;
  setElevation: (elevation: [number, number]) => void;
  setEstimatedTime: (time: [number, number]) => void;
  resetFilters: () => void;
}

const defaultFilters: FilterOptions = {
  difficulty: [],
  terrain: [],
  distance: [0, 50],
  elevation: [0, 5000],
  estimatedTime: [0, 480],
};

export const useFilterStore = create<FilterStore>((set) => ({
  ...defaultFilters,

  setDifficulty: (difficulty) => set({ difficulty }),
  updateTerrain: (terrain) => set({ terrain }),
  setDistance: (distance) => set({ distance }),
  setElevation: (elevation) => set({ elevation }),
  setEstimatedTime: (estimatedTime) => set({ estimatedTime }),
  resetFilters: () => set(defaultFilters),
}));
