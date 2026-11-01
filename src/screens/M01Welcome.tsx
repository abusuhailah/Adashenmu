import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../i18n/LanguageContext';
import { StatusBar } from '../components/common/StatusBar';
import { Icon } from '../components/common/Icon';

export const M01Welcome: React.FC = () => {
  const { navigate, signInWithGoogle, setGoogleAccountModalOpen, liveUserProfile } = useApp();
  const { language, setLanguage, t } = useLanguage();
  const [isSigningIn, setIsSigningIn] = useState(false);

  // If already logged in, automatically direct user to home
  useEffect(() => {
    if (liveUserProfile) {
      navigate('/home');
    }
  }, [liveUserProfile, navigate]);

  const handleGoogleSignIn = () => {
    setGoogleAccountModalOpen(true);
  };

  return (
    <div className="h-full max-h-full w-full bg-[#0B3D2E] text-white flex flex-col justify-between overflow-hidden select-none overscroll-none">
      {/* Light status bar (white content) */}
      <StatusBar mode="dark" />

      {/* Main hero area - compact & centered, completely fitting without scroll */}
      <div className="flex-1 px-5 py-2 flex flex-col items-center justify-center text-center max-w-md mx-auto w-full">
        {/* Adashe pot mark logo */}
        <div className="w-14 h-14 sm:w-16 sm:h-16 mb-2 flex items-center justify-center">
          <img
            src="/brand/adashenmu-mark-reversed.svg"
            alt="Adashenmu"
            className="w-full h-full object-contain drop-shadow-md"
          />
        </div>

        {/* Wordmark and Tagline */}
        <h1 className="font-heading font-extrabold text-[32px] sm:text-[36px] tracking-tight leading-none text-white mb-1.5">
          adashenmu
        </h1>
        <p className="text-[14px] sm:text-[15px] font-semibold text-[#2FBF85] mb-4">
          {t('tagline')}
        </p>

        {/* Promises card */}
        <div className="w-full bg-[#072A20] rounded-[16px] p-3.5 text-left space-y-2.5 border border-[#2FBF85]/15 mb-3.5 shadow-inner">
          <div className="flex items-start gap-2.5">
            <div className="text-[#2FBF85] mt-0.5 shrink-0">
              <Icon name="shield" size={17} strokeWidth={2.2} />
            </div>
            <p className="text-[12px] sm:text-[13px] leading-snug text-white/95">
              {t('welcomePromise1')}
            </p>
          </div>

          <div className="flex items-start gap-2.5">
            <div className="text-[#2FBF85] mt-0.5 shrink-0">
              <Icon name="users" size={17} strokeWidth={2.2} />
            </div>
            <p className="text-[12px] sm:text-[13px] leading-snug text-white/95">
              {t('welcomePromise2')}
            </p>
          </div>

          <div className="flex items-start gap-2.5">
            <div className="text-[#2FBF85] mt-0.5 shrink-0">
              <Icon name="calendar" size={17} strokeWidth={2.2} />
            </div>
            <p className="text-[12px] sm:text-[13px] leading-snug text-white/95">
              {t('welcomePromise3')}
            </p>
          </div>
        </div>

        {/* Language selector chips */}
        <div className="flex items-center gap-2">
          <Icon name="globe" size={14} className="text-[#2FBF85]" />
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

      {/* Footer auth section: Single unified Google Sign-In always visible above the fold */}
      <div className="p-4 sm:p-5 pt-2 pb-6 sm:pb-8 bg-[#0B3D2E] border-t border-white/10 shrink-0 max-w-md mx-auto w-full">
        {liveUserProfile ? (
          <button
            type="button"
            onClick={() => navigate('/home')}
            className="w-full h-[48px] sm:h-[52px] rounded-[14px] bg-[#0F8A5F] active:bg-[#0B6E4B] text-white font-heading font-bold text-[15px] sm:text-[16px] flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:brightness-105 transition-all"
          >
            <span>{language === 'ha' ? 'Shiga Tsarin Ƙungiyoyinka' : 'Go to your Dashboard'}</span>
            <Icon name="arrow-up-right" size={18} />
          </button>
        ) : (
          <button
            type="button"
            disabled={isSigningIn}
            onClick={handleGoogleSignIn}
            className="w-full h-[48px] sm:h-[52px] rounded-[14px] bg-white active:bg-gray-100 text-[#1F2937] font-heading font-bold text-[14px] sm:text-[15px] flex items-center justify-center gap-3 cursor-pointer shadow-lg hover:brightness-105 transition-all disabled:opacity-60"
          >
            {/* Google G icon */}
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.35 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.16 0 9.97 0 12s.45 3.84 1.25 5.42l4.03-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
            <span>
              {isSigningIn
                ? language === 'ha'
                  ? 'Ana shiga da Google…'
                  : 'Signing in with Google…'
                : language === 'ha'
                ? 'Ci gaba da Gmail / Google'
                : 'Continue with Google / Gmail'}
            </span>
          </button>
        )}
      </div>
    </div>
  );
};
