import React, { useState } from 'react';
import { useApp, PaymentTimingStatus } from '../context/AppContext';
import { useLanguage } from '../i18n/LanguageContext';
import { StatusBar } from '../components/common/StatusBar';
import { TopBar } from '../components/common/TopBar';
import { Icon } from '../components/common/Icon';
import { formatNaira } from '../data/types';

export const M12PayContribution: React.FC = () => {
  const {
    navigate,
    selectedPaymentMethod,
    setSelectedPaymentMethod,
    startPaymentSimulation,
    isNinVerified,
    showToast,
    totalCycleContribution,
    userPaidAmount,
    userRemainingBalance,
    paymentTimingStatus,
    setPaymentTimingStatus,
    paymentMode,
    setPaymentMode,
    customInstallmentAmount,
    setCustomInstallmentAmount,
    currentPaymentAmount,
    lateFeeAmount,
  } = useApp();
  const { t } = useLanguage();

  const [showMethodModal, setShowMethodModal] = useState(false);
  const [customInputText, setCustomInputText] = useState(customInstallmentAmount.toString());

  const paymentMethods = [
    {
      id: 'bankTransfer' as const,
      icon: 'bank',
      title: t('bankTransfer'),
      description: t('bankTransferDesc'),
    },
    {
      id: 'card' as const,
      icon: 'card',
      title: t('debitCard'),
      description: t('debitCardDesc'),
    },
    {
      id: 'ussd' as const,
      icon: 'hash',
      title: t('ussd'),
      description: t('ussdDesc'),
    },
  ];

  const handleCustomAmountChange = (raw: string) => {
    const numeric = Number(raw.replace(/[^0-9]/g, '')) || 0;
    const bounded = Math.max(100, Math.min(numeric, userRemainingBalance));
    setCustomInputText(numeric.toString());
    setCustomInstallmentAmount(bounded);
  };

  const handleAddPreset = (addVal: number) => {
    const newVal = Math.min(userRemainingBalance, (customInstallmentAmount || 0) + addVal);
    setCustomInstallmentAmount(newVal);
    setCustomInputText(newVal.toString());
  };

  const handlePay = () => {
    if (!isNinVerified) {
      showToast(
        'Paying is locked until your NIN is verified. Please verify your identity first.',
        'alert'
      );
      navigate('/verify');
      return;
    }

    if (currentPaymentAmount <= 0) {
      showToast('Please enter an amount to pay.', 'alert');
      return;
    }

    if (selectedPaymentMethod === 'ussd') {
      navigate('/pay/ussd');
    } else {
      setShowMethodModal(true);
    }
  };

  const progressPercent = Math.min(100, Math.round((userPaidAmount / totalCycleContribution) * 100));
  const remainingAfterPayment = Math.max(0, userRemainingBalance - (paymentMode === 'installment' ? currentPaymentAmount : userRemainingBalance));

  return (
    <div className="flex-1 bg-[#FAF7F0] flex flex-col justify-between overflow-y-auto hide-scrollbar">
      <div>
        <StatusBar mode="light" />
        <TopBar
          title={t('payContribution')}
          onBack={() => navigate('/home')}
          showBack={true}
        />

        <div className="px-5 pt-1 pb-6 space-y-4">
          {/* Timing Stage Control: Allows switching between Before Due Date, Due Day, and Late */}
          <div className="bg-white rounded-[14px] p-2.5 border border-[#E3DDCF] shadow-sm">
            <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-[#4F5F57] mb-1.5 px-1">
              <span>{t('timelineStage')}</span>
              <span className="font-mono text-[#0F8A5F]">
                {paymentTimingStatus === 'before_due'
                  ? t('beforeDue')
                  : paymentTimingStatus === 'due'
                  ? t('dueToday')
                  : t('overdueFee')}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-1.5">
              <button
                type="button"
                onClick={() => {
                  setPaymentTimingStatus('before_due');
                  setPaymentMode('full');
                }}
                className={`py-1.5 px-2 rounded-[8px] text-[11px] font-bold text-center transition-all cursor-pointer ${
                  paymentTimingStatus === 'before_due'
                    ? 'bg-[#E3F4EC] text-[#0B6E4B] border border-[#0F8A5F]'
                    : 'bg-[#FAF7F0] text-[#4F5F57] hover:bg-[#EFEAE0]'
                }`}
              >
                {t('beforeDue')}
              </button>

              <button
                type="button"
                onClick={() => {
                  setPaymentTimingStatus('due');
                  setPaymentMode('full');
                }}
                className={`py-1.5 px-2 rounded-[8px] text-[11px] font-bold text-center transition-all cursor-pointer ${
                  paymentTimingStatus === 'due'
                    ? 'bg-[#FFF4DB] text-[#8A5A00] border border-[#F2B33D]'
                    : 'bg-[#FAF7F0] text-[#4F5F57] hover:bg-[#EFEAE0]'
                }`}
              >
                {t('dueToday')}
              </button>

              <button
                type="button"
                onClick={() => {
                  setPaymentTimingStatus('late');
                  setPaymentMode('full');
                }}
                className={`py-1.5 px-2 rounded-[8px] text-[11px] font-bold text-center transition-all cursor-pointer ${
                  paymentTimingStatus === 'late'
                    ? 'bg-[#FDECEA] text-[#B42318] border border-[#B42318]'
                    : 'bg-[#FAF7F0] text-[#4F5F57] hover:bg-[#EFEAE0]'
                }`}
              >
                {t('overdueFee')}
              </button>
            </div>
          </div>

          {/* Group selector card */}
          <div className="p-3.5 rounded-[16px] bg-white border border-[#E3DDCF] shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-[12px] bg-[#E3F4EC] text-[#0F8A5F] flex items-center justify-center shrink-0">
                <Icon name="pot" size={22} strokeWidth={2.2} />
              </div>
              <div>
                <h4 className="font-heading font-bold text-[15px] text-[#0B3D2E]">
                  Kasuwa Atamfa Adashe
                </h4>
                <p className="text-[12px] text-[#4F5F57] mt-0.5">
                  Cycle 4 of 10 · {paymentTimingStatus === 'late' ? 'Due was Wed 28 Oct (Overdue)' : 'Due Wed 28 Oct'}
                </p>
              </div>
            </div>
            <Icon name="chevron-down" size={18} className="text-[#8A968F]" />
          </div>

          {/* Cycle installment progress tracker if user has paid something */}
          {userPaidAmount > 0 && (
            <div className="p-3.5 rounded-[14px] bg-white border border-[#E3DDCF] shadow-sm space-y-2">
              <div className="flex items-center justify-between text-[12px]">
                <span className="text-[#4F5F57] font-medium">Cycle 4 Contribution Progress:</span>
                <span className="font-bold text-[#0F8A5F]">{progressPercent}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#EFEAE0] overflow-hidden">
                <div
                  style={{ width: `${progressPercent}%` }}
                  className="h-full bg-[#0F8A5F] rounded-full transition-all duration-500"
                />
              </div>
              <div className="flex items-center justify-between text-[11px] text-[#4F5F57] font-medium">
                <span>Contributed: {formatNaira(userPaidAmount)}</span>
                <span className="text-[#8A5A00] font-semibold">Remaining: {formatNaira(userRemainingBalance)}</span>
              </div>
            </div>
          )}

          {/* Payment Mode Selector: ONLY Available Before Collection Due Date */}
          {paymentTimingStatus === 'before_due' ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[13px] font-semibold text-[#0B3D2E]">
                  {t('paymentOption')}
                </span>
                <span className="text-[11px] text-[#0F8A5F] font-semibold bg-[#E3F4EC] px-2 py-0.5 rounded-full">
                  {t('instalmentsAvailable')}
                </span>
              </div>

              {/* Toggle: Pay Full vs Pay in Instalment */}
              <div className="grid grid-cols-2 gap-2 bg-[#EFEAE0] p-1 rounded-[12px]">
                <button
                  type="button"
                  onClick={() => setPaymentMode('full')}
                  className={`py-2 px-3 rounded-[9px] text-[13px] font-semibold transition-all cursor-pointer ${
                    paymentMode === 'full'
                      ? 'bg-white text-[#0B3D2E] shadow-sm font-bold'
                      : 'text-[#4F5F57] hover:text-[#0B3D2E]'
                  }`}
                >
                  {t('payFull', { amount: formatNaira(userRemainingBalance) })}
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMode('installment')}
                  className={`py-2 px-3 rounded-[9px] text-[13px] font-semibold transition-all cursor-pointer ${
                    paymentMode === 'installment'
                      ? 'bg-white text-[#0B3D2E] shadow-sm font-bold'
                      : 'text-[#4F5F57] hover:text-[#0B3D2E]'
                  }`}
                >
                  {t('payInInstalment')}
                </button>
              </div>

              {/* Installment Custom Amount Picker */}
              {paymentMode === 'installment' && (
                <div className="p-4 rounded-[16px] bg-white border border-[#0F8A5F]/40 shadow-sm space-y-3 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between">
                    <label className="text-[13px] font-semibold text-[#0B3D2E]">
                      {t('enterCustomAmount')}
                    </label>
                    <span className="text-[11px] text-[#4F5F57]">
                      Max: {formatNaira(userRemainingBalance)}
                    </span>
                  </div>

                  {/* Input */}
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[18px] font-bold text-[#0B3D2E]">
                      ₦
                    </span>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={customInputText}
                      onChange={(e) => handleCustomAmountChange(e.target.value)}
                      className="w-full h-12 pl-9 pr-4 rounded-[10px] bg-[#FAF7F0] border border-[#E3DDCF] focus:border-[#0F8A5F] focus:bg-white focus:outline-none text-[18px] font-heading font-extrabold text-[#0B3D2E]"
                    />
                  </div>

                  {/* Quick Preset Buttons */}
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-medium text-[#4F5F57]">{t('quickAmounts')}</span>
                    <div className="flex flex-wrap gap-1.5">
                      {[500, 1000, 2000, 5000, 10000].map((val) => {
                        if (val > userRemainingBalance) return null;
                        return (
                          <button
                            key={val}
                            type="button"
                            onClick={() => {
                              setCustomInstallmentAmount(val);
                              setCustomInputText(val.toString());
                            }}
                            className={`px-2.5 py-1 rounded-[8px] text-[12px] font-semibold transition-all cursor-pointer ${
                              customInstallmentAmount === val
                                ? 'bg-[#0F8A5F] text-white shadow-sm'
                                : 'bg-[#FAF7F0] border border-[#E3DDCF] text-[#0B3D2E] hover:border-[#0F8A5F]'
                            }`}
                          >
                            +₦{val.toLocaleString()}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Remaining balance notice */}
                  <div className="pt-2 border-t border-[#EFEAE0] flex items-center justify-between text-[12px]">
                    <span className="text-[#4F5F57]">{t('balanceAfterPayment')}</span>
                    <span className="font-heading font-bold text-[#0B6E4B]">
                      {formatNaira(remainingAfterPayment)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          ) : paymentTimingStatus === 'due' ? (
            /* When Due Today: Inform user full payment is required */
            <div className="p-3.5 rounded-[14px] bg-[#FFF4DB] border border-[#F2B33D]/40 space-y-1">
              <div className="flex items-center gap-2 text-[#8A5A00]">
                <Icon name="clock" size={16} strokeWidth={2.4} />
                <span className="text-[13px] font-bold">{t('dueToday')}</span>
              </div>
              <p className="text-[12px] text-[#4F5F57] leading-relaxed">
                {t('paymentDueTodayBanner')}
              </p>
            </div>
          ) : (
            /* When Late / Past Grace Period: Full amount + late fee required all at once */
            <div className="p-4 rounded-[14px] bg-[#FDECEA] border border-[#B42318]/40 space-y-2">
              <div className="flex items-center gap-2 text-[#B42318]">
                <Icon name="alert" size={17} strokeWidth={2.4} />
                <span className="text-[13px] font-bold">{t('overdueFee')}</span>
              </div>
              <p className="text-[12px] text-[#4F5F57] leading-relaxed">
                {t('overdueBanner', { fee: '500' })}
              </p>
              <div className="pt-2 border-t border-[#B42318]/20 flex items-center justify-between text-[12px]">
                <span className="text-[#4F5F57]">{t('totalAmountWithFee')}:</span>
                <span className="font-heading font-extrabold text-[#B42318] text-[14px]">
                  {formatNaira(currentPaymentAmount)}
                </span>
              </div>
            </div>
          )}

          {/* Amount Display Card */}
          <div className="bg-white rounded-[16px] p-5 border border-[#E3DDCF] shadow-sm text-center">
            <span className="text-[12px] font-semibold uppercase tracking-wider text-[#4F5F57] block">
              {paymentTimingStatus === 'late'
                ? t('totalAmountWithFee')
                : paymentMode === 'installment' && paymentTimingStatus === 'before_due'
                ? t('amountToPay')
                : t('amountToPayInFull')}
            </span>
            <span className="font-heading font-extrabold text-[36px] text-[#0B3D2E] block my-1">
              {formatNaira(currentPaymentAmount)}
            </span>
            <span className="text-[12px] text-[#4F5F57] block">
              {paymentTimingStatus === 'late'
                ? `₦${userRemainingBalance.toLocaleString()} + ₦${lateFeeAmount.toLocaleString()} (${t('lateFeeToPot')})`
                : paymentMode === 'installment' && paymentTimingStatus === 'before_due'
                ? `₦${remainingAfterPayment.toLocaleString()} ${t('remaining')}`
                : 'Cycle 4'}
            </span>
          </div>

          {/* How do you want to pay? Radio list */}
          <div>
            <h3 className="font-heading font-bold text-[16px] text-[#0B3D2E] mb-2.5">
              {t('howWantToPay')}
            </h3>

            <div className="bg-white rounded-[16px] border border-[#E3DDCF] shadow-sm divide-y divide-[#EFEAE0] overflow-hidden">
              {paymentMethods.map((method) => {
                const isSelected = selectedPaymentMethod === method.id;
                return (
                  <div
                    key={method.id}
                    onClick={() => setSelectedPaymentMethod(method.id)}
                    className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-[#FAF7F0] transition-colors"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-[12px] bg-[#FAF7F0] text-[#0B3D2E] flex items-center justify-center shrink-0">
                        <Icon name={method.icon} size={20} strokeWidth={2.2} />
                      </div>
                      <div>
                        <span className="font-heading font-bold text-[14px] text-[#0B3D2E] block">
                          {method.title}
                        </span>
                        <span className="text-[12px] text-[#4F5F57] block mt-0.5">
                          {method.description}
                        </span>
                      </div>
                    </div>

                    {/* Radio indicator */}
                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                        isSelected
                          ? 'border-[#0F8A5F] bg-[#0F8A5F]'
                          : 'border-[#8A968F] bg-white'
                      }`}
                    >
                      {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Note with lock icon */}
          <div className="p-3.5 rounded-[14px] bg-[#E3F4EC] border border-[#0F8A5F]/20 flex items-start gap-2.5">
            <Icon name="lock" size={17} className="text-[#0F8A5F] mt-0.5 shrink-0" />
            <p className="text-[12px] text-[#0B3D2E] leading-snug">
              {t('groupEscrowAssurance')}
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-5 pt-3 pb-8 bg-white border-t border-[#E3DDCF]">
        <button
          type="button"
          onClick={handlePay}
          className="w-full h-[52px] rounded-[14px] bg-[#0F8A5F] active:bg-[#0B6E4B] text-white font-heading font-bold text-[16px] flex items-center justify-center cursor-pointer shadow-sm hover:brightness-105 transition-all"
        >
          {t('payNowAmount', { amount: formatNaira(currentPaymentAmount) })}
        </button>
      </div>

      {/* Confirmation Modal for Card / Bank transfer */}
      {showMethodModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-5 bg-black/50 backdrop-blur-[2px]">
          <div className="bg-white rounded-[20px] p-5 max-w-[340px] w-full text-center shadow-2xl border border-[#E3DDCF]">
            <div className="w-12 h-12 rounded-full bg-[#E3F4EC] text-[#0F8A5F] flex items-center justify-center mx-auto mb-3">
              <Icon name="check" size={24} strokeWidth={2.5} />
            </div>
            <h3 className="font-heading font-bold text-[18px] text-[#0B3D2E] mb-1">
              Confirm Payment
            </h3>
            <p className="text-[13px] text-[#4F5F57] mb-4">
              Send <strong className="text-[#0B3D2E]">{formatNaira(currentPaymentAmount)}</strong> {paymentMode === 'installment' && paymentTimingStatus === 'before_due' ? 'instalment' : 'contribution'} for Kasuwa Atamfa via {selectedPaymentMethod === 'card' ? 'Debit Card' : 'Bank Transfer'}?
            </p>
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => {
                  setShowMethodModal(false);
                  startPaymentSimulation(currentPaymentAmount);
                  navigate('/pay/receipt');
                }}
                className="w-full h-11 rounded-[12px] bg-[#0F8A5F] text-white font-semibold text-[14px] cursor-pointer"
              >
                Proceed to receipt
              </button>
              <button
                type="button"
                onClick={() => setShowMethodModal(false)}
                className="w-full h-10 rounded-[12px] text-[#4F5F57] font-medium text-[13px] cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
