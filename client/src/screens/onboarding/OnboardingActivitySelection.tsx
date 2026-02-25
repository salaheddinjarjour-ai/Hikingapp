import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui';
import { clsx } from 'clsx';

const activities = [
  { id: 'hiking', name: 'Hiking', icon: 'hiking', description: 'Mountain & forest trails' },
  { id: 'trail_running', name: 'Trail Running', icon: 'directions_run', description: 'Off-road running' },
  { id: 'mountaineering', name: 'Mountaineering', icon: 'landscape', description: 'Climbing & peaks' },
  { id: 'off_road', name: 'Off-Road', icon: 'pedestrian_bike', description: 'Cycling & ATV' },
];

export const OnboardingActivitySelection: React.FC = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<string[]>([]);

  const toggleActivity = (id: string) => {
    setSelected(prev => 
      prev.includes(id) 
        ? prev.filter(a => a !== id)
        : [...prev, id]
    );
  };

  const handleContinue = () => {
    navigate('/onboarding/permissions');
  };

  return (
    <div className="flex h-full min-h-screen w-full max-w-md flex-col bg-background-dark">
      <div className="flex-1 flex flex-col px-6 pt-8 pb-4">
        <h1 className="text-white text-3xl font-extrabold mb-2">
          What do you do?
        </h1>
        <p className="text-gray-400 mb-6">
          Select your preferred activities to personalize your experience.
        </p>

        <div className="space-y-3 flex-1">
          {activities.map((activity) => (
            <button
              key={activity.id}
              onClick={() => toggleActivity(activity.id)}
              className={clsx(
                'w-full p-4 rounded-2xl border-2 transition-all flex items-center gap-4 text-left',
                selected.includes(activity.id)
                  ? 'border-primary bg-primary/10'
                  : 'border-white/10 bg-surface-dark hover:border-white/20'
              )}
            >
              <div className={clsx(
                'w-14 h-14 rounded-xl flex items-center justify-center transition-colors',
                selected.includes(activity.id) 
                  ? 'bg-primary text-background-dark' 
                  : 'bg-white/10 text-white'
              )}>
                <span className="material-symbols-outlined text-3xl">{activity.icon}</span>
              </div>
              <div className="flex-1">
                <h3 className="text-white font-bold text-lg">{activity.name}</h3>
                <p className="text-gray-400 text-sm">{activity.description}</p>
              </div>
              {selected.includes(activity.id) && (
                <span className="material-symbols-outlined text-primary text-2xl">check_circle</span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="px-6 pb-8">
        <Button 
          onClick={handleContinue}
          disabled={selected.length === 0}
        >
          Continue
        </Button>
      </div>
    </div>
  );
};
