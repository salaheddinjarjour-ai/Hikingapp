import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockTrails } from '@/utils/mockData';
import { TrailCard } from '@/components/ui';

export const ExploreScreen: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTrails = mockTrails.filter(trail =>
    trail.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    trail.location.region.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-black">
      <div className="absolute inset-0 z-0 bg-[#080808]">
        <div className="absolute inset-0 bg-surface-darker opacity-90 mix-blend-multiply"></div>
        <div className="absolute inset-0 map-texture opacity-30 pointer-events-none"></div>
      </div>

      <div className="absolute top-14 left-0 right-0 z-20 pt-2 px-4 pb-6 bg-gradient-to-b from-black via-black/80 to-transparent">
        <div className="flex items-center gap-3">
          <div className="flex-1 h-12 bg-surface-dark border border-white/20 rounded-full flex items-center px-4">
            <span className="material-symbols-outlined text-white text-xl mr-3">search</span>
            <input
              className="bg-transparent border-none text-white placeholder-gray-400 text-sm w-full focus:ring-0 p-0 h-full font-medium"
              placeholder="Search trails..."
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="absolute right-4 top-40 z-20 flex flex-col gap-4">
        <div className="flex flex-col bg-surface-dark border border-white/20 rounded-2xl overflow-hidden w-12">
          <button className="h-12 flex items-center justify-center text-white hover:bg-white/10 border-b border-white/10">
            <span className="material-symbols-outlined text-xl font-bold">add</span>
          </button>
          <button className="h-12 flex items-center justify-center text-white hover:bg-white/10">
            <span className="material-symbols-outlined text-xl font-bold">remove</span>
          </button>
        </div>
      </div>

      <div className="absolute bottom-44 left-4 z-20 flex flex-col gap-3">
        <div className="metric-card">
          <span className="material-symbols-outlined text-primary text-base">terrain</span>
          <span className="text-sm font-bold text-white tracking-wide font-mono">
            1,240 <span className="text-[10px] text-gray-400 font-sans font-normal">FT</span>
          </span>
        </div>
      </div>

      <div className="absolute bottom-48 right-4 z-20">
        <button 
          className="bg-primary hover:bg-primary-dim text-black font-bold rounded-full h-14 pl-2 pr-6 flex items-center gap-3 shadow-[0_0_30px_rgba(0,255,65,0.4)] transition-all transform hover:scale-105 active:scale-95 border border-primary/50"
          onClick={() => navigate('/record')}
        >
          <div className="bg-black rounded-full size-10 flex items-center justify-center">
            <span className="material-symbols-outlined text-primary text-2xl">fiber_manual_record</span>
          </div>
          <span className="tracking-wide text-sm font-bold uppercase">Record</span>
        </button>
      </div>

      {filteredTrails.length > 0 && (
        <div className="absolute bottom-32 left-1/2 transform -translate-x-1/2 bg-[#151515] border border-white/15 rounded-xl p-3 flex gap-4 w-[90%] max-w-sm shadow-2xl z-10">
          <TrailCard 
            trail={filteredTrails[0]} 
            onPress={() => navigate(`/trail/${filteredTrails[0].id}`)}
          />
        </div>
      )}
    </div>
  );
};
