import { Marker, Circle } from 'react-leaflet';
import L from 'leaflet';
import { useGeolocation } from '@/hooks/useGeolocation';

export function UserLocation() {
  const { position } = useGeolocation();

  if (!position) return null;

  const lat = position.latitude;
  const lng = position.longitude;
  const accuracy = position.accuracy ?? 0;

  const userIcon = L.divIcon({
    className: 'user-location',
    html: `
      <div style="
        width: 20px; height: 20px;
        background: #3b82f6;
        border: 4px solid white;
        border-radius: 50%;
        box-shadow: 0 0 15px rgba(59,130,246,0.8);
        animation: pulse 2s infinite;
      "></div>
      <style>
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.3); opacity: 0.7; }
        }
      </style>
    `,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });

  return (
    <>
      {accuracy > 0 && (
        <Circle
          center={[lat, lng]}
          radius={accuracy}
          pathOptions={{
            color: '#3b82f6',
            fillColor: '#3b82f6',
            fillOpacity: 0.1,
            weight: 1,
          }}
        />
      )}
      <Marker position={[lat, lng]} icon={userIcon} />
    </>
  );
}
