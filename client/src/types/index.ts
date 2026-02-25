export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  activities: ActivityType[];
  stats: UserStats;
  achievements: Achievement[];
  createdAt: string;
}

export interface UserStats {
  totalDistance: number;
  totalElevation: number;
  totalTime: number;
  totalActivities: number;
  longestTrail: number;
  highestElevation: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt: string;
}

export type ActivityType = 'hiking' | 'trail_running' | 'mountaineering' | 'off_road' | 'cycling';

export interface Trail {
  id: string;
  name: string;
  description: string;
  image: string;
  location: TrailLocation;
  difficulty: Difficulty;
  distance: number;
  elevation: number;
  estimatedTime: number;
  coordinates: [number, number][];
  terrain: TerrainType[];
  rating: number;
  reviewCount: number;
  isSaved: boolean;
}

export interface TrailLocation {
  region: string;
  coordinates: [number, number];
}

export type Difficulty = 'easy' | 'moderate' | 'hard' | 'expert';
export type TerrainType = 'forest' | 'mountain' | 'coastal' | 'desert' | 'alpine';

export interface Activity {
  id: string;
  trail?: Trail;
  name: string;
  type: ActivityType;
  startTime: string;
  endTime: string;
  duration: number;
  distance: number;
  elevation: number;
  coordinates: [number, number][];
  calories: number;
  averagePace: number;
  maxPace: number;
}

export interface GearItem {
  id: string;
  name: string;
  category: GearCategory;
  weight: number;
  packed: boolean;
}

export type GearCategory = 'clothing' | 'footwear' | 'navigation' | 'safety' | 'food' | 'water' | 'shelter' | 'other';

export interface WeatherData {
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  windDirection: string;
  condition: WeatherCondition;
  forecast: WeatherForecast[];
}

export type WeatherCondition = 'sunny' | 'cloudy' | 'rainy' | 'snowy' | 'foggy' | 'stormy';

export interface WeatherForecast {
  time: string;
  temperature: number;
  condition: WeatherCondition;
  precipitation: number;
}

export interface FilterOptions {
  difficulty: Difficulty[];
  terrain: TerrainType[];
  distance: [number, number];
  elevation: [number, number];
  estimatedTime: [number, number];
}

export interface GeoPosition {
  latitude: number;
  longitude: number;
  altitude?: number;
  accuracy?: number;
  timestamp: number;
}

export interface RecordingState {
  isRecording: boolean;
  isPaused: boolean;
  positions: GeoPosition[];
  duration: number;
  distance: number;
  elevation: number;
  currentPace: number;
  averagePace: number;
}
