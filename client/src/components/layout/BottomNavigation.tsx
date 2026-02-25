import React from 'react';
import { NavLink } from 'react-router-dom';
import { clsx } from 'clsx';
import { Map, Heart, History, User, Plus } 

interface BottomNavigationProps {
  onRecordPress?: () => void;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({ onRecordPress }) => {
  const navItems = [
    { to: '/', icon: Map, label: 'Explore' },
    { to: '/saved', icon: Heart, label: 'Saved' },
    { to: '/record', icon: Plus, label: 'Record', isRecord: true },
    { to: '/history', icon: History, label: 'History' },
    { to: '/profile', icon: User, label: 'Profile' },
  ];

  return (
    <div className="relative z-30 bg-black border-t border-white/10 pb-6 pt-3 px-6 shadow-[0_-10px_40px_rgba(0,0,0,0.8)]">
      <div className="flex justify-between items-end">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              clsx(
                'flex flex-col items-center gap-1.5 w-16',
                item.isRecord && 'relative -top-5'
              )
            }
          >
            {({ isActive }) => (
              <>
                {item.isRecord ? (
                  <div
                    className={clsx(
                      'relative flex items-center justify-center w-14 h-14 rounded-full transition-all',
                      isActive
                        ? 'bg-primary scale-110'
                        : 'bg-primary/80 hover:bg-primary scale-100'
                    )}
                    onClick={onRecordPress}
                  >
                    <span className="material-symbols-outlined text-3xl text-black">
                      add
                    </span>
                    <span className="absolute -bottom-1 w-1 h-1 bg-primary rounded-full" />
                  </div>
                ) : (
                  <>
                    <div className="relative">
                      <item.icon
                        className={clsx(
                          'text-2xl transition-colors',
                          isActive
                            ? 'text-primary'
                            : 'text-gray-500'
                        )}
                        size={24}
                      />
                      {isActive && (
                        <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
                      )}
                    </div>
                    <span
                      className={clsx(
                        'text-[10px] font-medium tracking-wide uppercase transition-colors',
                        isActive ? 'text-primary' : 'text-gray-500'
                      )}
                    >
                      {item.label}
                    </span>
                  </>
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </div>
  );
};
