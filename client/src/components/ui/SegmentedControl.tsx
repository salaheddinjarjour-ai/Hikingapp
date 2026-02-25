import React from 'react';
import clsx from 'clsx';

interface SegmentedControlProps<T extends string> {
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  className,
}: SegmentedControlProps<T>) {
  return (
    <div className={clsx('flex bg-surface-dark rounded-full p-1 border border-white/10', className)}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={clsx(
            'flex-1 py-2 px-4 rounded-full text-sm font-medium transition-all',
            value === option.value
              ? 'bg-primary text-background-dark'
              : 'text-gray-400 hover:text-white'
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
