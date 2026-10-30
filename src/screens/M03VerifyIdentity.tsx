import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { StatusBar } from '../components/common/StatusBar';
import { TopBar } from '../components/common/TopBar';
import { Icon } from '../components/common/Icon';

export const M03VerifyIdentity: React.FC = () => {
  const { navigate, showToast, setNinVerified } = useApp();
  const [nin, setNin] = useState('7031 4482 905');
  const [isVerifying, setIsVerifying] = useState(false);

  const handleVerify = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setNinVerified(true);
      showToast('NIN verified with NIMC! Welcome, Hauwa.', 'success');
      navigate('/home');
    }, 1200);
  };

  const handleSkip = () => {
    setNinVerified(false);
    showToast(
      "We'll remind you. You can view groups, but paying stays locked until your NIN is verified.",
      'info'
    );
    navigate('/home');
  };

  return (
    <div className="flex-1 bg-[#FAF7F0] flex flex-col justify-between overflow-y-auto hide-scrollbar">
      <div>
        <StatusBar mode="light" />
        <TopBar
          title="Verify identity"
          onBack={() => navigate('/sign-in')}
          showBack={true}
        />

        {/* Stepper bar */}
        <div className="px-5 pt-1 pb-3 flex items-center justify-between">
          <div className="flex-1 flex gap-1.5 mr-3">
            <div className="h-1 flex-1 rounded-full bg-[#0F8A5F]" />
            <div className="h-1 flex-1 rounded-full bg-[#0F8A5F]" />
            <div className="h-1 flex-1 rounded-full bg-[#E3DDCF]" />
          </div>
          <span className="text-[12px] font-medium text-[#4F5F57] whitespace-nowrap">
            Step 2 of 3
          </span>
        </div>

        <div className="px-5 pt-2 pb-6">
          {/* Shield Icon Badge */}
          <div className="w-14 h-14 rounded-full bg-[#E3F4EC] text-[#0F8A5F] flex items-center justify-center mb-4">
            <Icon name="shield" size={28} strokeWidth={2.2} />
          </div>

          <h1 className="font-heading font-bold text-[24px] text-[#0B3D2E] leading-tight mb-2">
            Confirm who you are
          </h1>
          <p className="text-[15px] text-[#4F5F57] leading-relaxed mb-6">
            Every member verifies once with their National Identification Number (NIN), so your group knows everyone is a real person.
          </p>

          {/* NIN input field */}
          <div className="mb-6">
            <label className="block text-[14px] font-semibold text-[#0B3D2E] mb-2">
              NIN (11 digits)
            </label>
            <input
              type="text"
              value={nin}
              onChange={(e) => setNin(e.target.value)}
              className="w-full h-[52px] px-4 rounded-[10px] bg-white border border-[#E3DDCF] focus:border-[#0F8A5F] focus:outline-none text-[16px] font-medium text-[#0B3D2E] font-mono tracking-wider"
            />
            <p className="text-[12px] text-[#4F5F57] mt-1.5 leading-normal">
              Find it on your NIN slip or dial <span className="font-semibold text-[#0B3D2E]">*346#</span> from your phone. We only confirm your name and photo with NIMC.
            </p>
          </div>

          {/* Partner bank assurance card */}
          <div className="p-4 rounded-[16px] bg-[#E3F4EC] border border-[#0F8A5F]/20 flex items-start gap-3">
            <div className="text-[#0F8A5F] mt-0.5 shrink-0">
              <Icon name="lock" size={20} strokeWidth={2.2} />
            </div>
            <p className="text-[13px] text-[#0B3D2E] leading-snug font-medium">
              Your contributions are held by a licensed partner bank, not by any member. Adashenmu cannot spend them.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-5 pt-3 pb-8 bg-white border-t border-[#E3DDCF] space-y-3">
        <button
          type="button"
          disabled={isVerifying}
          onClick={handleVerify}
          className="w-full h-[52px] rounded-[14px] bg-[#0F8A5F] active:bg-[#0B6E4B] text-white font-heading font-bold text-[16px] flex items-center justify-center cursor-pointer shadow-sm hover:brightness-105 transition-all disabled:opacity-75"
        >
          {isVerifying ? (
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Checking with NIMC…</span>
            </div>
          ) : (
            'Verify and continue'
          )}
        </button>

        <button
          type="button"
          onClick={handleSkip}
          className="w-full text-center py-2 text-[14px] font-semibold text-[#0B6E4B] hover:underline cursor-pointer"
        >
          I don't have my NIN with me
        </button>
      </div>
    </div>
  );
};
