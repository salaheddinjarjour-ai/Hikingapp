import { Polyline, Marker } from 'react-leaflet';
import L from 'leaflet';

interface TrailPathProps {
  positions: [number, number][];
  color?: string;
  weight?: number;
}

export function TrailPath({
  positions,
  color = '#13ec25',
  weight = 4,
}: TrailPathProps) {
  if (!positions || positions.length === 0) return null;

  const startIcon = L.divIcon({
    className: 'trail-marker start',
    html: `<div style="
      width: 14px; height: 14px;
      background: #13ec25;
      border: 3px solid white;
      border-radius: 50%;
      box-shadow: 0 0 10px rgba(19,236,37,0.8);
    "></div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
  });

  const endIcon = L.divIcon({
    className: 'trail-marker end',
    html: `<div style="
      width: 14px; height: 14px;
      background: #f97316;
      border: 3px solid white;
      border-radius: 50%;
      box-shadow: 0 0 10px rgba(249,115,22,0.8);
    "></div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
  });

  return (
    <>
      <Polyline
        positions={positions}
        pathOptions={{
          color,
          weight,
          opacity: 0.9,
          lineCap: 'round',
          lineJoin: 'round',
        }}
      />
      {positions.length > 0 && (
        <Marker position={positions[0]} icon={startIcon} />
      )}
      {positions.length > 1 && (
        <Marker position={positions[positions.length - 1]} icon={endIcon} />
      )}
    </>
  );
}
