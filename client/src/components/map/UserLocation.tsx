import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { useMap } from './MapContainer';
import type { GeoPosition } from '@/types';

interface UserLocationProps {
  position: GeoPosition | null;
  showAccuracy?: boolean;
  followUser?: boolean;
  color?: string;
}

export const UserLocation: React.FC<UserLocationProps> = ({
  position,
  showAccuracy = true,
  followUser = false,
  color = '#3b82f6',
}) => {
  const { map, isLoaded } = useMap();
  const markerRef = useRef<mapboxgl.Marker | null>(null);
  const accuracyCircleRef = useRef<mapboxgl.GeoJSONSource | null>(null);

  useEffect(() => {
    if (!map || !isLoaded || !position) return;

    const el = document.createElement('div');
    el.className = 'user-location-marker';
    el.innerHTML = `
      <div class="relative">
        <div class="absolute inset-0 rounded-full animate-ping opacity-75" style="background-color: ${color}; width: 32px; height: 32px; margin: -4px;"></div>
        <div class="relative rounded-full border-2 border-white" style="background-color: ${color}; width: 24px; height: 24px;"></div>
      </div>
    `;

    if (markerRef.current) {
      markerRef.current.remove();
    }

    markerRef.current = new mapboxgl.Marker(el)
      .setLngLat([position.longitude, position.latitude])
      .addTo(map);

    if (showAccuracy && position.accuracy) {
      const accuracyId = 'user-accuracy-circle';
      
      if (map.getLayer(accuracyId)) {
        map.removeLayer(accuracyId);
      }
      if (map.getSource(accuracyId)) {
        map.removeSource(accuracyId);
      }

      map.addSource(accuracyId, {
        type: 'geojson',
        data: {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [position.longitude, position.latitude],
          },
          properties: {
            radius: position.accuracy,
          },
        },
      });

      map.addLayer({
        id: accuracyId,
        type: 'circle',
        source: accuracyId,
        paint: {
          'circle-radius': {
            stops: [[0, 0], [20, position.accuracy]],
            base: 2,
          },
          'circle-color': color,
          'circle-opacity': 0.15,
          'circle-stroke-color': color,
          'circle-stroke-opacity': 0.3,
          'circle-stroke-width': 1,
        },
      });

      accuracyCircleRef.current = map.getSource(accuracyId) as mapboxgl.GeoJSONSource;
    }

    if (followUser) {
      map.flyTo({
        center: [position.longitude, position.latitude],
        zoom: 16,
        duration: 1000,
      });
    }

    return () => {
      if (markerRef.current) {
        markerRef.current.remove();
        markerRef.current = null;
      }
      const accuracyId = 'user-accuracy-circle';
      if (map.getLayer(accuracyId)) {
        map.removeLayer(accuracyId);
      }
      if (map.getSource(accuracyId)) {
        map.removeSource(accuracyId);
      }
    };
  }, [map, isLoaded, position, showAccuracy, followUser, color]);

  return null;
};

interface UserLocationPulsingDotProps {
  coordinates: [number, number];
  size?: number;
  color?: string;
}

export const UserLocationPulsingDot: React.FC<UserLocationPulsingDotProps> = ({
  coordinates,
  size = 20,
  color = '#3b82f6',
}) => {
  const { map, isLoaded } = useMap();
  const markerRef = useRef<mapboxgl.Marker | null>(null);

  useEffect(() => {
    if (!map || !isLoaded) return;

    const el = document.createElement('div');
    el.style.width = `${size}px`;
    el.style.height = `${size}px`;
    el.style.borderRadius = '50%';
    el.style.backgroundColor = color;
    el.style.border = '3px solid white';
    el.style.boxShadow = `0 0 0 0 ${color}`;
    el.style.animation = 'pulse 2s infinite';
    el.style.cursor = 'pointer';

    markerRef.current = new mapboxgl.Marker(el)
      .setLngLat(coordinates)
      .addTo(map);

    return () => {
      if (markerRef.current) {
        markerRef.current.remove();
      }
    };
  }, [map, isLoaded, coordinates, size, color]);

  return null;
};
