export const DEFAULT_MAP_CENTER: [number, number] = [-119.4194, 37.9658]; // Yosemite
export const DEFAULT_MAP_ZOOM = 11;

export const TRAIL_DIFFICULTIES = ['easy', 'moderate', 'hard', 'expert'] as const;
export const TERRAIN_TYPES = ['forest', 'mountain', 'coastal', 'desert', 'alpine'] as const;

export const ACTIVITY_TYPES = [
  { id: 'hiking', name: 'Hiking', icon: 'hiking' },
  { id: 'trail_running', name: 'Trail Running', icon: 'directions_run' },
  { id: 'mountaineering', name: 'Mountaineering', icon: 'terrain' },
  { id: 'off_road', name: 'Off-Road', icon: 'pedestrian_bike' },
  { id: 'cycling', name: 'Cycling', icon: 'pedestrian_bike' },
] as const;

export const GEAR_CATEGORIES = [
  { id: 'clothing', name: 'Clothing', icon: 'checkroom' },
  { id: 'footwear', name: 'Footwear', icon: 'hiking' },
  { id: 'navigation', name: 'Navigation', icon: 'explore' },
  { id: 'safety', name: 'Safety', icon: 'health_and_safety' },
  { id: 'food', name: 'Food', icon: 'restaurant' },
  { id: 'water', name: 'Water', icon: 'water_drop' },
  { id: 'shelter', name: 'Shelter', icon: 'cabin' },
  { id: 'other', name: 'Other', icon: 'inventory_2' },
] as const;

export const STORAGE_KEYS = {
  AUTH: 'trailsense-auth',
  TRAILS: 'trailsense-trails',
  RECORDING: 'trailsense-recording',
  FILTERS: 'trailsense-filters',
};

export const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';
