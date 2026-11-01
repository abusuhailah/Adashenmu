import React from 'react';

interface DeviceFrameProps {
  children: React.ReactNode;
  isDark?: boolean;
}

/**
 * Production responsive app frame:
 * Renders cleanly on mobile and center-fitted on desktop without prototype bars or fake phone bezels.
 */
export const DeviceFrame: React.FC<DeviceFrameProps> = ({ children, isDark = false }) => {
  return (
    <div
      className={`h-[100dvh] max-h-[100dvh] flex flex-col items-center justify-center w-full overflow-hidden ${
        isDark ? 'bg-[#072A20]' : 'bg-[#F5F2EB]'
      }`}
    >
      <main
        className={`w-full max-w-lg h-full max-h-[100dvh] flex flex-col relative shadow-md overflow-hidden ${
          isDark
            ? 'bg-[#0B3D2E] border-x border-[#072A20]'
            : 'bg-[#FAF7F0] border-x border-[#E3DDCF]/60'
        }`}
      >
        {children}
      </main>
    </div>
  );
};
