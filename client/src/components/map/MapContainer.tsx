import { MapContainer as LeafletMap, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import { ReactNode } from 'react';

import icon from 'leaflet/dist/images/marker-icon.png';
import iconRetina from 'leaflet/dist/images/marker-icon-2x.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: icon,
  iconRetinaUrl: iconRetina,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

interface MapContainerProps {
  center?: [number, number];
  zoom?: number;
  children?: ReactNode;
  className?: string;
}

export function MapContainer({
  center = [46.8182, 8.2275],
  zoom = 13,
  children,
  className = 'h-full w-full z-0',
}: MapContainerProps) {
  return (
    <LeafletMap
      center={center}
      zoom={zoom}
      className={className}
      zoomControl={false}
      attributionControl={false}
    >
      <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
      {children}
    </LeafletMap>
  );
}

export function useLeafletMap() {
  return useMap();
}
