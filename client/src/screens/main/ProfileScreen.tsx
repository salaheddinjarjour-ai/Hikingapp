import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TopAppBar } from '@/components/layout';
import { Badge, MetricCard } from '@/components/ui';
import { useAuthStore } from '@/stores';
import { mockActivities, mockWeather } from '@/utils/mockData';
import { formatDistance, formatElevation, formatDuration } from '@/utils/formatUtils';
import { 
  MapPin, Calendar, Clock, Mountain, Trophy, Settings,
  Bell, HelpCircle, LogOut, ChevronRight, Star
} from 'lucide-react'; 

export const ProfileScreen: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const stats = user?.stats;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex flex-col h-full bg-background-dark">
      <TopAppBar title="Profile" actions="settings" />
      
      <div className="flex-1 overflow-y-auto pb-8">
        {/* Profile Header */}
        <div className="px-6 py-6 flex items-center gap-4">
          <div className="w-20 h-20 rounded-full overflow-hidden ring-2 ring-primary">
            <img 
              src={user?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'} 
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h2 className="text-white font-bold text-xl">{user?.name || 'Explorer'}</h2>
            <p className="text-gray-400 text-sm">{user?.email || 'explorer@trailsense.app'}</p>
            <div className="flex items-center gap-1 mt-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-yellow-400 text-sm font-medium">Trailblazer</span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="px-4 mb-6">
          <div className="card p-4">
            <div className="grid grid-cols-3 gap-4">
              <MetricCard 
                icon={<MapPin className="w-4 h-4" />}
                value={stats?.totalDistance.toFixed(1) || '0'}
                unit="km"
                label="Total Distance"
                variant="primary"
              />
              <MetricCard 
                icon={<Mountain className="w-4 h-4" />}
                value={((stats?.totalElevation || 0) / 1000).toFixed(1)}
                unit="km"
                label="Elevation"
                variant="primary"
              />
              <MetricCard 
                icon={<Calendar className="w-4 h-4" />}
                value={stats?.totalActivities || 0}
                label="Activities"
                variant="primary"
              />
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div className="px-4 mb-6">
          <h3 className="text-white font-bold mb-3 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-400" />
            Achievements
          </h3>
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
            {user?.achievements.map((achievement) => (
              <div key={achievement.id} className="flex-shrink-0 card p-4 w-24 text-center">
                <div className="w-12 h-12 rounded-full bg-yellow-400/20 flex items-center justify-center mx-auto mb-2">
                  <Trophy className="w-6 h-6 text-yellow-400" />
                </div>
                <p className="text-white text-xs font-medium truncate">{achievement.name}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="px-4 mb-6">
          <h3 className="text-white font-bold mb-3">Recent Activity</h3>
          <div className="space-y-2">
            {mockActivities.slice(0, 3).map((activity) => (
              <div key={activity.id} className="card p-3 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                  <Mountain className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-white font-medium text-sm">{activity.name}</p>
                  <p className="text-gray-400 text-xs">{formatDistance(activity.distance)} • {formatDuration(activity.duration)}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </div>
            ))}
          </div>
        </div>

        {/* Menu Items */}
        <div className="px-4 space-y-1">
          <button className="w-full card p-4 flex items-center gap-3 hover:bg-surface-light transition-colors">
            <Bell className="w-5 h-5 text-gray-400" />
            <span className="text-white flex-1 text-left">Notifications</span>
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
          <button className="w-full card p-4 flex items-center gap-3 hover:bg-surface-light transition-colors">
            <Settings className="w-5 h-5 text-gray-400" />
            <span className="text-white flex-1 text-left">Settings</span>
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
          <button className="w-full card p-4 flex items-center gap-3 hover:bg-surface-light transition-colors">
            <HelpCircle className="w-5 h-5 text-gray-400" />
            <span className="text-white flex-1 text-left">Help & Support</span>
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
          <button 
            onClick={handleLogout}
            className="w-full card p-4 flex items-center gap-3 hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="w-5 h-5 text-red-400" />
            <span className="text-red-400 flex-1 text-left">Log Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};
