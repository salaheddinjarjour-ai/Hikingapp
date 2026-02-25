import React, { useState, useMemo, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MapContainer, TrailPath } from '@/components/map';
import { Button, Badge, MetricCard } from '@/components/ui';
import { getTrailById } from '@/data/sampleTrails';
import { mockWeather } from '@/utils/mockData';
import { formatDistance, formatDuration, formatElevation, getDifficultyColor } from '@/utils/formatUtils';
import { getBoundsFromCoordinates } from '@/utils/geoUtils';
import { 
  MapPin, Clock, Star, Mountain, Cloud, Wind, Droplets, 
  ChevronLeft, ChevronRight, Heart, Share, Navigation, Play
} from 'lucide-react'; 

export const TrailDetailScreen: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const trail = useMemo(() => getTrailById(id || '1'), [id]);
  const [isSaved, setIsSaved] = useState(trail?.isSaved ?? false);
  const [activeTab, setActiveTab] = useState<'overview' | 'map' | 'elevation'>('overview');

  const handleStartTrail = useCallback(() => {
    if (trail) {
      localStorage.setItem('selectedTrailId', trail.id);
      navigate('/record');
    }
  }, [trail, navigate]);

  const handleSaveTrail = useCallback(() => {
    setIsSaved(prev => !prev);
    if (trail) {
      try {
        const savedTrailIds = JSON.parse(localStorage.getItem('savedTrailIds') || '[]');
        if (isSaved) {
          const index = savedTrailIds.indexOf(trail.id);
          if (index > -1) {
            savedTrailIds.splice(index, 1);
          }
        } else {
          savedTrailIds.push(trail.id);
        }
        localStorage.setItem('savedTrailIds', JSON.stringify(savedTrailIds));
      } catch (e) {
        console.error('Failed to save trail:', e);
      }
    }
  }, [trail, isSaved]);

  if (!trail) {
    return (
      <div className="flex h-screen items-center justify-center bg-background-dark">
        <div className="text-center">
          <span className="material-symbols-outlined text-5xl text-gray-500 mb-4">error</span>
          <p className="text-gray-400">Trail not found</p>
          <button 
            onClick={() => navigate('/')}
            className="mt-4 text-primary"
          >
            Go back to Explore
          </button>
        </div>
      </div>
    );
  }

  const bounds = getBoundsFromCoordinates(trail.coordinates);

  return (
    <div className="flex flex-col h-full bg-background-dark">
      <div className="relative h-64 shrink-0">
        <img 
          src={trail.image} 
          alt={trail.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-transparent to-transparent" />
        
        <button
          onClick={() => navigate(-1)}
          className="absolute top-14 left-4 flex items-center justify-center w-10 h-10 rounded-full bg-black/50 backdrop-blur-md text-white"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <div className="absolute top-14 right-4 flex gap-2">
          <button 
            onClick={handleSaveTrail}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-black/50 backdrop-blur-md text-white"
          >
            <Heart className={`w-5 h-5 ${isSaved ? 'fill-primary text-primary' : ''}`} />
          </button>
          <button className="flex items-center justify-center w-10 h-10 rounded-full bg-black/50 backdrop-blur-md text-white">
            <Share className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto -mt-8 relative z-10">
        <div className="bg-background-dark rounded-t-3xl">
          <div className="px-4 pt-6 pb-4">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-2xl font-bold text-white mb-1">{trail.name}</h1>
                <div className="flex items-center gap-2 text-gray-400">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">{trail.location.region}</span>
                </div>
              </div>
              <div className="flex items-center gap-1 bg-white/10 px-2 py-1 rounded-lg">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="text-white font-bold">{trail.rating}</span>
                <span className="text-gray-400 text-sm">({trail.reviewCount})</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider border ${getDifficultyColor(trail.difficulty)}`}>
                {trail.difficulty}
              </span>
              {trail.terrain.map(t => (
                <span key={t} className="text-xs font-medium px-3 py-1 rounded-full bg-white/10 text-gray-300 capitalize">
                  {t}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-3 mb-6">
              <MetricCard 
                icon={<Mountain className="w-5 h-5" />}
                value={formatDistance(trail.distance)}
                label="Distance"
              />
              <MetricCard 
                icon={<ChevronRight className="w-5 h-5 -rotate-45" />}
                value={formatElevation(trail.elevation)}
                label="Elevation"
              />
              <MetricCard 
                icon={<Clock className="w-5 h-5" />}
                value={formatDuration(trail.estimatedTime * 60)}
                label="Est. Time"
              />
            </div>

            <div className="flex border-b border-white/10 mb-4">
              {(['overview', 'map', 'elevation'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-3 text-sm font-medium capitalize ${
                    activeTab === tab 
                      ? 'text-primary border-b-2 border-primary' 
                      : 'text-gray-400'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {activeTab === 'overview' && (
            <div className="px-4 pb-8">
              <div className="card p-4 mb-6">
                <h3 className="text-white font-bold mb-3 flex items-center gap-2">
                  <Cloud className="w-5 h-5 text-primary" />
                  Current Weather
                </h3>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl">
                      {mockWeather.condition === 'sunny' ? '☀️' : '⛅'}
                    </span>
                    <div>
                      <span className="text-3xl font-bold text-white">{mockWeather.temperature}°</span>
                      <span className="text-gray-400 ml-2">Feels like {mockWeather.feelsLike}°</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-4 text-sm text-gray-400">
                  <span className="flex items-center gap-1">
                    <Wind className="w-4 h-4" />
                    {mockWeather.windSpeed} km/h {mockWeather.windDirection}
                  </span>
                  <span className="flex items-center gap-1">
                    <Droplets className="w-4 h-4" />
                    {mockWeather.humidity}%
                  </span>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-white font-bold mb-2">About this trail</h3>
                <p className="text-gray-400 leading-relaxed">{trail.description}</p>
              </div>

              <div className="mb-6">
                <h3 className="text-white font-bold mb-3">Trail Highlights</h3>
                <div className="space-y-3">
                  {trail.terrain.includes('forest') && (
                    <div className="flex items-center gap-3 text-gray-300">
                      <span className="material-symbols-outlined text-primary">park</span>
                      <span className="text-sm">Scenic forest views</span>
                    </div>
                  )}
                  {trail.terrain.includes('mountain') && (
                    <div className="flex items-center gap-3 text-gray-300">
                      <span className="material-symbols-outlined text-primary">terrain</span>
                      <span className="text-sm">Mountain panoramas</span>
                    </div>
                  )}
                  {trail.difficulty !== 'easy' && (
                    <div className="flex items-center gap-3 text-gray-300">
                      <span className="material-symbols-outlined text-primary">fitness_center</span>
                      <span className="text-sm">Challenging elevation gain</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'map' && (
            <div className="px-4 pb-8">
              <div className="h-64 rounded-xl overflow-hidden border border-white/10 mb-4">
                <MapContainer
                  bounds={bounds}
                  className="absolute inset-0"
                  showControls={false}
                >
                  <TrailPath
                    coordinates={trail.coordinates}
                    color="#13ec25"
                    width={4}
                  />
                </MapContainer>
              </div>
              <div className="flex gap-2">
                <button className="flex-1 py-2 px-3 bg-surface-dark rounded-xl text-sm text-white flex items-center justify-center gap-2">
                  <Navigation className="w-4 h-4" />
                  Get Directions
                </button>
                <button className="flex-1 py-2 px-3 bg-surface-dark rounded-xl text-sm text-white flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined text-base">download</span>
                  Download Offline
                </button>
              </div>
            </div>
          )}

          {activeTab === 'elevation' && (
            <div className="px-4 pb-8">
              <div className="h-48 bg-surface-dark rounded-xl p-4 mb-4">
                <div className="flex items-end h-full gap-1">
                  {trail.elevationProfile.map((point, index) => {
                    const maxElev = Math.max(...trail.elevationProfile.map(p => p.elevation));
                    const minElev = Math.min(...trail.elevationProfile.map(p => p.elevation));
                    const heightPercent = ((point.elevation - minElev) / (maxElev - minElev)) * 100;
                    return (
                      <div
                        key={index}
                        className="flex-1 bg-gradient-to-t from-primary/60 to-primary rounded-t"
                        style={{ height: `${Math.max(heightPercent, 5)}%` }}
                      />
                    );
                  })}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-surface-dark rounded-xl p-3">
                  <p className="text-gray-400 text-xs mb-1">Max Elevation</p>
                  <p className="text-white font-bold">
                    {Math.max(...trail.elevationProfile.map(p => p.elevation)).toLocaleString()} m
                  </p>
                </div>
                <div className="bg-surface-dark rounded-xl p-3">
                  <p className="text-gray-400 text-xs mb-1">Min Elevation</p>
                  <p className="text-white font-bold">
                    {Math.min(...trail.elevationProfile.map(p => p.elevation)).toLocaleString()} m
                  </p>
                </div>
                <div className="bg-surface-dark rounded-xl p-3">
                  <p className="text-gray-400 text-xs mb-1">Elevation Gain</p>
                  <p className="text-white font-bold">{trail.elevation.toLocaleString()} m</p>
                </div>
                <div className="bg-surface-dark rounded-xl p-3">
                  <p className="text-gray-400 text-xs mb-1">Avg Grade</p>
                  <p className="text-white font-bold">
                    {((trail.elevation / trail.distance) * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="sticky bottom-0 bg-background-dark border-t border-white/5 p-4">
          <Button onClick={handleStartTrail} className="w-full">
            <Navigation className="w-5 h-5 mr-2" />
            Start Trail
          </Button>
        </div>
      </div>
    </div>
  );
};
