import React from 'react';
import { useMap } from './MapContainer';
import { Plus, Minus, Compass, Layers, Locate } from 'lucide-react';

interface MapControlsProps {
  onLocate?: () => void;
  showLayerToggle?: boolean;
  className?: string;
}

export const MapControls: React.FC<MapControlsProps> = ({
  onLocate,
  showLayerToggle = true,
  className = '',
}) => {
  const { map, isLoaded } = useMap();
  const [mapStyle, setMapStyle] = React.useState<'dark' | 'satellite'>('dark');

  const handleZoomIn = () => {
    if (map) {
      map.zoomIn({ duration: 300 });
    }
  };

  const handleZoomOut = () => {
    if (map) {
      map.zoomOut({ duration: 300 });
    }
  };

  const handleResetBearing = () => {
    if (map) {
      map.resetNorthPitch({ duration: 300 });
    }
  };

  const toggleMapStyle = () => {
    if (!map) return;
    
    const newStyle = mapStyle === 'dark' ? 'satellite' : 'dark';
    setMapStyle(newStyle);
    
    map.setStyle(
      newStyle === 'dark' 
        ? 'mapbox://styles/mapbox/dark-v11'
        : 'mapbox://styles/mapbox/satellite-streets-v12',
      { diff: false }
    );
  };

  if (!isLoaded) return null;

  return (
    <div className={`absolute flex flex-col gap-2 ${className}`}>
      <div className="flex flex-col bg-surface-dark/95 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden shadow-lg">
        <button
          onClick={handleZoomIn}
          className="w-10 h-10 flex items-center justify-center text-white hover:bg-white/10 active:bg-white/20 transition-colors border-b border-white/10"
          title="Zoom In"
        >
          <Plus className="w-5 h-5" />
        </button>
        <button
          onClick={handleZoomOut}
          className="w-10 h-10 flex items-center justify-center text-white hover:bg-white/10 active:bg-white/20 transition-colors"
          title="Zoom Out"
        >
          <Minus className="w-5 h-5" />
        </button>
      </div>

      <button
        onClick={handleResetBearing}
        className="w-10 h-10 flex items-center justify-center bg-surface-dark/95 backdrop-blur-md border border-white/10 rounded-xl text-white hover:bg-white/10 active:bg-white/20 transition-colors shadow-lg"
        title="Reset Compass"
      >
        <Compass className="w-5 h-5" />
      </button>

      {showLayerToggle && (
        <button
          onClick={toggleMapStyle}
          className="w-10 h-10 flex items-center justify-center bg-surface-dark/95 backdrop-blur-md border border-white/10 rounded-xl text-white hover:bg-white/10 active:bg-white/20 transition-colors shadow-lg"
          title="Toggle Map Style"
        >
          <Layers className="w-5 h-5" />
        </button>
      )}

      {onLocate && (
        <button
          onClick={onLocate}
          className="w-10 h-10 flex items-center justify-center bg-primary text-background-dark rounded-full shadow-lg hover:bg-primary-dim active:scale-95 transition-all"
          title="My Location"
        >
          <Locate className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};