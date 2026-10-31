import React from 'react';

interface StatusBarProps {
  mode?: 'light' | 'dark';
}

/**
 * Clean live status bar: renders nothing in production web app.
 */
export const StatusBar: React.FC<StatusBarProps> = () => {
  return null;
};
