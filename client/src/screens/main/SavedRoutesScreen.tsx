import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { TopAppBar } from '@/components/layout';
import { TrailCard } from '@/components/ui';
import { sampleTrails } from '@/data/sampleTrails';

export const SavedRoutesScreen: React.FC = () => {
  const navigate = useNavigate();
  
  const savedTrailIds = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('savedTrailIds') || '[]');
    } catch {
      return [];
    }
  }, []);

  const savedTrails = useMemo(() => {
    const defaultSaved = sampleTrails.filter(t => t.isSaved);
    const localStorageSaved = sampleTrails.filter(t => savedTrailIds.includes(t.id));
    const allSaved = [...new Map([...defaultSaved, ...localStorageSaved].map(t => [t.id, t])).values()];
    return allSaved;
  }, [savedTrailIds]);

  return (
    <div className="flex flex-col h-full bg-background-dark">
      <TopAppBar title="Saved Routes" />
      
      <div className="flex-1 overflow-y-auto px-4 pb-8">
        <div className="flex items-center justify-between mb-4">
          <span className="text-gray-400 text-sm">{savedTrails.length} saved trails</span>
        </div>

        {savedTrails.length > 0 ? (
          <div className="space-y-3">
            {savedTrails.map((trail) => (
              <div key={trail.id} className="card p-3">
                <TrailCard
                  trail={trail}
                  onPress={() => navigate(`/trail/${trail.id}`)}
                  onNavigate={() => navigate(`/trail/${trail.id}`)}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <span className="material-symbols-outlined text-6xl text-gray-600 mb-4">
              favorite_border
            </span>
            <h3 className="text-white font-bold text-lg mb-2">No saved routes</h3>
            <p className="text-gray-400 text-sm mb-4">
              Save trails to easily find them later
            </p>
            <button
              onClick={() => navigate('/')}
              className="text-primary font-medium"
            >
              Explore trails
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
