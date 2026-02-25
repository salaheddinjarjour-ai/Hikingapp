import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, UserLocation, TrailPath } from '@/components/map';
import { Button, MetricCard } from '@/components/ui';
import { useTrailRecording } from '@/hooks';
import { formatDistance, formatDuration, formatPace } from '@/utils/formatUtils';
import { 
  Play, Pause, Square, Flag, Settings, Layers, Locate,
  Mountain, Gauge, Timer, Ruler, ChevronLeft, X
} from 'lucide-react';
import type { GeoPosition } from '@/types';

export const LiveRecordingScreen: React.FC = () => {
  const navigate = useNavigate();
  const [showStopConfirm, setShowStopConfirm] = useState(false);
  const [waypoints, setWaypoints] = useState<Array<{ position: GeoPosition; name: string }>>([]);
  const [mapCenter, setMapCenter] = useState<[number, number]>([37.7749, -122.4194]);
  const [followUser, setFollowUser] = useState(true);
  
  const {
    isRecording,
    isPaused,
    positions,
    duration,
    distance,
    elevation,
    currentPace,
    averagePace,
    geoError,
    start,
    pause,
    resume,
    stop,
    reset,
  } = useTrailRecording();

  const handleStart = useCallback(() => {
    start();
  }, [start]);

  const handlePauseResume = useCallback(() => {
    if (isPaused) {
      resume();
    } else {
      pause();
    }
  }, [isPaused, pause, resume]);

  const handleStop = useCallback(() => {
    stop();
    const activityData = {
      duration,
      distance,
      elevation,
      positions: positions.map(p => [p.longitude, p.latitude] as [number, number]),
      waypoints,
      averagePace,
      startTime: Date.now() - duration * 1000,
      endTime: Date.now(),
    };
    
    try {
      const savedActivities = JSON.parse(localStorage.getItem('trailActivities') || '[]');
      savedActivities.push({
        id: Date.now().toString(),
        ...activityData,
        name: `Trail Activity ${new Date().toLocaleDateString()}`,
        type: 'hiking',
      });
      localStorage.setItem('trailActivities', JSON.stringify(savedActivities));
    } catch (e) {
      console.error('Failed to save activity:', e);
    }
    
    navigate('/activity/summary', { state: activityData, replace: true });
  }, [stop, duration, distance, elevation, positions, waypoints, averagePace, navigate]);

  const handleAddWaypoint = useCallback(() => {
    if (positions.length > 0) {
      const lastPosition = positions[positions.length - 1];
      setWaypoints(prev => [...prev, {
        position: lastPosition,
        name: `Waypoint ${prev.length + 1}`,
      }]);
    }
  }, [positions]);

  const handleLocate = useCallback(() => {
    if (positions.length > 0) {
      const lastPos = positions[positions.length - 1];
      setMapCenter([lastPos.latitude, lastPos.longitude]);
      setFollowUser(true);
    }
  }, [positions]);

  useEffect(() => {
    if (positions.length > 0 && followUser) {
      const lastPos = positions[positions.length - 1];
      setMapCenter([lastPos.latitude, lastPos.longitude]);
    }
  }, [positions, followUser]);

  const trailCoordinates = positions.map(p => [p.latitude, p.longitude] as [number, number]);

  return (
    <div className="flex flex-col h-full bg-background-dark">
      <div className="relative h-[55%] bg-slate-800 shrink-0 overflow-hidden">
        <MapContainer
          center={mapCenter}
          zoom={16}
          className="absolute inset-0 z-0"
        >
          <UserLocation />

          {trailCoordinates.length >= 2 && (
            <TrailPath positions={trailCoordinates} color="#13ec25" weight={4} />
          )}
        </MapContainer>

        <div className="absolute top-0 left-0 right-0 p-4 pt-14 flex justify-between items-start z-10 bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
          <button 
            onClick={() => {
              if (isRecording) {
                setShowStopConfirm(true);
              } else {
                reset();
                navigate(-1);
              }
            }}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-background-dark/80 backdrop-blur-md text-white border border-white/10 active:scale-95 transition-transform pointer-events-auto"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex flex-col items-center pointer-events-auto">
            <div className="flex items-center gap-2 bg-primary/20 backdrop-blur-md px-3 py-1 rounded-full border border-primary/30">
              <div className={`w-2 h-2 rounded-full ${isRecording && !isPaused ? 'bg-primary animate-pulse' : 'bg-gray-400'}`}></div>
              <span className="text-xs font-bold text-primary tracking-wider uppercase">
                {isRecording ? (isPaused ? 'Paused' : 'Recording') : 'Ready'}
              </span>
            </div>
          </div>
          <button className="flex items-center justify-center w-10 h-10 rounded-full bg-background-dark/80 backdrop-blur-md text-white border border-white/10 active:scale-95 transition-transform pointer-events-auto">
            <Settings className="w-5 h-5" />
          </button>
        </div>

        <div className="absolute bottom-6 right-4 flex flex-col gap-3 z-10">
          <button className="w-10 h-10 rounded-full bg-surface-dark/90 text-white flex items-center justify-center shadow-lg border border-white/10 active:bg-surface-light">
            <Layers className="w-5 h-5" />
          </button>
          <button 
            onClick={handleLocate}
            className="w-10 h-10 rounded-full bg-primary text-background-dark flex items-center justify-center shadow-lg active:scale-95 transition-transform font-bold"
          >
            <Locate className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col relative z-20 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] rounded-t-3xl -mt-4 border-t border-white/5 bg-background-dark">
        <div className="w-full flex justify-center pt-3 pb-2">
          <div className="w-12 h-1.5 rounded-full bg-white/10"></div>
        </div>

        <div className="px-6 py-2 text-center">
          <div className="text-5xl font-bold font-mono text-white tracking-wider">
            {formatDuration(duration)}
          </div>
          {geoError && (
            <p className="text-red-400 text-sm mt-1">{geoError}</p>
          )}
        </div>

        <div className="grid grid-cols-3 gap-2 px-4 py-4">
          <MetricCard 
            icon={<Ruler className="w-4 h-4" />}
            value={formatDistance(distance)}
            label="Distance"
            className="bg-surface-dark"
          />
          <MetricCard 
            icon={<Mountain className="w-4 h-4" />}
            value={`${Math.round(elevation)} m`}
            label="Elevation"
            className="bg-surface-dark"
          />
          <MetricCard 
            icon={<Gauge className="w-4 h-4" />}
            value={formatPace(averagePace)}
            unit="/km"
            label="Avg Pace"
            className="bg-surface-dark"
          />
        </div>

        <div className="px-6 py-3">
          <div className="flex justify-between items-center bg-surface-dark rounded-xl p-4">
            <div className="text-center">
              <p className="text-gray-400 text-xs mb-1">Current Pace</p>
              <p className="text-white font-bold text-lg">{formatPace(currentPace)}</p>
            </div>
            <div className="w-px h-10 bg-white/10" />
            <div className="text-center">
              <p className="text-gray-400 text-xs mb-1">Current Speed</p>
              <p className="text-white font-bold text-lg">{(currentPace / 3.6).toFixed(1)} m/s</p>
            </div>
            <div className="w-px h-10 bg-white/10" />
            <div className="text-center">
              <p className="text-gray-400 text-xs mb-1">GPS Points</p>
              <p className="text-white font-bold text-lg">{positions.length}</p>
            </div>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center gap-4 px-6 pb-8">
          {!isRecording ? (
            <Button onClick={handleStart} className="w-full">
              <Play className="w-6 h-6 mr-2" />
              Start Recording
            </Button>
          ) : (
            <>
              <button 
                onClick={handlePauseResume}
                className="w-16 h-16 rounded-full bg-surface-dark border border-white/20 flex items-center justify-center text-white hover:bg-surface-light transition-colors"
              >
                {isPaused ? (
                  <Play className="w-8 h-8" />
                ) : (
                  <Pause className="w-8 h-8" />
                )}
              </button>
              
              <button 
                onClick={() => setShowStopConfirm(true)}
                className="w-20 h-20 rounded-full bg-red-500 flex items-center justify-center text-white hover:bg-red-600 transition-colors shadow-lg"
              >
                <Square className="w-10 h-10" />
              </button>

              <button 
                onClick={handleAddWaypoint}
                className="w-16 h-16 rounded-full bg-surface-dark border border-white/20 flex items-center justify-center text-white hover:bg-surface-light transition-colors"
              >
                <Flag className="w-6 h-6" />
              </button>
            </>
          )}
        </div>
      </div>

      {showStopConfirm && (
        <div className="absolute inset-0 z-30 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="bg-surface-dark border border-white/10 rounded-2xl p-6 w-full max-w-sm">
            <h3 className="text-white font-bold text-xl mb-2">Stop Recording?</h3>
            <p className="text-gray-400 text-sm mb-6">
              Your activity will be saved with {formatDistance(distance)} distance and {formatDuration(duration)} duration.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowStopConfirm(false)}
                className="flex-1 h-12 rounded-xl border border-white/20 text-white font-medium hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleStop}
                className="flex-1 h-12 rounded-xl bg-red-500 text-white font-medium hover:bg-red-600 transition-colors"
              >
                Stop & Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
