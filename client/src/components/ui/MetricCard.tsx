import React from 'react';
import clsx from 'clsx';

interface MetricCardProps {
  icon: React.ReactNode;
  value: string | number;
  unit?: string;
  label?: string;
  variant?: 'default' | 'primary' | 'highlight';
  className?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  icon,
  value,
  unit,
  label,
  variant = 'default',
  className,
}) => {
  const variants = {
    default: 'text-white',
    primary: 'text-primary',
    highlight: 'text-neon-accent',
  };

  return (
    <div className={clsx('metric-card', className)}>
      <span className={clsx('text-primary', variant === 'highlight' && 'text-neon-accent')}>
        {icon}
      </span>
      <div className="flex flex-col">
        <span className={clsx('text-sm font-bold tracking-wide font-mono', variants[variant])}>
          {value}
          {unit && <span className="text-[10px] text-gray-400 font-sans font-normal ml-1">{unit}</span>}
        </span>
        {label && <span className="text-[10px] text-gray-400">{label}</span>}
      </div>
    </div>
  );
};
