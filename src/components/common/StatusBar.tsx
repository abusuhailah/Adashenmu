import React from 'react';

interface StatusBarProps {
  mode?: 'light' | 'dark';
}

export const StatusBar: React.FC<StatusBarProps> = ({ mode = 'light' }) => {
  const isDark = mode === 'dark';
  const textColor = isDark ? 'text-white' : 'text-[#0B3D2E]';
  const iconColor = isDark ? '#FFFFFF' : '#0B3D2E';

  return (
    <div
      className={`h-[44px] px-6 shrink-0 flex items-center justify-between text-[14px] font-semibold tracking-tight select-none ${textColor}`}
    >
      <span>9:41</span>
      <div className="flex items-center gap-1.5">
        {/* Cellular signal bars */}
        <svg width="17" height="11" viewBox="0 0 17 11" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="0.5" y="8" width="2.5" height="3" rx="0.75" fill={iconColor} />
          <rect x="4.5" y="6" width="2.5" height="5" rx="0.75" fill={iconColor} />
          <rect x="8.5" y="3.5" width="2.5" height="7.5" rx="0.75" fill={iconColor} />
          <rect x="12.5" y="1" width="2.5" height="10" rx="0.75" fill={iconColor} />
        </svg>

        {/* Wifi icon */}
        <svg width="15" height="11" viewBox="0 0 15 11" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M7.5 10.5C8.05228 10.5 8.5 10.0523 8.5 9.5C8.5 8.94772 8.05228 8.5 7.5 8.5C6.94772 8.5 6.5 8.94772 6.5 9.5C6.5 10.0523 6.94772 10.5 7.5 10.5Z"
            fill={iconColor}
          />
          <path
            d="M4.5 7C5.35 6.15 6.38 5.7 7.5 5.7C8.62 5.7 9.65 6.15 10.5 7"
            stroke={iconColor}
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M1.5 4C3.15 2.35 5.25 1.5 7.5 1.5C9.75 1.5 11.85 2.35 13.5 4"
            stroke={iconColor}
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>

        {/* Battery icon */}
        <svg width="24" height="12" viewBox="0 0 24 12" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="0.5" y="0.5" width="20" height="11" rx="3.5" stroke={iconColor} />
          <rect x="2" y="2" width="14" height="8" rx="2" fill={iconColor} />
          <path d="M22 4C22.6 4.3 23 4.8 23 5.5V6.5C23 7.2 22.6 7.7 22 8V4Z" fill={iconColor} />
        </svg>
      </div>
    </div>
  );
};
