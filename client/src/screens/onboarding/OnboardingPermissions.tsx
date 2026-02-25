import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Toggle } from '@/components/ui';

export const OnboardingPermissions: React.FC = () => {
  const navigate = useNavigate();
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  const handleGetStarted = () => {
    navigate('/');
  };

  return (
    <div className="flex h-full min-h-screen w-full max-w-md flex-col bg-background-dark">
      <div className="flex-1 flex flex-col px-6 pt-8 pb-4">
        <h1 className="text-white text-3xl font-extrabold mb-2">
          Enable permissions
        </h1>
        <p className="text-gray-400 mb-6">
          Allow access to get the most out of TrailSense.
        </p>

        <div className="space-y-4 flex-1">
          <div className="card p-5 space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-2xl">location_on</span>
              </div>
              <div className="flex-1">
                <h3 className="text-white font-bold">Location</h3>
                <p className="text-gray-400 text-sm">Track your position on trails</p>
              </div>
            </div>
            <Toggle
              checked={locationEnabled}
              onChange={setLocationEnabled}
              description="Required for GPS tracking"
            />
          </div>

          <div className="card p-5 space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-2xl">notifications</span>
              </div>
              <div className="flex-1">
                <h3 className="text-white font-bold">Notifications</h3>
                <p className="text-gray-400 text-sm">Weather alerts & achievements</p>
              </div>
            </div>
            <Toggle
              checked={notificationsEnabled}
              onChange={setNotificationsEnabled}
              description="Receive important updates"
            />
          </div>

          <div className="card p-5 space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-2xl">cloud</span>
              </div>
              <div className="flex-1">
                <h3 className="text-white font-bold">Offline Maps</h3>
                <p className="text-gray-400 text-sm">Download maps for offline use</p>
              </div>
            </div>
            <p className="text-gray-500 text-xs">
              Save trail maps to your device for areas with no signal.
            </p>
          </div>
        </div>
      </div>

      <div className="px-6 pb-8">
        <Button onClick={handleGetStarted}>
          Get Started
        </Button>
        <button 
          onClick={() => navigate('/')}
          className="w-full mt-4 text-gray-400 hover:text-white text-sm font-medium"
        >
          Skip for now
        </button>
      </div>
    </div>
  );
};
