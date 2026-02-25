import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Plus, Minus, Compass, Layers, Locate } from 'lucide-react';
import { useLeafletMap } from './MapContainer';

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
  const map = useLeafletMap();
  const [mapStyle, setMapStyle] = useState<'dark' | 'light'>('dark');
  const tileLayerRef = useRef<L.TileLayer | null>(null);

  const applyTileLayer = (url: string) => {
    if (!map) return;
    map.eachLayer((layer) => {
      if (layer instanceof L.TileLayer) {
        map.removeLayer(layer);
      }
    });
    tileLayerRef.current = L.tileLayer(url);
    tileLayerRef.current.addTo(map);
  };

  useEffect(() => {
    if (!map) return;
    if (mapStyle === 'dark') {
      applyTileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png');
    } else {
      applyTileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');
    }
  }, [map, mapStyle]);

  const handleZoomIn = () => {
    if (map) {
      map.zoomIn();
    }
  };

  const handleZoomOut = () => {
    if (map) {
      map.zoomOut();
    }
  };

  const handleResetBearing = () => {
    if (map) {
      map.setView(map.getCenter(), map.getZoom(), { animate: true });
    }
  };

  const toggleMapStyle = () => {
    setMapStyle((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

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
