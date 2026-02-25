import React from 'react';
import { MapPin, Clock, Star } from 'lucide-react';
import type { Trail } from '@/types';
import { formatDistance, formatDuration, getDifficultyColor } from '@/utils/formatUtils';

interface TrailCardProps {
  trail: Trail;
  onPress?: () => void;
  onNavigate?: () => void;
  className?: string;
}

export const TrailCard: React.FC<TrailCardProps> = ({ trail, onPress, onNavigate, className }) => {
  return (
    <div 
      className={`card flex gap-4 p-3 cursor-pointer active:scale-[0.98] transition-transform ${className}`}
      onClick={onPress}
    >
      <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 relative ring-1 ring-white/10">
        <img 
          src={trail.image} 
          alt={trail.name}
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>
      
      <div className="flex flex-col justify-center flex-1 min-w-0">
        <div className="flex justify-between items-start mb-1">
          <h3 className="text-white font-bold text-base leading-tight truncate pr-2">
            {trail.name}
          </h3>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border ${getDifficultyColor(trail.difficulty)}`}>
            {trail.difficulty}
          </span>
        </div>
        
        <div className="flex items-center gap-1 text-gray-400 text-xs mb-2">
          <MapPin className="w-3 h-3" />
          <span>{trail.location.region}</span>
        </div>
        
        <div className="flex items-center gap-4 text-gray-300 text-xs font-medium">
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-primary text-[16px]">hiking</span>
            {formatDistance(trail.distance)}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-primary" />
            {formatDuration(trail.estimatedTime * 60)}
          </span>
        </div>
      </div>

      {onNavigate && (
        <button 
          className="self-center p-2.5 rounded-full bg-white/5 hover:bg-white/10 text-primary border border-white/5 hover:border-primary/30 transition-all"
          onClick={(e) => {
            e.stopPropagation();
            onNavigate();
          }}
        >
          <span className="material-symbols-outlined text-xl">directions</span>
        </button>
      )}
    </div>
  );
};
