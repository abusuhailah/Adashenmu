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
    <div className="h-[100dvh] max-h-[100dvh] bg-[#F5F2EB] flex flex-col items-center justify-center w-full overflow-hidden">
      <main className="w-full max-w-lg h-full max-h-[100dvh] bg-[#FAF7F0] flex flex-col relative shadow-md border-x border-[#E3DDCF]/60 overflow-hidden">
        {children}
      </main>
    </div>
  );
};
