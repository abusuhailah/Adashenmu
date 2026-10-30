import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../i18n/LanguageContext';
import { StatusBar } from '../components/common/StatusBar';
import { TopBar } from '../components/common/TopBar';
import { Icon } from '../components/common/Icon';

export const M02PhoneAndOtp: React.FC = () => {
  const { navigate, signInWithGoogle, signInWithPhoneDirect, showToast } = useApp();
  const { language, t } = useLanguage();
  const [phoneNumber, setPhoneNumber] = useState('+234 803 412 7765');
  const [userName, setUserName] = useState('');
  const [digits, setDigits] = useState<string[]>(['4', '8', '2', '9', '1', '0']);
  const [activeIndex, setActiveIndex] = useState<number>(5);
  const [countdown, setCountdown] = useState<number>(45);
  const [isSending, setIsSending] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setInterval(() => setCountdown((c) => c - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [countdown]);

  const handleDigitChange = (index: number, val: string) => {
    const char = val.replace(/\D/g, '').slice(-1);
    const newDigits = [...digits];
    newDigits[index] = char;
    setDigits(newDigits);

    if (char && index < 5) {
      setActiveIndex(index + 1);
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      setActiveIndex(index - 1);
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const code = digits.join('');
    if (code.length < 6) {
      showToast(
        language === 'ha'
          ? 'Da fatan za a shigar da lambar sirri mai lambobi 6'
          : 'Please enter the complete 6-digit verification code',
        'alert'
      );
      return;
    }

    setIsSending(true);
    try {
      await signInWithPhoneDirect(phoneNumber, userName.trim() || undefined);
    } catch {
      setIsSending(false);
    }
  };

  const handleResend = () => {
    setCountdown(60);
    showToast(
      language === 'ha'
        ? `An aika sabuwar lambar sirri zuwa ${phoneNumber}`
        : `New verification code dispatched to ${phoneNumber}`,
      'info'
    );
  };

  return (
    <div className="flex-1 bg-[#FAF7F0] flex flex-col justify-between overflow-y-auto hide-scrollbar">
      <div>
        <StatusBar mode="light" />
        <TopBar onBack={() => navigate('/welcome')} showBack={true} />

        <div className="px-5 pt-3 pb-6">
          <h1 className="font-heading font-bold text-[24px] text-[#0B3D2E] leading-tight mb-2">
            {t('enterPhone')}
          </h1>
          <p className="text-[15px] text-[#4F5F57] leading-relaxed mb-6">
            {t('phoneSmsDesc')}
          </p>

          {/* Optional Display Name */}
          <div className="mb-4">
            <label className="block text-[13px] font-semibold text-[#0B3D2E] mb-1.5">
              {language === 'ha' ? 'Sunanku na Gaskiya (Don Asusu)' : 'Your Full Name'}
            </label>
            <input
              type="text"
              placeholder="e.g. Hauwa Ibrahim"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full h-[50px] px-4 rounded-[12px] bg-white border border-[#E3DDCF] focus:border-[#0F8A5F] focus:outline-none text-[15px] font-medium text-[#0B3D2E]"
            />
          </div>

          {/* Phone number field */}
          <div className="mb-5">
            <label className="block text-[13px] font-semibold text-[#0B3D2E] mb-1.5">
              {t('phoneNumberLabel')}
            </label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="+234 803 000 0000"
              className="w-full h-[50px] px-4 rounded-[12px] bg-white border border-[#E3DDCF] focus:border-[#0F8A5F] focus:outline-none text-[16px] font-medium text-[#0B3D2E]"
            />
            <p className="text-[12px] text-[#4F5F57] mt-1.5">
              {t('phoneBankNote')}
            </p>
          </div>

          {/* OTP Box Section */}
          <div className="mb-6">
            <label className="block text-[13px] font-semibold text-[#0B3D2E] mb-2.5">
              {t('enterCodeSent')}
            </label>
            <div className="flex items-center justify-between gap-1.5">
              {digits.map((digit, i) => {
                const isFocused = i === activeIndex;
                return (
                  <div
                    key={i}
                    onClick={() => {
                      setActiveIndex(i);
                      inputRefs.current[i]?.focus();
                    }}
                    className={`flex-1 h-[54px] rounded-[10px] bg-white flex items-center justify-center text-[20px] font-heading font-bold text-[#0B3D2E] cursor-pointer transition-all ${
                      isFocused
                        ? 'border-2 border-[#0F8A5F] shadow-sm'
                        : 'border border-[#E3DDCF]'
                    }`}
                  >
                    <input
                      ref={(el) => {
                        inputRefs.current[i] = el;
                      }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleDigitChange(i, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(i, e)}
                      onFocus={() => setActiveIndex(i)}
                      className="w-full h-full text-center bg-transparent focus:outline-none cursor-pointer"
                    />
                  </div>
                );
              })}
            </div>

            {/* Countdown / Resend */}
            <div className="flex items-center gap-1.5 mt-3.5 text-[13px] text-[#4F5F57]">
              <Icon name="clock" size={16} className="text-[#8A968F]" />
              {countdown > 0 ? (
                <span>
                  {t('resendCodeIn', { time: countdown.toString().padStart(2, '0') })}
                </span>
              ) : (
                <button
                  type="button"
                  onClick={handleResend}
                  className="font-semibold text-[#0F8A5F] hover:underline cursor-pointer"
                >
                  {t('resendCodeNow')}
                </button>
              )}
            </div>
          </div>

          {/* Quick Google Auth Option */}
          <div className="pt-2 border-t border-[#EFEAE0]">
            <p className="text-center text-[12px] text-[#4F5F57] mb-3 font-medium">
              {language === 'ha' ? 'Ko kuma shiga da' : 'Or continue with'}
            </p>
            <button
              type="button"
              onClick={signInWithGoogle}
              className="w-full h-[48px] rounded-[12px] bg-white border border-[#E3DDCF] hover:bg-[#FAF7F0] text-[#0B3D2E] font-semibold text-[14px] flex items-center justify-center gap-2.5 cursor-pointer shadow-xs transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>{t('signInWithGoogle')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-5 pt-3 pb-8 bg-white border-t border-[#E3DDCF]">
        <button
          type="button"
          disabled={isSending}
          onClick={handleVerify}
          className="w-full h-[52px] rounded-[14px] bg-[#0F8A5F] active:bg-[#0B6E4B] text-white font-heading font-bold text-[16px] flex items-center justify-center cursor-pointer shadow-sm hover:brightness-105 transition-all disabled:opacity-50"
        >
          {isSending ? (
            <span>{language === 'ha' ? 'Ana tantancewa…' : 'Signing in…'}</span>
          ) : (
            <span>{t('verify')}</span>
          )}
        </button>
      </div>
    </div>
  );
};
