import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TopAppBar } from '@/components/layout';
import { TrailCard } from '@/components/ui';
import { mockTrails } from '@/utils/mockData';

export const SavedRoutesScreen: React.FC = () => {
  const navigate = useNavigate();
  const savedTrails = mockTrails.filter(t => t.isSaved);

  return (
    <div className="flex flex-col h-full bg-background-dark">
      <TopAppBar title="Saved Routes" />
      
      <div className="flex-1 overflow-y-auto px-4 pb-8">
        {savedTrails.length > 0 ? (
          <div className="space-y-3">
            {savedTrails.map((trail) => (
              <TrailCard
                key={trail.id}
                trail={trail}
                onPress={() => navigate(`/trail/${trail.id}`)}
                onNavigate={() => navigate(`/trail/${trail.id}`)}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <span className="material-symbols-outlined text-6xl text-gray-600 mb-4">
              favorite_border
            </span>
            <h3 className="text-white font-bold text-lg mb-2">No saved routes</h3>
            <p className="text-gray-400 text-sm">
              Save trails to easily find them later
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
