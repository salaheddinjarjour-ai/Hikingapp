import { useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AppShell } from '@/components/layout';
import { useAuthStore } from '@/stores';
import { LoginScreen, SignUpScreen } from '@/screens/auth';
import { OnboardingWelcome, OnboardingActivitySelection, OnboardingPermissions } from '@/screens/onboarding';
import { 
  ExploreScreen, 
  TrailDetailScreen, 
  LiveRecordingScreen, 
  SavedRoutesScreen, 
  ProfileScreen,
  HistoryScreen
} from '@/screens/main';

const LoadingScreen: React.FC = () => {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isAuthenticated) {
        navigate('/');
      } else {
        navigate('/login');
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, [isAuthenticated, navigate]);

  return (
    <div className="flex h-screen w-full items-center justify-center bg-background-dark">
      <div className="text-center">
        <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6 animate-pulse">
          <span className="material-symbols-outlined text-6xl text-primary">terrain</span>
        </div>
        <h1 className="text-white text-3xl font-extrabold mb-2 tracking-tight">TrailSense</h1>
        <p className="text-gray-400">Loading your adventure...</p>
      </div>
    </div>
  );
};

export default function App() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <Routes>
      <Route path="/login" element={<LoginScreen />} />
      <Route path="/signup" element={<SignUpScreen />} />
      <Route path="/onboarding" element={<Navigate to="/onboarding/welcome" replace />} />
      <Route path="/onboarding/welcome" element={<OnboardingWelcome />} />
      <Route path="/onboarding/activities" element={<OnboardingActivitySelection />} />
      <Route path="/onboarding/permissions" element={<OnboardingPermissions />} />
      <Route path="/loading" element={<LoadingScreen />} />
      <Route element={<AppShell />}>
        <Route path="/" element={<ExploreScreen />} />
        <Route path="/saved" element={<SavedRoutesScreen />} />
        <Route path="/history" element={<HistoryScreen />} />
        <Route path="/profile" element={<ProfileScreen />} />
      </Route>
      <Route path="/trail/:id" element={<TrailDetailScreen />} />
      <Route path="/record" element={<LiveRecordingScreen />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
