import React from 'react';
import { useNavigate } from 'react-router-dom';
import { clsx } from 'clsx';
import { ArrowLeft, Settings, Search, Layers, ListFilter } 

interface TopAppBarProps {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  actions?: 'search' | 'settings' | 'layers' | 'filter' | 'none';
  onAction?: () => void;
  transparent?: boolean;
  className?: string;
}

export const TopAppBar: React.FC<TopAppBarProps> = ({
  title,
  showBack = false,
  onBack,
  actions = 'none',
  onAction,
  transparent = false,
  className,
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  const getActionIcon = () => {
    switch (actions) {
      case 'search':
        return <Search className="w-5 h-5" />;
      case 'settings':
        return <Settings className="w-5 h-5" />;
      case 'layers':
        return <Layers className="w-5 h-5" />;
      case 'filter':
        return <ListFilter className="w-5 h-5" />;
      default:
        return null;
    }
  };

  return (
    <div
      className={clsx(
        'flex items-center px-4 py-4 justify-between sticky top-0 z-50',
        transparent 
          ? 'bg-gradient-to-b from-black/80 to-transparent' 
          : 'bg-background-dark/90 backdrop-blur-sm',
        className
      )}
    >
      <button
        className={clsx(
          'flex size-10 shrink-0 items-center justify-center rounded-full transition-colors',
          showBack
            ? 'text-white hover:bg-white/10'
            : 'invisible'
        )}
        onClick={handleBack}
      >
        <ArrowLeft className="w-5 h-5" />
      </button>

      {title && (
        <h2 className="text-white text-lg font-bold leading-tight tracking-tight flex-1 text-center pr-10">
          {title}
        </h2>
      )}

      {actions !== 'none' && (
        <button
          className="flex size-10 shrink-0 items-center justify-center rounded-full text-white hover:bg-white/10 transition-colors"
          onClick={onAction}
        >
          {getActionIcon()}
        </button>
      )}
    </div>
  );
};
