import React from 'react';
import { Icon } from './Icon';

interface TopBarProps {
  title?: string;
  onBack?: () => void;
  showBack?: boolean;
  rightAction?: React.ReactNode;
  className?: string;
  titleClassName?: string;
}

export const TopBar: React.FC<TopBarProps> = ({
  title,
  onBack,
  showBack = true,
  rightAction,
  className = '',
  titleClassName = '',
}) => {
  return (
    <div
      className={`h-[56px] px-5 flex items-center justify-between shrink-0 select-none ${className}`}
    >
      <div className="w-10 flex items-center justify-start">
        {showBack && onBack ? (
          <button
            type="button"
            onClick={onBack}
            aria-label="Back"
            className="w-10 h-10 rounded-full bg-white border border-[#E3DDCF] flex items-center justify-center text-[#0B3D2E] active:scale-95 transition-all cursor-pointer shadow-sm"
          >
            <Icon name="arrow-left" size={20} strokeWidth={2.2} />
          </button>
        ) : null}
      </div>

      <div className="flex-1 text-center px-2">
        {title ? (
          <h2
            className={`font-heading font-bold text-[20px] text-[#0B3D2E] truncate ${titleClassName}`}
          >
            {title}
          </h2>
        ) : null}
      </div>

      <div className="w-10 flex items-center justify-end">
        {rightAction ? (
          rightAction
        ) : (
          <div className="w-10 h-10" />
        )}
      </div>
    </div>
  );
};
