import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { TopAppBar } from '@/components/layout';
import { Badge } from '@/components/ui';
import { mockActivities } from '@/utils/mockData';
import { formatDistance, formatDuration, formatDate, formatTime } from '@/utils/formatUtils';
import { Mountain, Calendar, Clock, Flame, TrendingUp, MapPin, ChevronRight } from 'lucide-react'; 

interface SavedActivity {
  id: string;
  name: string;
  type: string;
  duration: number;
  distance: number;
  elevation: number;
  positions: [number, number][];
  averagePace: number;
  startTime: number;
  endTime: number;
  calories?: number;
}

export const HistoryScreen: React.FC = () => {
  const navigate = useNavigate();
  
  const savedActivities = useMemo<SavedActivity[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('trailActivities') || '[]');
    } catch {
      return [];
    }
  }, []);

  const allActivities = useMemo(() => {
    const saved = savedActivities.map(a => ({
      ...a,
      startTime: new Date(a.startTime).toISOString(),
      endTime: new Date(a.endTime).toISOString(),
    }));
    return [...saved, ...mockActivities].sort((a, b) => 
      new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
    );
  }, [savedActivities]);

  const stats = useMemo(() => {
    const totalDistance = allActivities.reduce((sum, a) => sum + a.distance, 0);
    const totalElevation = allActivities.reduce((sum, a) => sum + a.elevation, 0);
    const totalTime = allActivities.reduce((sum, a) => sum + a.duration, 0);
    const totalCalories = allActivities.reduce((sum, a) => sum + (a.calories || 0), 0);
    
    return { totalDistance, totalElevation, totalTime, totalCalories };
  }, [allActivities]);

  return (
    <div className="flex flex-col h-full bg-background-dark">
      <TopAppBar title="Activity History" />
      
      <div className="flex-1 overflow-y-auto px-4 pb-8">
        <div className="card p-4 mb-4">
          <h3 className="text-white font-bold mb-3">All Time Stats</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                <Mountain className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-white font-bold">{formatDistance(stats.totalDistance)}</p>
                <p className="text-gray-400 text-xs">Distance</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-white font-bold">{Math.round(stats.totalElevation).toLocaleString()} m</p>
                <p className="text-gray-400 text-xs">Elevation</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                <Clock className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-white font-bold">{formatDuration(stats.totalTime)}</p>
                <p className="text-gray-400 text-xs">Time</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                <Flame className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-white font-bold">{Math.round(stats.totalCalories).toLocaleString()}</p>
                <p className="text-gray-400 text-xs">Calories</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mb-3">
          <h3 className="text-white font-bold">Recent Activities</h3>
          <span className="text-gray-400 text-sm">{allActivities.length} total</span>
        </div>

        {allActivities.length === 0 ? (
          <div className="card p-8 text-center">
            <span className="material-symbols-outlined text-5xl text-gray-500 mb-4">directions_run</span>
            <p className="text-gray-400 mb-4">No activities yet</p>
            <button
              onClick={() => navigate('/record')}
              className="text-primary font-medium"
            >
              Start your first recording
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {allActivities.map((activity) => (
              <button
                key={activity.id}
                onClick={() => navigate(`/activity/summary`, { state: activity })}
                className="card p-4 w-full text-left hover:bg-surface-light transition-colors"
              >
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
                  <ChevronRight className="w-5 h-5 text-gray-400" />
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
                    <p className="text-white font-bold text-sm">{Math.round(activity.elevation)} m</p>
                    <p className="text-gray-500 text-xs">Elevation</p>
                  </div>
                  <div className="text-center">
                    <p className="text-white font-bold text-sm">{activity.calories || Math.round(activity.distance * 0.075)}</p>
                    <p className="text-gray-500 text-xs">Calories</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
