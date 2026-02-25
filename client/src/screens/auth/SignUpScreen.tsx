import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input } from '@/components/ui';
import { useAuthStore } from '@/stores';
import { mockUser } from '@/utils/mockData';

export const SignUpScreen: React.FC = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreedToTerms) return;
    
    setIsLoading(true);
    
    setTimeout(() => {
      login({ ...mockUser, name, email }, 'mock-token');
      navigate('/onboarding');
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="flex h-full min-h-screen w-full max-w-md flex-col bg-background-dark shadow-2xl">
      <div className="flex-1 flex flex-col px-6 pt-8 pb-8">
        <div className="mb-6">
          <h1 className="text-white text-[32px] font-extrabold leading-tight tracking-tight mb-2">
            Start your adventure
          </h1>
          <p className="text-gray-400 text-base">Create an account to track your trails.</p>
        </div>

        <form className="space-y-4" onSubmit={handleSignUp}>
          <Input
            label="Full Name"
            type="text"
            placeholder="Enter your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            icon={<span className="material-symbols-outlined text-xl">person</span>}
          />
          
          <Input
            label="Email"
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={<span className="material-symbols-outlined text-xl">mail</span>}
          />
          
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-300">Password</label>
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                icon={<span className="material-symbols-outlined text-xl">lock</span>}
              />
              <button
                type="button"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                onClick={() => setShowPassword(!showPassword)}
              >
                <span className="material-symbols-outlined text-xl">
                  {showPassword ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
          </div>

          <label className="flex items-start gap-3 cursor-pointer mt-4">
            <input
              type="checkbox"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="mt-1 w-5 h-5 rounded border-white/20 bg-surface-dark text-primary focus:ring-primary focus:ring-offset-0"
            />
            <span className="text-gray-400 text-sm">
              I agree to the <span className="text-primary">Terms of Service</span> and <span className="text-primary">Privacy Policy</span>
            </span>
          </label>

          <Button 
            type="submit" 
            isLoading={isLoading} 
            disabled={!agreedToTerms}
            className="mt-4"
          >
            Create Account
          </Button>
        </form>

        <div className="relative py-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-background-dark text-gray-400 font-medium">Or sign up with</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <button className="flex h-14 w-full items-center justify-center rounded-xl border border-white/20 bg-surface-dark hover:bg-surface-light transition-colors">
            <svg className="h-6 w-6" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
            </svg>
          </button>
          
          <button className="flex h-14 w-full items-center justify-center rounded-xl border border-white/20 bg-surface-dark hover:bg-surface-light transition-colors">
            <svg className="h-6 w-6 fill-current text-white" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.05 20.28c-.98.95-2.05.88-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.63-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.2 2.42-1 3.23-.89 1.57.18 2.53.79 3.19 1.76-2.88 1.76-2.38 5.31.29 6.43-.64 1.74-1.57 3.31-2.49 4.87zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"></path>
            </svg>
          </button>
          
          <button className="flex h-14 w-full items-center justify-center rounded-xl border border-white/20 bg-[#FC4C02] hover:bg-[#E34300] transition-colors text-white">
            <span className="font-bold tracking-tighter text-sm">STRAVA</span>
          </button>
        </div>

        <div className="mt-auto flex justify-center items-center gap-2 pb-6">
          <p className="text-gray-400 font-medium">Already have an account?</p>
          <button 
            onClick={() => navigate('/login')}
            className="text-primary hover:text-green-400 font-bold transition-colors"
          >
            Log In
          </button>
        </div>
      </div>
    </div>
  );
};
