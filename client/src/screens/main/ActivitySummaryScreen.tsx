import React, { useMemo, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MapContainer, TrailPath } from '@/components/map';
import { Button, MetricCard } from '@/components/ui';
import { formatDistance, formatDuration, formatPace, formatCalories, formatDate, formatTime } from '@/utils/formatUtils';
import { getBoundsFromCoordinates } from '@/utils/geoUtils';
import { 
  ChevronLeft, Share, Download, Trash2, 
  Mountain, Clock, Gauge, Flame, MapPin
} from 'lucide-react';

interface ActivityData {
  duration: number;
  distance: number;
  elevation: number;
  positions: [number, number][];
  waypoints?: Array<{ position: { latitude: number; longitude: number }; name: string }>;
  averagePace: number;
  startTime: number;
  endTime: number;
}

export const ActivitySummaryScreen: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const activityData = useMemo<ActivityData>(() => {
    const state = location.state as ActivityData | undefined;
    if (state) return state;
    
    const savedActivities = JSON.parse(localStorage.getItem('trailActivities') || '[]');
    return savedActivities[savedActivities.length - 1] || {
      duration: 3600,
      distance: 5000,
      elevation: 200,
      positions: [[-122.4194, 37.7749], [-122.4180, 37.7755], [-122.4165, 37.7760]],
      averagePace: 5,
      startTime: Date.now() - 3600000,
      endTime: Date.now(),
    };
  }, [location.state]);

  const bounds = useMemo(() => {
    if (activityData.positions.length < 2) return undefined;
    return getBoundsFromCoordinates(activityData.positions);
  }, [activityData.positions]);

  const caloriesBurned = useMemo(() => {
    return Math.round(activityData.distance * 0.075 + activityData.elevation * 0.015);
  }, [activityData.distance, activityData.elevation]);

  const handleSaveActivity = () => {
    try {
      const savedActivities = JSON.parse(localStorage.getItem('trailActivities') || '[]');
      const existingIndex = savedActivities.findIndex(
        (a: ActivityData & { id: string }) => a.startTime === activityData.startTime
      );
      
      if (existingIndex === -1) {
        savedActivities.push({
          id: Date.now().toString(),
          ...activityData,
          calories: caloriesBurned,
        });
        localStorage.setItem('trailActivities', JSON.stringify(savedActivities));
      }
    } catch (e) {
      console.error('Failed to save activity:', e);
    }
    navigate('/history');
  };

  const handleShare = async () => {
    const shareData = {
      title: 'TrailSense Activity',
      text: `I just completed a ${formatDistance(activityData.distance)} hike in ${formatDuration(activityData.duration)}!`,
      url: window.location.href,
    };
    
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (e) {
        console.log('Share cancelled');
      }
    }
  };

  const handleDiscard = () => {
    navigate('/');
  };

  return (
    <div className="flex flex-col h-full bg-background-dark">
      <div className="relative h-64 shrink-0">
        {bounds ? (
          <MapContainer
            bounds={bounds}
            className="absolute inset-0 z-0"
            showControls={false}
          >
            <TrailPath
              coordinates={activityData.positions}
              color="#13ec25"
              width={4}
            />
          </MapContainer>
        ) : (
          <div className="absolute inset-0 bg-surface-dark flex items-center justify-center">
            <span className="material-symbols-outlined text-4xl text-gray-500">map</span>
          </div>
        )}
        
        <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-transparent to-transparent" />
        
        <button
          onClick={handleDiscard}
          className="absolute top-14 left-4 flex items-center justify-center w-10 h-10 rounded-full bg-black/50 backdrop-blur-md text-white"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <button
          onClick={handleShare}
          className="absolute top-14 right-4 flex items-center justify-center w-10 h-10 rounded-full bg-black/50 backdrop-blur-md text-white"
        >
          <Share className="w-5 h-5" />
        </button>

        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex items-center gap-2 text-white">
            <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
            <span className="text-sm font-medium">Activity Complete</span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto -mt-4 relative z-10">
        <div className="bg-background-dark rounded-t-3xl px-4 pt-6 pb-8">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-white mb-1">Great Job! 🎉</h1>
            <p className="text-gray-400">You've completed your activity</p>
          </div>

          <div className="bg-surface-dark rounded-2xl p-6 mb-6">
            <div className="text-center mb-4">
              <div className="text-5xl font-bold font-mono text-white tracking-wider mb-1">
                {formatDuration(activityData.duration)}
              </div>
              <p className="text-gray-400 text-sm">Total Time</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <MetricCard 
                icon={<MapPin className="w-5 h-5" />}
                value={formatDistance(activityData.distance)}
                label="Distance"
              />
              <MetricCard 
                icon={<Mountain className="w-5 h-5" />}
                value={`${Math.round(activityData.elevation)} m`}
                label="Elevation"
              />
              <MetricCard 
                icon={<Gauge className="w-5 h-5" />}
                value={formatPace(activityData.averagePace)}
                unit="/km"
                label="Avg Pace"
              />
              <MetricCard 
                icon={<Flame className="w-5 h-5" />}
                value={formatCalories(caloriesBurned)}
                label="Calories"
              />
            </div>
          </div>

          <div className="bg-surface-dark rounded-2xl p-4 mb-6">
            <h3 className="text-white font-bold mb-3 flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              Activity Details
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Started</span>
                <span className="text-white">{formatTime(new Date(activityData.startTime))}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Finished</span>
                <span className="text-white">{formatTime(new Date(activityData.endTime))}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Date</span>
                <span className="text-white">{formatDate(new Date(activityData.startTime))}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">GPS Points</span>
                <span className="text-white">{activityData.positions.length}</span>
              </div>
              {activityData.waypoints && activityData.waypoints.length > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Waypoints</span>
                  <span className="text-white">{activityData.waypoints.length}</span>
                </div>
              )}
            </div>
          </div>

          {activityData.positions.length > 2 && (
            <div className="bg-surface-dark rounded-2xl p-4 mb-6">
              <h3 className="text-white font-bold mb-3">Elevation Profile</h3>
              <div className="h-24 flex items-end gap-0.5">
                {Array.from({ length: Math.min(activityData.positions.length, 50) }).map((_, i) => {
                  const height = 20 + Math.random() * 80;
                  return (
                    <div
                      key={i}
                      className="flex-1 bg-gradient-to-t from-primary/40 to-primary rounded-t"
                      style={{ height: `${height}%` }}
                    />
                  );
                })}
              </div>
            </div>
          )}

          <div className="space-y-3">
            <Button onClick={handleSaveActivity} className="w-full">
              Save Activity
            </Button>
            <div className="flex gap-3">
              <button
                onClick={handleShare}
                className="flex-1 h-12 rounded-xl border border-white/20 text-white font-medium flex items-center justify-center gap-2 hover:bg-white/5 transition-colors"
              >
                <Share className="w-5 h-5" />
                Share
              </button>
              <button
                onClick={handleDiscard}
                className="flex-1 h-12 rounded-xl border border-red-500/30 text-red-400 font-medium flex items-center justify-center gap-2 hover:bg-red-500/10 transition-colors"
              >
                <Trash2 className="w-5 h-5" />
                Discard
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
