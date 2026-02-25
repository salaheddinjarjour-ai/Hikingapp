import type { GeoPosition } from '@/types';

export function calculateDistance(coord1: [number, number], coord2: [number, number]): number {
  const R = 6371;
  const dLat = toRad(coord2[1] - coord1[1]);
  const dLon = toRad(coord2[0] - coord1[0]);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(coord1[1])) * Math.cos(toRad(coord2[1])) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c * 1000;
}

export function calculateTotalDistance(positions: [number, number][] | GeoPosition[]): number {
  if (positions.length < 2) return 0;

  let total = 0;
  for (let i = 1; i < positions.length; i++) {
    const prev = Array.isArray(positions[i - 1])
      ? positions[i - 1] as [number, number]
      : [(positions[i - 1] as GeoPosition).longitude, (positions[i - 1] as GeoPosition).latitude] as [number, number];
    
    const curr = Array.isArray(positions[i])
      ? positions[i] as [number, number]
      : [(positions[i] as GeoPosition).longitude, (positions[i] as GeoPosition).latitude] as [number, number];
    
    total += calculateDistance(prev, curr);
  }
  return total;
}

export function calculateBearing(start: [number, number], end: [number, number]): number {
  const dLon = toRad(end[0] - start[0]);
  const lat1 = toRad(start[1]);
  const lat2 = toRad(end[1]);

  const x = Math.sin(dLon) * Math.cos(lat2);
  const y = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);

  let bearing = (toDeg * Math.atan2(x, y) + 360) % 360;
  return bearing;
}

const toDeg = 180 / Math.PI;

export function calculateElevationGain(elevations: number[]): number {
  if (elevations.length < 2) return 0;

  let gain = 0;
  for (let i = 1; i < elevations.length; i++) {
    const diff = elevations[i] - elevations[i - 1];
    if (diff > 0) {
      gain += diff;
    }
  }
  return gain;
}

export function calculatePace(distanceMeters: number, durationSeconds: number): number {
  if (durationSeconds === 0 || distanceMeters === 0) return 0;
  
  const distanceKm = distanceMeters / 1000;
  const durationHours = durationSeconds / 3600;
  
  return distanceKm / durationHours;
}

export function formatPaceFromSpeed(speedKmH: number): string {
  if (speedKmH === 0) return '--:--';
  
  const minPerKm = 60 / speedKmH;
  const mins = Math.floor(minPerKm);
  const secs = Math.round((minPerKm - mins) * 60);
  
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function toRad(deg: number): number {
  return deg * (Math.PI / 180);
}

export function formatCoordinate(coord: number, type: 'lat' | 'lng'): string {
  const absolute = Math.abs(coord);
  const degrees = Math.floor(absolute);
  const minutes = Math.floor((absolute - degrees) * 60);
  const seconds = ((absolute - degrees - minutes / 60) * 3600).toFixed(1);
  
  const direction = type === 'lat'
    ? coord >= 0 ? 'N' : 'S'
    : coord >= 0 ? 'E' : 'W';
  
  return `${degrees}°${minutes}'${seconds}"${direction}`;
}

export function getBoundsFromCoordinates(coordinates: [number, number][]): [[number, number], [number, number]] {
  if (coordinates.length === 0) {
    return [[-180, -90], [180, 90]];
  }

  let minLng = coordinates[0][0];
  let maxLng = coordinates[0][0];
  let minLat = coordinates[0][1];
  let maxLat = coordinates[0][1];

  for (const coord of coordinates) {
    minLng = Math.min(minLng, coord[0]);
    maxLng = Math.max(maxLng, coord[0]);
    minLat = Math.min(minLat, coord[1]);
    maxLat = Math.max(maxLat, coord[1]);
  }

  const padding = 0.01;
  return [
    [minLng - padding, minLat - padding],
    [maxLng + padding, maxLat + padding],
  ];
}

export function generateMockCoordinates(
  start: [number, number],
  numPoints: number,
  spreadKm: number = 5
): [number, number][] {
  const coordinates: [number, number][] = [start];
  const kmPerDegree = 111;
  const spreadDegrees = spreadKm / kmPerDegree;

  for (let i = 1; i < numPoints; i++) {
    const prev = coordinates[i - 1];
    const angle = Math.random() * Math.PI * 2;
    const distance = (Math.random() * spreadDegrees) / numPoints;
    
    coordinates.push([
      prev[0] + Math.cos(angle) * distance,
      prev[1] + Math.sin(angle) * distance,
    ]);
  }

  return coordinates;
}
