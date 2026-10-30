import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { Icon } from './Icon';
import { Avatar } from './Avatar';

interface DeviceFrameProps {
  children: React.ReactNode;
}

export const DeviceFrame: React.FC<DeviceFrameProps> = ({ children }) => {
  const {
    currentUser,
    isNinVerified,
    partnerBank,
    setPartnerBankModalOpen,
    setJoinModalOpen,
    navigate,
  } = useApp();
  const { language, setLanguage } = useLanguage();
  const [isFullScreen, setIsFullScreen] = useState(false);

  return (
    <div className="min-h-screen bg-[#FAF7F0] flex flex-col items-center justify-start py-0 md:py-6 px-0 md:px-4">
      {/* Desktop presentation header */}
      <header className="hidden md:flex items-center justify-between w-full max-w-[840px] mb-4 px-4 py-2.5 bg-white/90 backdrop-blur-md rounded-2xl border border-[#E3DDCF] shadow-xs text-[13px]">
        <div className="flex items-center gap-3">
          <img
            src="/brand/adashenmu-mark.svg"
            alt="Adashenmu Logo"
            className="w-7 h-7 cursor-pointer"
            onClick={() => navigate('/home')}
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-heading font-bold text-[#0B3D2E] text-[15px]">
                Adashenmu
              </span>
              <span className="text-[10px] font-bold tracking-wider uppercase bg-[#E3F4EC] text-[#0F8A5F] px-2 py-0.5 rounded-full border border-[#0F8A5F]/20">
                LIVE
              </span>
            </div>
            <span className="text-[#4F5F57] text-[11px] block">
              {language === 'ha'
                ? 'Asusun Adashe mai Kariya ta Bankin Abokin Tarayya'
                : 'Escrow-Protected Group Savings · CBN Licensed Partner'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Quick Partner Bank Status Button */}
          <button
            type="button"
            onClick={() => setPartnerBankModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FAF7F0] border border-[#E3DDCF] hover:border-[#0F8A5F] text-[#0B3D2E] text-[12px] font-semibold cursor-pointer transition-colors"
            title="Setup Partner Bank Account"
          >
            <Icon name="bank" size={14} className="text-[#0F8A5F]" />
            <span className="hidden lg:inline">{partnerBank?.bankName || 'Partner Bank'}</span>
            <span className="w-2 h-2 rounded-full bg-[#2FBF85]" />
          </button>

          {/* Join with Code button */}
          <button
            type="button"
            onClick={() => setJoinModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[#E3DDCF] hover:bg-[#FAF7F0] text-[#0B3D2E] text-[12px] font-semibold cursor-pointer shadow-2xs transition-colors"
          >
            <Icon name="users" size={14} className="text-[#0F8A5F]" />
            <span>{language === 'ha' ? 'Shiga Ƙungiya' : 'Join with Code'}</span>
          </button>

          {/* 2-Language Selector (EN, HA) */}
          <div className="flex items-center p-0.5 rounded-full border border-[#E3DDCF] bg-[#FAF7F0] text-[12px] font-semibold text-[#4F5F57]">
            <button
              type="button"
              onClick={() => setLanguage('en')}
              className={`px-2.5 py-1 rounded-full transition-all cursor-pointer ${
                language === 'en'
                  ? 'bg-[#0B3D2E] text-white shadow-xs font-bold'
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
                  ? 'bg-[#0B3D2E] text-white shadow-xs font-bold'
                  : 'hover:text-[#0B3D2E]'
              }`}
            >
              HA
            </button>
          </div>

          {/* User profile avatar click */}
          <div
            onClick={() => navigate('/profile')}
            className="flex items-center gap-2 pl-2 pr-2 py-1 rounded-full bg-white border border-[#E3DDCF] hover:border-[#0F8A5F] cursor-pointer"
          >
            <Avatar initials={currentUser.initials} color={currentUser.avatarColor} size={26} />
            <span className="font-semibold text-[12px] text-[#0B3D2E] max-w-[90px] truncate">
              {currentUser.name.split(' ')[0]}
            </span>
            {isNinVerified && (
              <Icon name="shield" size={13} className="text-[#0F8A5F]" strokeWidth={2.4} />
            )}
          </div>

          {/* Toggle Fullscreen / Phone Frame */}
          <button
            type="button"
            onClick={() => setIsFullScreen(!isFullScreen)}
            title={isFullScreen ? 'Switch to Phone Bezel' : 'Expand full width'}
            className="p-1.5 rounded-full border border-[#E3DDCF] bg-white text-[#4F5F57] hover:text-[#0B3D2E] cursor-pointer"
          >
            <Icon name="arrow-up-right" size={15} />
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
        {/* Hardware Notch / Dynamic Island on desktop phone bezel */}
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
