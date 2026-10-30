import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../i18n/LanguageContext';
import { StatusBar } from '../components/common/StatusBar';
import { TopBar } from '../components/common/TopBar';
import { Icon } from '../components/common/Icon';
import { validateNin } from '../data/nigerianBanks';

export const M03VerifyIdentity: React.FC = () => {
  const { navigate, showToast, verifyNin, currentUser } = useApp();
  const { language, t } = useLanguage();
  const [nin, setNin] = useState('70314482905');
  const [legalName, setLegalName] = useState(currentUser.name || 'Hauwa Ibrahim Bello');
  const [isVerifying, setIsVerifying] = useState(false);

  const isValid = validateNin(nin);

  const handleVerify = async () => {
    if (!isValid) {
      showToast(
        language === 'ha'
          ? 'Da fatan za a shigar da NIN mai lambobi 11'
          : 'Please enter a valid 11-digit NIN',
        'alert'
      );
      return;
    }

    setIsVerifying(true);
    try {
      await verifyNin(nin, legalName);
      showToast(
        language === 'ha'
          ? `An tabbatar da NIN da NIMC! Barka da zuwa, ${legalName}.`
          : `NIN verified with NIMC! Welcome, ${legalName}.`,
        'success'
      );
      setIsVerifying(false);
      navigate('/home');
    } catch {
      setIsVerifying(false);
      showToast('NIN verification timed out. Please try again.', 'alert');
    }
  };

  const handleSkip = () => {
    showToast(
      language === 'ha'
        ? 'Za mu tunatar da ku. Kuna iya duba ƙungiyoyi, amma biyan kuɗi yana buƙatar NIN.'
        : "We'll remind you. You can view groups, but paying stays locked until your NIN is verified.",
      'info'
    );
    navigate('/home');
  };

  return (
    <div className="flex-1 bg-[#FAF7F0] flex flex-col justify-between overflow-y-auto hide-scrollbar">
      <div>
        <StatusBar mode="light" />
        <TopBar
          title={t('verifyIdentity')}
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
            {t('step2Of3')}
          </span>
        </div>

        <div className="px-5 pt-2 pb-6">
          {/* Shield Icon Badge */}
          <div className="w-14 h-14 rounded-full bg-[#E3F4EC] text-[#0F8A5F] flex items-center justify-center mb-4">
            <Icon name="shield" size={28} strokeWidth={2.2} />
          </div>

          <h1 className="font-heading font-bold text-[24px] text-[#0B3D2E] leading-tight mb-2">
            {t('confirmWhoYouAre')}
          </h1>
          <p className="text-[15px] text-[#4F5F57] leading-relaxed mb-5">
            {t('ninDesc')}
          </p>

          {/* Legal Full Name */}
          <div className="mb-4">
            <label className="block text-[13px] font-semibold text-[#0B3D2E] mb-1.5">
              {language === 'ha' ? 'Cikakken Suna Kamar a NIN' : 'Full Legal Name (as on NIN)'}
            </label>
            <input
              type="text"
              value={legalName}
              onChange={(e) => setLegalName(e.target.value)}
              className="w-full h-[50px] px-4 rounded-[12px] bg-white border border-[#E3DDCF] focus:border-[#0F8A5F] focus:outline-none text-[15px] font-medium text-[#0B3D2E]"
            />
          </div>

          {/* NIN input field */}
          <div className="mb-5">
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-[13px] font-semibold text-[#0B3D2E]">
                {t('ninLabel')}
              </label>
              <span className={`text-[11px] ${isValid ? 'text-[#0F8A5F] font-bold' : 'text-[#8A968F]'}`}>
                {nin.replace(/\D/g, '').length}/11
              </span>
            </div>
            <input
              type="text"
              inputMode="numeric"
              maxLength={11}
              value={nin}
              onChange={(e) => setNin(e.target.value.replace(/\D/g, ''))}
              placeholder="70314482905"
              className="w-full h-[52px] px-4 rounded-[12px] bg-white border border-[#E3DDCF] focus:border-[#0F8A5F] focus:outline-none text-[17px] font-bold text-[#0B3D2E] font-mono tracking-widest"
            />
            <p className="text-[12px] text-[#4F5F57] mt-1.5 leading-normal">
              {t('ninFindNote')}
            </p>
          </div>

          {/* Partner bank assurance card */}
          <div className="p-4 rounded-[16px] bg-[#E3F4EC] border border-[#0F8A5F]/20 flex items-start gap-3">
            <div className="text-[#0F8A5F] mt-0.5 shrink-0">
              <Icon name="lock" size={20} strokeWidth={2.2} />
            </div>
            <p className="text-[13px] text-[#0B3D2E] leading-snug font-medium">
              {t('bankAssuranceNin')}
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-5 pt-3 pb-8 bg-white border-t border-[#E3DDCF] space-y-3">
        <button
          type="button"
          disabled={isVerifying || !isValid}
          onClick={handleVerify}
          className="w-full h-[52px] rounded-[14px] bg-[#0F8A5F] active:bg-[#0B6E4B] text-white font-heading font-bold text-[16px] flex items-center justify-center cursor-pointer shadow-sm hover:brightness-105 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {isVerifying ? (
            <span>{t('checkingNimc')}</span>
          ) : (
            <span>{t('verifyAndContinue')}</span>
          )}
        </button>

        <button
          type="button"
          onClick={handleSkip}
          className="w-full py-2.5 text-center text-[14px] font-semibold text-[#4F5F57] hover:text-[#0B3D2E] cursor-pointer"
        >
          {t('dontHaveNin')}
        </button>
      </div>
    </div>
  );
};
