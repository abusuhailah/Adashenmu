import React from 'react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../i18n/LanguageContext';
import { StatusBar } from '../components/common/StatusBar';
import { Icon } from '../components/common/Icon';

export const M01Welcome: React.FC = () => {
  const { navigate } = useApp();
  const { language, setLanguage, t } = useLanguage();

  return (
    <div className="flex-1 bg-[#0B3D2E] text-white flex flex-col justify-between overflow-y-auto hide-scrollbar">
      {/* Light status bar (white content) */}
      <StatusBar mode="dark" />

      {/* Main hero area */}
      <div className="flex-1 px-5 pt-4 pb-6 flex flex-col items-center justify-center text-center">
        {/* Reversed Pot Logo (Adashe pot mark) */}
        <div className="w-[140px] h-[140px] mb-4 flex items-center justify-center">
          <img
            src="/brand/adashenmu-mark-reversed.svg"
            alt="Adashenmu"
            className="w-full h-full object-contain drop-shadow-md"
          />
        </div>

        {/* Wordmark and Tagline */}
        <h1 className="font-heading font-extrabold text-[40px] tracking-tight leading-none text-white mb-2">
          adashenmu
        </h1>
        <p className="text-[17px] font-semibold text-[#2FBF85] mb-6">
          {t('tagline')}
        </p>

        {/* Promises card */}
        <div className="w-full bg-[#072A20] rounded-[16px] p-4 text-left space-y-3.5 border border-[#2FBF85]/15 mb-6">
          <div className="flex items-start gap-3">
            <div className="text-[#2FBF85] mt-0.5 shrink-0">
              <Icon name="shield" size={20} strokeWidth={2.2} />
            </div>
            <p className="text-[13px] leading-snug text-white/95">
              {t('welcomePromise1')}
            </p>
          </div>

          <div className="flex items-start gap-3">
            <div className="text-[#2FBF85] mt-0.5 shrink-0">
              <Icon name="users" size={20} strokeWidth={2.2} />
            </div>
            <p className="text-[13px] leading-snug text-white/95">
              {t('welcomePromise2')}
            </p>
          </div>

          <div className="flex items-start gap-3">
            <div className="text-[#2FBF85] mt-0.5 shrink-0">
              <Icon name="calendar" size={20} strokeWidth={2.2} />
            </div>
            <p className="text-[13px] leading-snug text-white/95">
              {t('welcomePromise3')}
            </p>
          </div>
        </div>

        {/* Language selector chips */}
        <div className="flex items-center gap-2">
          <Icon name="globe" size={16} className="text-[#2FBF85]" />
          <button
            type="button"
            onClick={() => setLanguage('en')}
            className={`px-3 py-1 rounded-full text-[12px] font-semibold transition-all cursor-pointer ${
              language === 'en'
                ? 'bg-[#2FBF85] text-[#0B3D2E]'
                : 'border border-[#2FBF85]/40 text-[#2FBF85] hover:bg-[#072A20]'
            }`}
          >
            English
          </button>
          <button
            type="button"
            onClick={() => setLanguage('ha')}
            className={`px-3 py-1 rounded-full text-[12px] font-semibold transition-all cursor-pointer ${
              language === 'ha'
                ? 'bg-[#2FBF85] text-[#0B3D2E]'
                : 'border border-[#2FBF85]/40 text-[#2FBF85] hover:bg-[#072A20]'
            }`}
          >
            Hausa
          </button>
        </div>
      </div>

      {/* Footer buttons */}
      <div className="p-5 pt-3 pb-8 space-y-3 bg-[#0B3D2E] border-t border-white/10">
        <button
          type="button"
          onClick={() => navigate('/sign-in')}
          className="w-full h-[52px] rounded-[14px] bg-[#0F8A5F] active:bg-[#0B6E4B] text-white font-heading font-bold text-[16px] flex items-center justify-center cursor-pointer shadow-lg hover:brightness-105 transition-all"
        >
          {t('getStarted')}
        </button>

        <button
          type="button"
          onClick={() => navigate('/join/kasuwa-stall-weekly')}
          className="w-full text-center py-2 text-[14px] font-semibold text-[#2FBF85] hover:underline cursor-pointer"
        >
          {t('haveInviteLink')}
        </button>
      </div>
    </div>
  );
};
