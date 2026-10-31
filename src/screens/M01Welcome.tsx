import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../i18n/LanguageContext';
import { StatusBar } from '../components/common/StatusBar';
import { Icon } from '../components/common/Icon';

export const M01Welcome: React.FC = () => {
  const { navigate, signInWithGoogle, liveUserProfile } = useApp();
  const { language, setLanguage, t } = useLanguage();
  const [isSigningIn, setIsSigningIn] = useState(false);

  // If already logged in, automatically direct user based on their responsibilities
  useEffect(() => {
    if (liveUserProfile) {
      navigate('/home');
    }
  }, [liveUserProfile, navigate]);

  const handleGoogleSignIn = async () => {
    setIsSigningIn(true);
    try {
      await signInWithGoogle();
    } finally {
      setIsSigningIn(false);
    }
  };

  return (
    <div className="flex-1 bg-[#0B3D2E] text-white flex flex-col justify-between overflow-y-auto hide-scrollbar">
      {/* Light status bar (white content) */}
      <StatusBar mode="dark" />

      {/* Main hero area */}
      <div className="flex-1 px-5 pt-4 pb-6 flex flex-col items-center justify-center text-center">
        {/* Reversed Pot Logo (Adashe pot mark) */}
        <div className="w-[130px] h-[130px] mb-3 flex items-center justify-center">
          <img
            src="/brand/adashenmu-mark-reversed.svg"
            alt="Adashenmu"
            className="w-full h-full object-contain drop-shadow-md"
          />
        </div>

        {/* Wordmark and Tagline */}
        <h1 className="font-heading font-extrabold text-[38px] tracking-tight leading-none text-white mb-2">
          adashenmu
        </h1>
        <p className="text-[16px] font-semibold text-[#2FBF85] mb-5">
          {t('tagline')}
        </p>

        {/* Promises card */}
        <div className="w-full bg-[#072A20] rounded-[16px] p-4 text-left space-y-3.5 border border-[#2FBF85]/15 mb-5 shadow-inner">
          <div className="flex items-start gap-3">
            <div className="text-[#2FBF85] mt-0.5 shrink-0">
              <Icon name="shield" size={19} strokeWidth={2.2} />
            </div>
            <p className="text-[13px] leading-snug text-white/95">
              {t('welcomePromise1')}
            </p>
          </div>

          <div className="flex items-start gap-3">
            <div className="text-[#2FBF85] mt-0.5 shrink-0">
              <Icon name="users" size={19} strokeWidth={2.2} />
            </div>
            <p className="text-[13px] leading-snug text-white/95">
              {t('welcomePromise2')}
            </p>
          </div>

          <div className="flex items-start gap-3">
            <div className="text-[#2FBF85] mt-0.5 shrink-0">
              <Icon name="calendar" size={19} strokeWidth={2.2} />
            </div>
            <p className="text-[13px] leading-snug text-white/95">
              {t('welcomePromise3')}
            </p>
          </div>
        </div>

        {/* Language selector chips */}
        <div className="flex items-center gap-2">
          <Icon name="globe" size={15} className="text-[#2FBF85]" />
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

      {/* Footer auth section: Single unified Google Sign-In with automatic role-based routing */}
      <div className="p-5 pt-3 pb-8 space-y-3 bg-[#0B3D2E] border-t border-white/10">
        {liveUserProfile ? (
          <button
            type="button"
            onClick={() => navigate('/home')}
            className="w-full h-[52px] rounded-[14px] bg-[#0F8A5F] active:bg-[#0B6E4B] text-white font-heading font-bold text-[16px] flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:brightness-105 transition-all"
          >
            <span>{language === 'ha' ? 'Shiga Tsarin Ƙungiyoyinka' : 'Go to your Dashboard'}</span>
            <Icon name="arrow-up-right" size={18} />
          </button>
        ) : (
          <>
            <button
              type="button"
              disabled={isSigningIn}
              onClick={handleGoogleSignIn}
              className="w-full h-[52px] rounded-[14px] bg-white active:bg-gray-100 text-[#1F2937] font-heading font-bold text-[15px] flex items-center justify-center gap-3 cursor-pointer shadow-lg hover:brightness-105 transition-all disabled:opacity-60"
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
          </>
        )}
      </div>
    </div>
  );
};
