import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { Icon } from './Icon';

interface DeviceFrameProps {
  children: React.ReactNode;
}

export const DeviceFrame: React.FC<DeviceFrameProps> = ({ children }) => {
  const { currentRoute, navigate, setDemoModalOpen, resetAllData } = useApp();
  const { language, setLanguage } = useLanguage();
  const [isFullScreen, setIsFullScreen] = useState(false);

  return (
    <div className="min-h-screen bg-[#FAF7F0] flex flex-col items-center justify-start py-0 md:py-6 px-0 md:px-4">
      {/* Desktop presentation banner */}
      <header className="hidden md:flex items-center justify-between w-full max-w-[840px] mb-4 px-4 py-2 bg-white/80 backdrop-blur-md rounded-2xl border border-[#E3DDCF] shadow-sm text-[13px]">
        <div className="flex items-center gap-3">
          <img
            src="/brand/adashenmu-mark.svg"
            alt="Adashenmu Logo"
            className="w-7 h-7"
          />
          <div>
            <span className="font-heading font-bold text-[#0B3D2E] text-[14px]">
              Adashenmu
            </span>
            <span className="text-[#4F5F57] text-[12px] ml-2">
              Group Savings Prototype
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* 3-Language Selector (EN, HA, AR) */}
          <div className="flex items-center p-0.5 rounded-full border border-[#E3DDCF] bg-[#FAF7F0] text-[12px] font-semibold text-[#4F5F57]">
            <button
              type="button"
              onClick={() => setLanguage('en')}
              className={`px-2.5 py-1 rounded-full transition-all cursor-pointer ${
                language === 'en'
                  ? 'bg-[#0B3D2E] text-white shadow-sm font-bold'
                  : 'hover:text-[#0B3D2E]'
              }`}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => setLanguage('ha')}
              className={`px-2.5 py-1 rounded-full transition-all cursor-pointer ${
                language === 'ha'
                  ? 'bg-[#0B3D2E] text-white shadow-sm font-bold'
                  : 'hover:text-[#0B3D2E]'
              }`}
            >
              HA (Hausa)
            </button>
            <button
              type="button"
              onClick={() => setLanguage('ar')}
              className={`px-2.5 py-1 rounded-full transition-all cursor-pointer ${
                language === 'ar'
                  ? 'bg-[#0B3D2E] text-white shadow-sm font-bold'
                  : 'hover:text-[#0B3D2E]'
              }`}
            >
              العربية
            </button>
          </div>

          {/* Screen jump menu */}
          <button
            type="button"
            onClick={() => setDemoModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#0F8A5F] text-white hover:bg-[#0B6E4B] text-[12px] font-semibold cursor-pointer shadow-sm"
          >
            <Icon name="list" size={14} />
            <span>19 Screens Navigator</span>
          </button>

          {/* Reset */}
          <button
            type="button"
            onClick={resetAllData}
            title="Reset to story start"
            className="p-1.5 rounded-full border border-[#E3DDCF] bg-white text-[#4F5F57] hover:text-[#B42318] cursor-pointer"
          >
            <Icon name="undo" size={16} />
          </button>

          {/* Toggle Fullscreen / Phone Frame */}
          <button
            type="button"
            onClick={() => setIsFullScreen(!isFullScreen)}
            title={isFullScreen ? 'Switch to Phone Bezel' : 'Expand full width'}
            className="p-1.5 rounded-full border border-[#E3DDCF] bg-white text-[#4F5F57] hover:text-[#0B3D2E] cursor-pointer ml-1"
          >
            <Icon name="arrow-up-right" size={16} />
          </button>
        </div>
      </header>

      {/* Phone container */}
      <div
        className={`relative transition-all duration-300 ease-in-out ${
          isFullScreen
            ? 'w-full max-w-[480px] min-h-screen bg-[#FAF7F0] shadow-2xl'
            : 'w-full md:w-[390px] h-screen md:h-[844px] md:max-h-[844px] bg-[#FAF7F0] md:rounded-[44px] md:border-[10px] md:border-[#072A20] md:shadow-[0_20px_60px_rgba(7,42,32,0.35)] overflow-hidden flex flex-col'
        }`}
      >
        {/* Hardware Notch / Dynamic Island pill on desktop phone bezel */}
        {!isFullScreen && (
          <div className="hidden md:block absolute top-2 left-1/2 -translate-x-1/2 w-28 h-4 bg-[#072A20] rounded-full z-40 pointer-events-none" />
        )}

        {/* Screen inside */}
        <div className="w-full h-full flex flex-col overflow-hidden relative">
          {children}
        </div>
      </div>
    </div>
  );
};
