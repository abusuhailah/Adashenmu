import React from 'react';

interface DeviceFrameProps {
  children: React.ReactNode;
}

/**
 * Production responsive app frame:
 * Renders cleanly on mobile and center-fitted on desktop without prototype bars or fake phone bezels.
 */
export const DeviceFrame: React.FC<DeviceFrameProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#F5F2EB] flex flex-col items-center justify-start w-full">
      <main className="w-full max-w-lg min-h-screen bg-[#FAF7F0] flex flex-col relative shadow-sm border-x border-[#E3DDCF]/60">
        {children}
      </main>
    </div>
  );
};
