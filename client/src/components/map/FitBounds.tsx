import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import type { LatLngBoundsExpression } from 'leaflet';

interface FitBoundsProps {
  bounds: LatLngBoundsExpression;
  padding?: [number, number];
}

export function FitBounds({ bounds, padding = [20, 20] }: FitBoundsProps) {
  const map = useMap();

  useEffect(() => {
    map.fitBounds(bounds, { padding });
  }, [map, bounds, padding]);

  return null;
}
