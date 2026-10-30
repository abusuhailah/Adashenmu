import React from 'react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../i18n/LanguageContext';
import { StatusBar } from '../components/common/StatusBar';
import { TopBar } from '../components/common/TopBar';
import { Icon } from '../components/common/Icon';
import { formatNaira } from '../data/types';

export const M13PayWithUSSD: React.FC = () => {
  const {
    navigate,
    selectedUssdBank,
    setSelectedUssdBank,
    startPaymentSimulation,
    currentPaymentAmount,
    paymentMode,
    paymentTimingStatus,
    lateFeeAmount,
    userRemainingBalance,
    showToast,
  } = useApp();
  const { t } = useLanguage();

  const banks = ['GTBank', 'Access', 'First Bank', 'UBA'];

  // Bank USSD prefix lookup
  const bankPrefixes: Record<string, string> = {
    GTBank: '*737',
    Access: '*901',
    'First Bank': '*894',
    UBA: '*919',
  };

  const prefix = bankPrefixes[selectedUssdBank] || '*737';
  const ussdCode = `${prefix}*000*5821047#`;

  const handleCopyCode = () => {
    navigator.clipboard?.writeText(ussdCode);
    showToast(t('linkCopied'), 'success');
  };

  const handleProceed = () => {
    startPaymentSimulation(currentPaymentAmount);
    navigate('/pay/receipt');
  };

  return (
    <div className="flex-1 bg-[#FAF7F0] flex flex-col justify-between overflow-y-auto hide-scrollbar">
      <div>
        <StatusBar mode="light" />
        <TopBar
          title={t('payWithUssd')}
          onBack={() => navigate('/pay')}
          showBack={true}
        />

        <div className="px-5 pt-1 pb-6 space-y-4">
          {/* Amount Badge notice */}
          <div className="p-3 rounded-[12px] bg-white border border-[#E3DDCF] flex items-center justify-between shadow-sm">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#4F5F57] block">
                {paymentTimingStatus === 'late'
                  ? t('totalAmountWithFee')
                  : paymentMode === 'installment' && paymentTimingStatus === 'before_due'
                  ? t('amountToPay')
                  : t('amountToPayInFull')}
              </span>
              <span className="font-heading font-extrabold text-[18px] text-[#0B3D2E]">
                {formatNaira(currentPaymentAmount)}
              </span>
            </div>
            <span className="text-[12px] px-2.5 py-1 rounded-full bg-[#E3F4EC] text-[#0B6E4B] font-semibold">
              Kasuwa Atamfa
            </span>
          </div>

          {/* Your bank chips */}
          <div>
            <span className="text-[12px] font-semibold text-[#4F5F57] block mb-2">
              {t('yourBank')}
            </span>
            <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar">
              {banks.map((bank) => {
                const isSelected = selectedUssdBank === bank;
                return (
                  <button
                    key={bank}
                    type="button"
                    onClick={() => setSelectedUssdBank(bank)}
                    className={`px-3.5 py-1.5 rounded-full text-[13px] font-semibold transition-all whitespace-nowrap cursor-pointer ${
                      isSelected
                        ? 'bg-[#0B3D2E] text-white shadow-sm'
                        : 'bg-white border border-[#E3DDCF] text-[#4F5F57] hover:border-[#0F8A5F]'
                    }`}
                  >
                    {bank}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Dark code card */}
          <div className="p-5 rounded-[16px] bg-[#0B3D2E] text-white text-center shadow-md">
            <span className="text-[12px] font-medium text-[#2FBF85] block mb-1">
              {t('dialThisCode', { amount: formatNaira(currentPaymentAmount) })}
            </span>
            <span className="font-heading font-extrabold text-[24px] tracking-wide text-white block my-1 font-mono">
              {ussdCode}
            </span>
            <button
              type="button"
              onClick={handleCopyCode}
              className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 text-[#2FBF85] text-[12px] font-semibold cursor-pointer transition-colors"
            >
              <Icon name="copy" size={14} />
              <span>{t('copyLink')}</span>
            </button>
          </div>

          {/* Steps card (numbered circles) */}
          <div className="bg-white rounded-[16px] p-4.5 border border-[#E3DDCF] shadow-sm space-y-3.5 text-[14px]">
            <div className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-[#E3F4EC] text-[#0F8A5F] text-[12px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                1
              </span>
              <p className="text-[#0B3D2E] font-medium leading-snug">
                {t('step1Dial', { phone: '0803 412 7765' })}
              </p>
            </div>

            <div className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-[#E3F4EC] text-[#0F8A5F] text-[12px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                2
              </span>
              <p className="text-[#0B3D2E] font-medium leading-snug">
                {t('step2Pin')}
              </p>
            </div>

            <div className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-[#E3F4EC] text-[#0F8A5F] text-[12px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                3
              </span>
              <p className="text-[#0B3D2E] font-medium leading-snug">
                {t('step3Wait')}
              </p>
            </div>
          </div>

          {/* Waiting card (accentSoft) */}
          <div className="p-4 rounded-[16px] bg-[#FFF4DB] border border-[#F2B33D]/30 flex items-start gap-3">
            <div className="text-[#8A5A00] mt-0.5 shrink-0">
              <Icon name="clock" size={20} strokeWidth={2.2} />
            </div>
            <div>
              <p className="font-heading font-bold text-[14px] text-[#0B3D2E]">
                {t('waitingForBank')}
              </p>
              <p className="text-[12px] text-[#4F5F57] mt-0.5">
                {t('underAMinute')}
              </p>
            </div>
          </div>

          <p className="text-[11px] text-center text-[#8A968F] font-mono">
            Reference ADS-K4-0912
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="p-5 pt-3 pb-8 bg-white border-t border-[#E3DDCF] space-y-2">
        <button
          type="button"
          onClick={() => {
            window.location.href = `tel:${encodeURIComponent(ussdCode)}`;
            handleProceed();
          }}
          className="w-full h-[52px] rounded-[14px] bg-[#0F8A5F] active:bg-[#0B6E4B] text-white font-heading font-bold text-[16px] flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:brightness-105 transition-all"
        >
          <Icon name="phone" size={18} />
          <span>{t('dialNow')}</span>
        </button>

        <button
          type="button"
          onClick={handleProceed}
          className="w-full text-center py-2 text-[14px] font-semibold text-[#0B6E4B] hover:underline cursor-pointer"
        >
          {t('iHavePaid')}
        </button>
      </div>
    </div>
  );
};
