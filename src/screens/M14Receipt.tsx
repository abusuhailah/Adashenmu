import React from 'react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../i18n/LanguageContext';
import { StatusBar } from '../components/common/StatusBar';
import { TopBar } from '../components/common/TopBar';
import { MoneyStateBadge } from '../components/common/MoneyStateBadge';
import { Icon } from '../components/common/Icon';
import { formatNaira } from '../data/types';

export const M14Receipt: React.FC = () => {
  const {
    navigate,
    userContributionState,
    currentPaymentAmount,
    totalCycleContribution,
    userPaidAmount,
    userRemainingBalance,
    paymentMode,
    activeGroup,
    selectedPaymentMethod,
    showToast,
  } = useApp();
  const { language, t } = useLanguage();

  const isConfirmedInPot = userContributionState === 'inThePot';
  const groupName = activeGroup?.name || 'Savings Group';
  const cycleNumber = activeGroup?.currentCycle?.number || 1;
  const organiserBank = activeGroup?.organiserAccount?.bankName || activeGroup?.wallet?.bankName || 'Organizer Bank Account';

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${t('paymentSent')} · Adashenmu`,
        text: `I have contributed ${formatNaira(currentPaymentAmount)} to ${groupName} via Adashenmu.`,
      }).catch(() => {});
    } else {
      showToast('Receipt details copied to clipboard!', 'success');
    }
  };

  const getMethodName = () => {
    if (selectedPaymentMethod === 'card') return t('debitCard');
    if (selectedPaymentMethod === 'bankTransfer') return t('bankTransfer');
    return t('ussd');
  };

  return (
    <div className="flex-1 bg-[#FAF7F0] flex flex-col justify-between overflow-y-auto hide-scrollbar">
      <div>
        <StatusBar mode="light" />
        <TopBar
          title={t('receipt')}
          onBack={() => navigate('/home')}
          showBack={true}
        />

        <div className="px-5 pt-2 pb-6 space-y-4">
          {/* Header celebration area */}
          <div className="text-center pt-2 pb-2">
            <div className="w-16 h-16 rounded-full bg-[#E3F4EC] flex items-center justify-center mx-auto mb-3.5 shadow-sm">
              <div className="w-11 h-11 rounded-full bg-[#0F8A5F] text-white flex items-center justify-center shadow-inner">
                <Icon name="check" size={24} strokeWidth={3} />
              </div>
            </div>

            <h1 className="font-heading font-bold text-[22px] text-[#0B3D2E] leading-tight mb-1">
              {isConfirmedInPot ? t('paymentConfirmed') : (language === 'ha' ? 'An Aika Biyan Kuɗi' : 'Payment Submitted')}
            </h1>
            <span className="font-heading font-extrabold text-[32px] text-[#0B3D2E] block mb-2">
              {formatNaira(currentPaymentAmount)}
            </span>

            <div className="flex justify-center">
              <MoneyStateBadge state={userContributionState} />
            </div>
          </div>

          {/* State timeline card */}
          <div className="bg-white rounded-[16px] p-4.5 border border-[#E3DDCF] shadow-sm">
            <div className="flex items-center justify-between relative px-2 mb-3">
              <div className="absolute left-6 right-6 top-3 h-[2px] bg-[#E3DDCF] z-0" />
              <div
                style={{ width: isConfirmedInPot ? '100%' : '50%' }}
                className="absolute left-6 top-3 h-[2px] bg-[#0F8A5F] z-0 transition-all duration-700 ease-out"
              />

              {/* 1. Pending (Done) */}
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-6 h-6 rounded-full bg-[#0F8A5F] text-white flex items-center justify-center text-[12px] font-bold shadow-sm">
                  <Icon name="check" size={13} strokeWidth={3} />
                </div>
                <span className="text-[11px] font-medium text-[#4F5F57] mt-1.5">
                  {t('statePending')}
                </span>
              </div>

              {/* 2. Confirming (Active) */}
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-6 h-6 rounded-full bg-[#0F8A5F] text-white flex items-center justify-center text-[12px] font-bold shadow-sm">
                  <Icon name="check" size={13} strokeWidth={3} />
                </div>
                <span className="text-[11px] font-semibold text-[#0B6E4B] mt-1.5">
                  {language === 'ha' ? 'Ana Tantancewa' : 'Waiting Confirmation'}
                </span>
              </div>

              {/* 3. In the pot */}
              <div className="relative z-10 flex flex-col items-center">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[12px] font-bold transition-all duration-500 shadow-sm ${
                    isConfirmedInPot
                      ? 'bg-[#0F8A5F] text-white'
                      : 'bg-white border-2 border-[#E3DDCF] text-transparent'
                  }`}
                >
                  {isConfirmedInPot && <Icon name="check" size={13} strokeWidth={3} />}
                </div>
                <span
                  className={`text-[11px] mt-1.5 transition-colors ${
                    isConfirmedInPot
                      ? 'font-semibold text-[#0B6E4B]'
                      : 'font-medium text-[#8A968F]'
                  }`}
                >
                  {t('stateInThePot')}
                </span>
              </div>
            </div>

            <p className="text-[12px] text-[#4F5F57] text-center pt-2 border-t border-[#EFEAE0] leading-relaxed">
              {isConfirmedInPot
                ? (language === 'ha'
                    ? 'Mai shirya ya amince da biyan kuɗinku! An tsare shi a cikin asusun ƙungiya.'
                    : 'The organiser has confirmed your contribution! Now secured in the group pot.')
                : (language === 'ha'
                    ? 'An tura shaidar biya zuwa ga mai shirya. Zai duba asusun banki ya tabbatar a cikin manhajar.'
                    : 'Your payment with attached proof has been sent to the organiser. They will review and confirm in the app.')}
            </p>
          </div>

          {/* Cycle installment remaining summary card */}
          {paymentMode === 'installment' && userRemainingBalance > 0 && (
            <div className="p-4 rounded-[16px] bg-[#FFF4DB] border border-[#F2B33D]/40 space-y-1.5">
              <div className="flex items-center justify-between text-[13px] font-bold text-[#8A5A00]">
                <span>{t('instalmentBreakdown')}</span>
                <span>{formatNaira(userPaidAmount)} of {formatNaira(totalCycleContribution)}</span>
              </div>
              <div className="w-full h-2 rounded-full bg-white/70 overflow-hidden">
                <div
                  style={{ width: `${Math.round((userPaidAmount / totalCycleContribution) * 100)}%` }}
                  className="h-full bg-[#F2B33D] rounded-full"
                />
              </div>
              <div className="flex items-center justify-between text-[12px] text-[#4F5F57] pt-1">
                <span>{t('remainingForCycle')}</span>
                <span className="font-heading font-extrabold text-[#0B3D2E]">
                  {formatNaira(userRemainingBalance)}
                </span>
              </div>
            </div>
          )}

          {/* Receipt Key-Value Card */}
          <div className="bg-white rounded-[16px] p-4.5 border border-[#E3DDCF] shadow-sm divide-y divide-[#EFEAE0] text-[13px]">
            <div className="flex items-center justify-between py-2">
              <span className="text-[#4F5F57]">{language === 'ha' ? 'Ƙungiya' : 'Group'}</span>
              <span className="font-semibold text-[#0B3D2E]">{groupName}</span>
            </div>

            <div className="flex items-center justify-between py-2">
              <span className="text-[#4F5F57]">{t('status')}</span>
              <span className="font-semibold text-[#0B3D2E]">
                {language === 'ha' ? `Zango ${cycleNumber}` : `Cycle ${cycleNumber}`} · {isConfirmedInPot ? 'Paid' : 'Pending Organiser Confirmation'}
              </span>
            </div>

            <div className="flex items-center justify-between py-2">
              <span className="text-[#4F5F57]">{t('method')}</span>
              <span className="font-semibold text-[#0B3D2E]">{getMethodName()}</span>
            </div>

            <div className="flex items-center justify-between py-2">
              <span className="text-[#4F5F57]">{t('paidTo')}</span>
              <span className="font-semibold text-[#0B3D2E]">{organiserBank}</span>
            </div>

            <div className="flex items-center justify-between py-2">
              <span className="text-[#4F5F57]">{t('date')}</span>
              <span className="font-semibold text-[#0B3D2E]">
                {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer buttons */}
      <div className="p-5 pt-3 pb-8 bg-white border-t border-[#E3DDCF] flex items-center gap-3">
        <button
          type="button"
          onClick={handleShare}
          className="flex-1 h-[52px] rounded-[14px] bg-white border border-[#E3DDCF] text-[#0B3D2E] font-semibold text-[15px] flex items-center justify-center gap-2 cursor-pointer hover:bg-[#FAF7F0] transition-colors"
        >
          <Icon name="share" size={17} />
          <span>{t('share')}</span>
        </button>

        <button
          type="button"
          onClick={() => {
            if (activeGroup?.id) {
              navigate(`/groups/${activeGroup.id}/ledger`);
            } else {
              navigate('/home');
            }
          }}
          className="flex-1 h-[52px] rounded-[14px] bg-[#0F8A5F] active:bg-[#0B6E4B] text-white font-heading font-bold text-[15px] flex items-center justify-center cursor-pointer shadow-sm hover:brightness-105 transition-all"
        >
          {t('backToGroup')}
        </button>
      </div>
    </div>
  );
};
