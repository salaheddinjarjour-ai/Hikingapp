import React, { useEffect, useRef, useState, createContext, useContext } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN || '';

interface MapContextValue {
  map: mapboxgl.Map | null;
  isLoaded: boolean;
}

const MapContext = createContext<MapContextValue>({ map: null, isLoaded: false });

export const useMap = () => useContext(MapContext);

interface MapContainerProps {
  center?: [number, number];
  zoom?: number;
  bounds?: mapboxgl.LngLatBoundsLike;
  children?: React.ReactNode;
  className?: string;
  showControls?: boolean;
  onMapLoad?: (map: mapboxgl.Map) => void;
}

export const MapContainer: React.FC<MapContainerProps> = ({
  center = [-122.4194, 37.7749],
  zoom = 12,
  bounds,
  children,
  className = '',
  showControls = true,
  onMapLoad,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: bounds ? undefined : center,
      zoom: bounds ? undefined : zoom,
      bounds: bounds,
      attributionControl: false,
      pitchWithRotate: false,
      dragRotate: false,
    });

    map.on('load', () => {
      setIsLoaded(true);
      onMapLoad?.(map);
    });

    map.on('error', (e) => {
      console.error('Map error:', e.error);
      setMapError('Failed to load map');
    });

    if (showControls) {
      map.addControl(new mapboxgl.NavigationControl({ showCompass: true, visualizePitch: false }), 'top-right');
    }

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (mapRef.current && isLoaded && center && !bounds) {
      mapRef.current.flyTo({ center, zoom, duration: 1000 });
    }
  }, [center, zoom, isLoaded, bounds]);

  if (mapError) {
    return (
      <div className={`flex items-center justify-center bg-surface-dark ${className}`}>
        <div className="text-center p-4">
          <span className="material-symbols-outlined text-4xl text-gray-500 mb-2">map</span>
          <p className="text-gray-400 text-sm">{mapError}</p>
        </div>
      </div>
    );
  }

  return (
    <MapContext.Provider value={{ map: mapRef.current, isLoaded }}>
      <div className={`relative ${className}`}>
        <div ref={mapContainerRef} className="absolute inset-0" />
        {isLoaded && children}
      </div>
    </MapContext.Provider>
  );
};
