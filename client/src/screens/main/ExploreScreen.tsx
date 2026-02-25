import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Marker } from 'react-leaflet';
import L from 'leaflet';
import { MapContainer, UserLocation, MapControls, TrailPath } from '@/components/map';
import { TrailCard } from '@/components/ui';
import { sampleTrails } from '@/data/sampleTrails';
import { useGeolocation } from '@/hooks';
import { Search, X } from 'lucide-react';
import type { Trail } from '@/types';

export const ExploreScreen: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [selectedTrail, setSelectedTrail] = useState<Trail | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>([37.7749, -122.4194]);
  const { position, error: geoError, isLoading: geoLoading } = useGeolocation();
  const trailCardRef = useRef<HTMLDivElement>(null);

  const filteredTrails = sampleTrails.filter(trail =>
    trail.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    trail.location.region.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    if (position && !geoLoading) {
      setMapCenter([position.latitude, position.longitude]);
    }
  }, [position, geoLoading]);

  const handleTrailPress = useCallback((trail: Trail) => {
    setSelectedTrail(trail);
    setMapCenter([trail.location.coordinates[1], trail.location.coordinates[0]]);
  }, []);

  const handleLocate = useCallback(() => {
    if (position) {
      setMapCenter([position.latitude, position.longitude]);
    }
  }, [position]);

  const handleStartRecording = useCallback(() => {
    navigate('/record');
  }, [navigate]);

  const handleClearSearch = useCallback(() => {
    setSearchQuery('');
    setSelectedTrail(null);
  }, []);

  const createTrailIcon = useCallback((color: string) => {
    return L.divIcon({
      className: 'trail-marker',
      html: `<div style="
        width: 20px; height: 20px;
        background: ${color};
        border: 3px solid white;
        border-radius: 50%;
        box-shadow: 0 0 10px ${color};
      "></div>`,
      iconSize: [20, 20],
      iconAnchor: [10, 10],
    });
  }, []);

  const selectedTrailPath = useMemo(() => {
    if (!selectedTrail) return [];
    return selectedTrail.coordinates.map(([lng, lat]) => [lat, lng] as [number, number]);
  }, [selectedTrail]);

  return (
    <div className="flex flex-col h-full bg-black">
      <MapContainer
        center={mapCenter}
        zoom={13}
        className="absolute inset-0 z-0"
      >
        <UserLocation />

        {filteredTrails.map((trail) => {
          const markerPosition: [number, number] = [
            trail.location.coordinates[1],
            trail.location.coordinates[0],
          ];
          const markerColor = selectedTrail?.id === trail.id ? '#13ec25' : '#22c55e';

          return (
            <Marker
              key={trail.id}
              position={markerPosition}
              icon={createTrailIcon(markerColor)}
              eventHandlers={{
                click: () => handleTrailPress(trail),
              }}
            />
          );
        })}

        {selectedTrailPath.length > 1 && (
          <TrailPath positions={selectedTrailPath} color="#13ec25" weight={4} />
        )}

        <MapControls
          onLocate={handleLocate}
          showLayerToggle={true}
          className="right-4 top-40 z-20"
        />
      </MapContainer>

      <div className="absolute top-0 left-0 right-0 z-20 pt-14 px-4 pb-6 bg-gradient-to-b from-black/90 via-black/60 to-transparent pointer-events-none">
        <div className="pointer-events-auto">
          <div className="flex items-center gap-3">
            <div className="flex-1 h-12 bg-surface-dark/95 backdrop-blur-md border border-white/20 rounded-full flex items-center px-4">
              <Search className="w-5 h-5 text-gray-400 mr-3" />
              <input
                className="bg-transparent border-none text-white placeholder-gray-400 text-sm w-full focus:ring-0 p-0 h-full font-medium"
                placeholder="Search trails..."
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
              />
              {searchQuery && (
                <button onClick={handleClearSearch} className="p-1">
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              )}
            </div>
          </div>

          {isSearchFocused && searchQuery && (
            <div className="mt-2 bg-surface-dark/95 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden max-h-64 overflow-y-auto">
              {filteredTrails.length > 0 ? (
                filteredTrails.map(trail => (
                  <button
                    key={trail.id}
                    className="w-full p-3 flex items-center gap-3 hover:bg-white/10 transition-colors text-left border-b border-white/5 last:border-b-0"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      handleTrailPress(trail);
                    }}
                  >
                    <img 
                      src={trail.image} 
                      alt={trail.name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <p className="text-white font-medium text-sm">{trail.name}</p>
                      <p className="text-gray-400 text-xs">{trail.location.region}</p>
                    </div>
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                      trail.difficulty === 'easy' ? 'bg-green-500/20 text-green-400' :
                      trail.difficulty === 'moderate' ? 'bg-yellow-500/20 text-yellow-400' :
                      trail.difficulty === 'hard' ? 'bg-orange-500/20 text-orange-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {trail.difficulty}
                    </span>
                  </button>
                ))
              ) : (
                <p className="p-4 text-gray-400 text-sm text-center">No trails found</p>
              )}
            </div>
          )}
        </div>
      </div>

      {geoError && (
        <div className="absolute bottom-48 left-4 right-4 z-20">
          <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-3">
            <p className="text-red-400 text-sm">{geoError}</p>
          </div>
        </div>
      )}

      <div className="absolute bottom-48 right-4 z-20">
        <button 
          className="bg-primary hover:bg-primary-dim text-black font-bold rounded-full h-14 pl-2 pr-6 flex items-center gap-3 shadow-[0_0_30px_rgba(0,255,65,0.4)] transition-all transform hover:scale-105 active:scale-95 border border-primary/50"
          onClick={handleStartRecording}
        >
          <div className="bg-black rounded-full size-10 flex items-center justify-center">
            <span className="material-symbols-outlined text-primary text-2xl">fiber_manual_record</span>
          </div>
          <span className="tracking-wide text-sm font-bold uppercase">Record</span>
        </button>
      </div>

      {selectedTrail && (
        <div 
          ref={trailCardRef}
          className="absolute bottom-32 left-1/2 transform -translate-x-1/2 bg-[#151515] border border-white/15 rounded-xl p-3 flex gap-4 w-[90%] max-w-sm shadow-2xl z-10"
        >
          <TrailCard 
            trail={selectedTrail} 
            onPress={() => navigate(`/trail/${selectedTrail.id}`)}
          />
          <button
            onClick={() => setSelectedTrail(null)}
            className="absolute -top-2 -right-2 w-6 h-6 bg-surface-dark rounded-full flex items-center justify-center border border-white/10"
          >
            <X className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      )}

      {!selectedTrail && !searchQuery && filteredTrails.length > 0 && (
        <div className="absolute bottom-32 left-0 right-0 z-10 px-4">
          <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
            {filteredTrails.slice(0, 3).map(trail => (
              <button
                key={trail.id}
                onClick={() => handleTrailPress(trail)}
                className="flex-shrink-0 bg-surface-dark/95 backdrop-blur-md border border-white/10 rounded-xl p-3 w-48"
              >
                <p className="text-white font-medium text-sm truncate">{trail.name}</p>
                <p className="text-gray-400 text-xs">{trail.location.region}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-primary text-xs font-bold">
                    {(trail.distance / 1000).toFixed(1)} km
                  </span>
                  <span className="text-gray-500">•</span>
                  <span className="text-gray-400 text-xs">
                    {trail.estimatedTime} min
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
