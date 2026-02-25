import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { BottomNavigation } from './BottomNavigation';

const hideNavRoutes = ['/login', '/signup', '/onboarding', '/loading', '/trail', '/record', '/activity'];

export const AppShell: React.FC = () => {
  const location = useLocation();
  const shouldHideNav = hideNavRoutes.some(route => 
    location.pathname.startsWith(route) && route !== '/' && route !== '/record'
  );

  return (
    <div className="flex flex-col h-screen w-full max-w-md mx-auto bg-background-dark overflow-hidden">
      <main className="flex-1 overflow-y-auto overflow-x-hidden">
        <Outlet />
      </main>
      {!shouldHideNav && <BottomNavigation />}
    </div>
  );
};
