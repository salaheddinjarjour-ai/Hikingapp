import { useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import { useMap } from './MapContainer';

interface TrailPathProps {
  coordinates: [number, number][];
  color?: string;
  width?: number;
  animate?: boolean;
  sourceId?: string;
}

export const TrailPath: React.FC<TrailPathProps> = ({
  coordinates,
  color = '#13ec25',
  width = 4,
  animate = false,
  sourceId = 'trail-path',
}) => {
  const { map, isLoaded } = useMap();

  useEffect(() => {
    if (!map || !isLoaded || coordinates.length < 2) return;

    const addTrailPath = () => {
      if (map.getLayer(`${sourceId}-layer`)) {
        map.removeLayer(`${sourceId}-layer`);
      }
      if (map.getSource(sourceId)) {
        map.removeSource(sourceId);
      }

      const geoJson = {
        type: 'Feature' as const,
        properties: {},
        geometry: {
          type: 'LineString' as const,
          coordinates: coordinates,
        },
      };

      map.addSource(sourceId, {
        type: 'geojson',
        data: geoJson,
      });

      map.addLayer({
        id: `${sourceId}-layer`,
        type: 'line',
        source: sourceId,
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': color,
          'line-width': width,
          'line-opacity': 1,
          ...(animate && {
            'line-dasharray': [0, 4, 3],
          }),
        },
      });

      if (coordinates.length > 0) {
        const startCoord = coordinates[0];
        new mapboxgl.Marker({ color: '#13ec25' })
          .setLngLat(startCoord)
          .addTo(map);

        const endCoord = coordinates[coordinates.length - 1];
        if (endCoord !== startCoord) {
          new mapboxgl.Marker({ color: '#ef4444' })
            .setLngLat(endCoord)
            .addTo(map);
        }
      }
    };

    if (map.isStyleLoaded()) {
      addTrailPath();
    } else {
      map.on('style.load', addTrailPath);
    }

    return () => {
      if (map.getLayer(`${sourceId}-layer`)) {
        map.removeLayer(`${sourceId}-layer`);
      }
      if (map.getSource(sourceId)) {
        map.removeSource(sourceId);
      }
    };
  }, [map, isLoaded, coordinates, color, width, animate, sourceId]);

  return null;
};

interface TrailMarkerProps {
  coordinates: [number, number];
  label?: string;
  color?: string;
  onClick?: () => void;
}

export const TrailMarker: React.FC<TrailMarkerProps> = ({
  coordinates,
  label,
  color = '#13ec25',
  onClick,
}) => {
  const { map, isLoaded } = useMap();

  useEffect(() => {
    if (!map || !isLoaded) return;

    const el = document.createElement('div');
    el.className = 'trail-marker';
    el.style.width = '24px';
    el.style.height = '24px';
    el.style.borderRadius = '50%';
    el.style.backgroundColor = color;
    el.style.border = '2px solid white';
    el.style.cursor = onClick ? 'pointer' : 'default';
    el.style.boxShadow = `0 0 10px ${color}`;

    if (label) {
      el.title = label;
    }

    if (onClick) {
      el.addEventListener('click', onClick);
    }

    const marker = new mapboxgl.Marker(el)
      .setLngLat(coordinates)
      .addTo(map);

    return () => {
      marker.remove();
    };
  }, [map, isLoaded, coordinates, label, color, onClick]);

  return null;
};
