import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { TopAppBar } from '@/components/layout';
import { Button, Badge, MetricCard } from '@/components/ui';
import { mockTrails, mockWeather } from '@/utils/mockData';
import { formatDistance, formatDuration, formatElevation, formatDate, getDifficultyColor } from '@/utils/formatUtils';
import {
  MapPin, Clock, Star, Mountain, Cloud, Wind, Droplets,
  ChevronLeft, ChevronRight, Heart, Share, Navigation
} from 'lucide-react';

export const TrailDetailScreen: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const trail = mockTrails.find(t => t.id === id) || mockTrails[0];
  const [isSaved, setIsSaved] = useState(trail.isSaved);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  return (
    <div className="flex flex-col h-full bg-background-dark">
      {/* Header Image */}
      <div className="relative h-64 shrink-0">
        <img 
          src={trail.image} 
          alt={trail.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-transparent to-transparent" />
        
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-14 left-4 flex items-center justify-center w-10 h-10 rounded-full bg-black/50 backdrop-blur-md text-white"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Actions */}
        <div className="absolute top-14 right-4 flex gap-2">
          <button 
            onClick={() => setIsSaved(!isSaved)}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-black/50 backdrop-blur-md text-white"
          >
            <Heart className={`w-5 h-5 ${isSaved ? 'fill-primary text-primary' : ''}`} />
          </button>
          <button className="flex items-center justify-center w-10 h-10 rounded-full bg-black/50 backdrop-blur-md text-white">
            <Share className="w-5 h-5" />
          </button>
        </div>

        {/* Image pagination */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1">
          {[0].map((i) => (
            <span 
              key={i} 
              className={`w-2 h-2 rounded-full ${i === currentImageIndex ? 'bg-white' : 'bg-white/40'}`}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-8 -mt-8 relative z-10">
        {/* Title & Rating */}
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

        {/* Difficulty & Stats */}
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

        {/* Metrics */}
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

        {/* Weather Card */}
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

        {/* Description */}
        <div className="mb-6">
          <h3 className="text-white font-bold mb-2">About this trail</h3>
          <p className="text-gray-400 leading-relaxed">{trail.description}</p>
        </div>

        {/* Start Button */}
        <Button className="w-full">
          <Navigation className="w-5 h-5 mr-2" />
          Start Trail
        </Button>
      </div>
    </div>
  );
};
