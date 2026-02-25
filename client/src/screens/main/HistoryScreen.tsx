import React from 'react';
import { TopAppBar } from '@/components/layout';
import { Badge } from '@/components/ui';
import { mockActivities } from '@/utils/mockData';
import { formatDistance, formatDuration, formatDate } from '@/utils/formatUtils';
import { Terrain, Calendar, Clock, Flame, TrendingUp } 

export const HistoryScreen: React.FC = () => {
  return (
    <div className="flex flex-col h-full bg-background-dark">
      <TopAppBar title="Activity History" />
      
      <div className="flex-1 overflow-y-auto px-4 pb-8">
        {/* Stats Summary */}
        <div className="card p-4 mb-4">
          <h3 className="text-white font-bold mb-3">This Month</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                <Terrain className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-white font-bold">87.2 km</p>
                <p className="text-gray-400 text-xs">Distance</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-white font-bold">2,340 m</p>
                <p className="text-gray-400 text-xs">Elevation</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                <Clock className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-white font-bold">18h 45m</p>
                <p className="text-gray-400 text-xs">Time</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                <Flame className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-white font-bold">4,520</p>
                <p className="text-gray-400 text-xs">Calories</p>
              </div>
            </div>
          </div>
        </div>

        {/* Activity List */}
        <div className="space-y-3">
          {mockActivities.map((activity) => (
            <div key={activity.id} className="card p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-white font-bold">{activity.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="primary">{activity.type.replace('_', ' ')}</Badge>
                    <span className="text-gray-400 text-xs flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(activity.startTime)}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-4 gap-2 pt-3 border-t border-white/10">
                <div className="text-center">
                  <p className="text-white font-bold text-sm">{formatDistance(activity.distance)}</p>
                  <p className="text-gray-500 text-xs">Distance</p>
                </div>
                <div className="text-center">
                  <p className="text-white font-bold text-sm">{formatDuration(activity.duration)}</p>
                  <p className="text-gray-500 text-xs">Duration</p>
                </div>
                <div className="text-center">
                  <p className="text-white font-bold text-sm">{activity.elevation} m</p>
                  <p className="text-gray-500 text-xs">Elevation</p>
                </div>
                <div className="text-center">
                  <p className="text-white font-bold text-sm">{activity.calories}</p>
                  <p className="text-gray-500 text-xs">Calories</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
