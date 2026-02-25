import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui';

export const OnboardingWelcome: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex h-full min-h-screen w-full max-w-md flex-col bg-background-dark">
      <div className="flex-1 flex flex-col items-center justify-center px-8 pt-16">
        <div className="w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center mb-8">
          <span className="material-symbols-outlined text-7xl text-primary">terrain</span>
        </div>
        
        <h1 className="text-white text-4xl font-extrabold text-center mb-4 tracking-tight">
          TrailSense
        </h1>
        
        <p className="text-gray-400 text-center text-lg mb-8 max-w-xs">
          Your companion for outdoor adventures. Track trails, discover new routes, and explore the wilderness.
        </p>

        <div className="space-y-3 w-full max-w-xs mb-8">
          <div className="flex items-center gap-3 text-gray-300">
            <span className="material-symbols-outlined text-primary">explore</span>
            <span>Discover amazing trails near you</span>
          </div>
          <div className="flex items-center gap-3 text-gray-300">
            <span className="material-symbols-outlined text-primary">gps_fixed</span>
            <span>Live GPS tracking for your adventures</span>
          </div>
          <div className="flex items-center gap-3 text-gray-300">
            <span className="material-symbols-outlined text-primary">insights</span>
            <span>Track your progress and achievements</span>
          </div>
        </div>
      </div>

      <div className="px-6 pb-8">
        <Button onClick={() => navigate('/onboarding/activities')}>
          Get Started
        </Button>
      </div>
    </div>
  );
};
