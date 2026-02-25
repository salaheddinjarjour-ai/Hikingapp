import React from 'react';
import clsx from 'clsx';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'sm',
  className,
}) => {
  const variants = {
    default: 'bg-white/10 text-gray-300 border-white/20',
    primary: 'bg-primary/10 text-primary border-primary/30',
    success: 'bg-green-500/10 text-green-400 border-green-500/30',
    warning: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
    danger: 'bg-red-500/10 text-red-400 border-red-500/30',
  };

  const sizes = {
    sm: 'text-[10px] px-2 py-0.5',
    md: 'text-xs px-3 py-1',
  };

  return (
    <span className={clsx(
      'font-bold rounded-full uppercase tracking-wider border',
      variants[variant],
      sizes[size],
      className
    )}>
      {children}
    </span>
  );
};
