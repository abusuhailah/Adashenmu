import React from 'react';

export type AvatarColor = 'green' | 'gold' | 'blue' | 'clay' | 'grey';

interface AvatarProps {
  initials: string;
  color?: AvatarColor;
  size?: number;
  className?: string;
  name?: string;
}

const colorStyles: Record<AvatarColor, { bg: string; text: string }> = {
  green: { bg: '#E3F4EC', text: '#0B6E4B' },
  gold: { bg: '#FFF4DB', text: '#8A5A00' },
  blue: { bg: '#E6EEFF', text: '#1D4ED8' },
  clay: { bg: '#F6E4DA', text: '#C8643B' },
  grey: { bg: '#EEF0EE', text: '#4F5F57' },
};

export const Avatar: React.FC<AvatarProps> = ({
  initials,
  color = 'green',
  size = 40,
  className = '',
  name,
}) => {
  const styling = colorStyles[color] || colorStyles.green;
  const fontSize = Math.round(size * 0.36);

  return (
    <div
      title={name || initials}
      style={{
        width: size,
        height: size,
        backgroundColor: styling.bg,
        color: styling.text,
        fontSize: `${fontSize}px`,
      }}
      className={`rounded-full shrink-0 flex items-center justify-center font-semibold select-none ${className}`}
    >
      {initials}
    </div>
  );
};
