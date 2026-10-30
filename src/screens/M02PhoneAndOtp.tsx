import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { StatusBar } from '../components/common/StatusBar';
import { TopBar } from '../components/common/TopBar';
import { Icon } from '../components/common/Icon';

export const M02PhoneAndOtp: React.FC = () => {
  const { navigate, goBack } = useApp();
  const [phoneNumber, setPhoneNumber] = useState('+234 803 412 7765');
  const [digits, setDigits] = useState<string[]>(['4', '8', '2', '9', '', '']);
  const [activeIndex, setActiveIndex] = useState<number>(4);
  const [countdown, setCountdown] = useState<number>(42);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setInterval(() => setCountdown((c) => c - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [countdown]);

  const handleDigitChange = (index: number, val: string) => {
    const char = val.slice(-1);
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

  const handleVerify = () => {
    navigate('/verify');
  };

  return (
    <div className="flex-1 bg-[#FAF7F0] flex flex-col justify-between overflow-y-auto hide-scrollbar">
      <div>
        <StatusBar mode="light" />
        <TopBar onBack={() => navigate('/welcome')} showBack={true} />

        <div className="px-5 pt-3 pb-6">
          <h1 className="font-heading font-bold text-[24px] text-[#0B3D2E] leading-tight mb-2">
            Enter your phone number
          </h1>
          <p className="text-[15px] text-[#4F5F57] leading-relaxed mb-6">
            We will send a 6-digit code by SMS to confirm it is you.
          </p>

          {/* Phone number field */}
          <div className="mb-6">
            <label className="block text-[14px] font-semibold text-[#0B3D2E] mb-2">
              Phone number
            </label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full h-[52px] px-4 rounded-[10px] bg-white border border-[#E3DDCF] focus:border-[#0F8A5F] focus:outline-none text-[16px] font-medium text-[#0B3D2E]"
            />
            <p className="text-[12px] text-[#4F5F57] mt-1.5">
              Use the number linked to your bank account
            </p>
          </div>

          {/* OTP Box Section */}
          <div className="mb-6">
            <label className="block text-[14px] font-semibold text-[#0B3D2E] mb-3">
              Enter the code we sent
            </label>
            <div className="flex items-center justify-between gap-2">
              {digits.map((digit, i) => {
                const isFocused = i === activeIndex;
                return (
                  <div
                    key={i}
                    onClick={() => {
                      setActiveIndex(i);
                      inputRefs.current[i]?.focus();
                    }}
                    className={`w-[48px] h-[56px] rounded-[10px] bg-white flex items-center justify-center text-[22px] font-heading font-bold text-[#0B3D2E] cursor-pointer transition-all ${
                      isFocused
                        ? 'border-2 border-[#0F8A5F] shadow-sm'
                        : 'border border-[#E3DDCF]'
                    }`}
                  >
                    <input
                      ref={(el) => (inputRefs.current[i] = el)}
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
            <div className="flex items-center gap-1.5 mt-4 text-[13px] text-[#4F5F57]">
              <Icon name="clock" size={16} className="text-[#8A968F]" />
              {countdown > 0 ? (
                <span>
                  Resend code in 0:{countdown.toString().padStart(2, '0')}
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => setCountdown(45)}
                  className="font-semibold text-[#0F8A5F] hover:underline"
                >
                  Resend code now
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-5 pt-3 pb-8 bg-white border-t border-[#E3DDCF]">
        <button
          type="button"
          onClick={handleVerify}
          className="w-full h-[52px] rounded-[14px] bg-[#0F8A5F] active:bg-[#0B6E4B] text-white font-heading font-bold text-[16px] flex items-center justify-center cursor-pointer shadow-sm hover:brightness-105 transition-all"
        >
          Verify
        </button>
      </div>
    </div>
  );
};
