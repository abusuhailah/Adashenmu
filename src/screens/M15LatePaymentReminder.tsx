import React from 'react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../i18n/LanguageContext';
import { StatusBar } from '../components/common/StatusBar';
import { TopBar } from '../components/common/TopBar';
import { MoneyStateBadge } from '../components/common/MoneyStateBadge';
import { Icon } from '../components/common/Icon';

export const M15LatePaymentReminder: React.FC = () => {
  const { navigate, showToast } = useApp();
  const { language, setLanguage, t } = useLanguage();

  const handleAskMoreTime = () => {
    showToast('Request for extra time sent to Kasuwa Atamfa group!', 'info');
  };

  const cycleNextLanguage = () => {
    if (language === 'en') setLanguage('ha');
    else setLanguage('en');
  };

  const getLanguagePrompt = () => {
    if (language === 'en') return t('readInHausa');
    return t('readInEnglish');
  };

  return (
    <div className="flex-1 bg-[#FAF7F0] flex flex-col justify-between overflow-y-auto hide-scrollbar">
      <div>
        <StatusBar mode="light" />
        <TopBar
          title="Kasuwa Atamfa Adashe"
          onBack={() => navigate('/home')}
          showBack={true}
        />

        <div className="px-5 pt-1 pb-6 space-y-4">
          {/* Gentle reminder card (accentSoft #FFF4DB, polite, not red) */}
          <div className="p-4.5 rounded-[16px] bg-[#FFF4DB] border border-[#F2B33D]/40 shadow-sm space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#8A5A00] text-[13px] font-semibold">
                <Icon name="clock" size={17} strokeWidth={2.2} />
                <span>{t('octoberContribution')}</span>
              </div>
              <MoneyStateBadge state="late" />
            </div>

            <h2 className="font-heading font-bold text-[20px] text-[#0B3D2E] leading-tight">
              {t('gentleReminder')}
            </h2>

            <p className="text-[14px] text-[#4F5F57] leading-relaxed">
              {t('safiyaReminderBody')}
            </p>
          </div>

          {/* Breakdown card */}
          <div className="bg-white rounded-[16px] p-4.5 border border-[#E3DDCF] shadow-sm divide-y divide-[#EFEAE0] text-[14px]">
            <div className="flex items-center justify-between py-2">
              <span className="text-[#4F5F57]">{t('ruleContribution')}</span>
              <span className="font-semibold text-[#0B3D2E]">₦20,000</span>
            </div>

            <div className="flex items-center justify-between py-2">
              <div>
                <span className="text-[#4F5F57] block leading-tight">{t('ruleLatePayment')}</span>
                <span className="text-[11px] text-[#0B6E4B] font-medium block">
                  ({t('lateFeeToPot')})
                </span>
              </div>
              <span className="font-semibold text-[#B42318]">₦1,000</span>
            </div>

            <div className="flex items-center justify-between pt-3">
              <span className="font-heading font-bold text-[16px] text-[#0B3D2E]">
                {t('totalToPay')}
              </span>
              <span className="font-heading font-extrabold text-[22px] text-[#0B3D2E]">
                ₦21,000
              </span>
            </div>
          </div>

          {/* Card: Hadiza's payout is tomorrow */}
          <div className="p-4 rounded-[16px] bg-white border border-[#E3DDCF] shadow-sm flex items-start gap-3">
            <div className="w-10 h-10 rounded-[12px] bg-[#E3F4EC] text-[#0F8A5F] flex items-center justify-center shrink-0">
              <Icon name="calendar" size={20} strokeWidth={2.2} />
            </div>
            <div>
              <p className="font-heading font-bold text-[15px] text-[#0B3D2E]">
                {t('hadizaPayoutTomorrow')}
              </p>
              <p className="text-[12px] text-[#4F5F57] mt-0.5">
                {t('hadizaPayoutDesc')}
              </p>
            </div>
          </div>

          {/* Note (info) */}
          <div className="p-3.5 rounded-[14px] bg-white border border-[#E3DDCF] flex items-start gap-2.5">
            <Icon name="info" size={17} className="text-[#0F8A5F] mt-0.5 shrink-0" />
            <p className="text-[12px] text-[#4F5F57] leading-relaxed">
              {t('politeRuleNote')}
            </p>
          </div>

          {/* Link: Language cycler */}
          <div className="text-center pt-1">
            <button
              type="button"
              onClick={cycleNextLanguage}
              className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#0B6E4B] hover:underline cursor-pointer"
            >
              <Icon name="globe" size={15} />
              <span>{getLanguagePrompt()}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-5 pt-3 pb-8 bg-white border-t border-[#E3DDCF] space-y-2">
        <button
          type="button"
          onClick={() => navigate('/pay/ussd')}
          className="w-full h-[52px] rounded-[14px] bg-[#0F8A5F] active:bg-[#0B6E4B] text-white font-heading font-bold text-[16px] flex items-center justify-center cursor-pointer shadow-sm hover:brightness-105 transition-all"
        >
          {t('payNowAmount', { amount: '₦21,000' })}
        </button>

        <button
          type="button"
          onClick={handleAskMoreTime}
          className="w-full h-10 flex items-center justify-center gap-1.5 text-[14px] font-semibold text-[#0B6E4B] hover:underline cursor-pointer"
        >
          <Icon name="message" size={16} />
          <span>{t('askMoreTime')}</span>
        </button>
      </div>
    </div>
  );
};
