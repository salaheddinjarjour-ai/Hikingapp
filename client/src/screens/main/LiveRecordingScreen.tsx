import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TopAppBar } from '@/components/layout';
import { Button, MetricCard } from '@/components/ui';
import { useTrailRecording } from '@/hooks';
import { formatDistance, formatDuration, formatPace } from '@/utils/formatUtils';
import { 
  Play, Pause, Square, Flag, Settings, Layers, Locate,
  Mountain, Gauge, Timer, Ruler
} from 'lucide-react' 

export const LiveRecordingScreen: React.FC = () => {
  const navigate = useNavigate();
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

  const handleStart = () => {
    start();
  };

  const handlePauseResume = () => {
    if (isPaused) {
      resume();
    } else {
      pause();
    }
  };

  const handleStop = () => {
    stop();
    navigate('/activity/summary', { 
      state: { 
        duration, 
        distance, 
        elevation,
        positions 
      } 
    });
  };

  return (
    <div className="flex flex-col h-full bg-background-dark">
      {/* Map View - Top Half */}
      <div className="relative h-[55%] bg-slate-800 shrink-0 overflow-hidden">
        {/* Dark topographic map background */}
        <div className="absolute inset-0 bg-gradient-to-b from-background-dark/30 to-transparent pointer-events-none" />
        
        {/* Simulated trail path */}
        <svg className="absolute w-full h-full" style={{ transform: 'scale(1.5)' }}>
          <path 
            d="M50,300 Q150,250 200,200 T350,150 T500,100" 
            fill="none" 
            stroke="#22d3ee" 
            strokeDasharray="10, 5" 
            strokeLinecap="round" 
            strokeWidth="4"
          />
          {/* Current Position Pulsing Dot */}
          <circle 
            className="animate-pulse" 
            cx="200" 
            cy="200" 
            fill="#13ec25" 
            r="8"
            style={{ filter: 'drop-shadow(0 0 10px #13ec25)' }}
          />
          <circle cx="200" cy="200" fill="#ffffff" r="4" />
        </svg>

        {/* Top Header Overlay */}
        <div className="absolute top-0 left-0 right-0 p-4 pt-14 flex justify-between items-start z-10 bg-gradient-to-b from-black/80 to-transparent">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-background-dark/80 backdrop-blur-md text-white border border-white/10 active:scale-95 transition-transform"
          >
            <Square className="w-5 h-5" />
          </button>
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-2 bg-primary/20 backdrop-blur-md px-3 py-1 rounded-full border border-primary/30">
              <div className={`w-2 h-2 rounded-full ${isRecording && !isPaused ? 'bg-primary animate-pulse' : 'bg-gray-400'}`}></div>
              <span className="text-xs font-bold text-primary tracking-wider uppercase">
                {isRecording ? (isPaused ? 'Paused' : 'Recording') : 'Ready'}
              </span>
            </div>
          </div>
          <button className="flex items-center justify-center w-10 h-10 rounded-full bg-background-dark/80 backdrop-blur-md text-white border border-white/10 active:scale-95 transition-transform">
            <Settings className="w-5 h-5" />
          </button>
        </div>

        {/* Map Controls */}
        <div className="absolute bottom-6 right-4 flex flex-col gap-3">
          <button className="w-10 h-10 rounded-full bg-slate-800/90 text-white flex items-center justify-center shadow-lg border border-white/10 active:bg-slate-700">
            <Layers className="w-5 h-5" />
          </button>
          <button className="w-10 h-10 rounded-full bg-primary text-background-dark flex items-center justify-center shadow-lg active:scale-95 transition-transform font-bold">
            <Locate className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Dashboard - Bottom Half */}
      <div className="flex-1 flex flex-col relative z-20 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] rounded-t-3xl -mt-4 border-t border-white/5 bg-background-dark">
        {/* Drag Handle */}
        <div className="w-full flex justify-center pt-3 pb-2">
          <div className="w-12 h-1.5 rounded-full bg-white/10"></div>
        </div>

        {/* Timer Display */}
        <div className="px-6 py-2 text-center">
          <div className="text-5xl font-bold font-mono text-white tracking-wider">
            {formatDuration(duration)}
          </div>
          {geoError && (
            <p className="text-red-400 text-sm mt-1">{geoError}</p>
          )}
        </div>

        {/* Metrics Grid */}
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

        {/* Current Stats */}
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

        {/* Control Buttons */}
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
                onClick={handleStop}
                className="w-20 h-20 rounded-full bg-red-500 flex items-center justify-center text-white hover:bg-red-600 transition-colors shadow-lg"
              >
                <Square className="w-10 h-10" />
              </button>

              <button className="w-16 h-16 rounded-full bg-surface-dark border border-white/20 flex items-center justify-center text-white hover:bg-surface-light transition-colors">
                <Flag className="w-6 h-6" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
