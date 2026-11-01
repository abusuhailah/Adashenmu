import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../i18n/LanguageContext';
import { StatusBar } from '../components/common/StatusBar';
import { TopBar } from '../components/common/TopBar';
import { Icon } from '../components/common/Icon';
import { formatNaira, PaymentProof } from '../data/types';

export const M12PayContribution: React.FC = () => {
  const {
    navigate,
    groups,
    activeGroup,
    selectedGroupId,
    setSelectedGroupId,
    submitMemberPayment,
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
    currentUser,
  } = useApp();
  const { language, t } = useLanguage();

  const [receiptImage, setReceiptImage] = useState<string | null>(null);
  const [referenceNumber, setReferenceNumber] = useState('');
  const [paymentNote, setPaymentNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedAccount, setCopiedAccount] = useState(false);

  // Fallback to active group or first group
  const targetGroup = activeGroup || groups[0] || null;

  if (!targetGroup) {
    return (
      <div className="flex-1 bg-[#FAF7F0] flex flex-col justify-between overflow-y-auto">
        <StatusBar mode="light" />
        <TopBar title={t('payContribution')} onBack={() => navigate('/home')} showBack={true} />
        <div className="p-6 text-center space-y-4 my-auto">
          <div className="w-16 h-16 rounded-full bg-[#E3F4EC] text-[#0F8A5F] flex items-center justify-center mx-auto">
            <Icon name="wallet" size={30} strokeWidth={2.2} />
          </div>
          <h3 className="font-heading font-bold text-[18px] text-[#0B3D2E]">
            {language === 'ha' ? 'Ba ka cikin kowace ƙungiya tukuna' : 'No Active Savings Group'}
          </h3>
          <p className="text-[13px] text-[#4F5F57]">
            {language === 'ha'
              ? 'Ku shiga ko ƙirƙirar ƙungiya domin fara biyan kuɗin adashe tare da al\'ummanku.'
              : 'Join or create a group to start making transparent rotating contributions.'}
          </p>
          <div className="pt-2 space-y-2 max-w-xs mx-auto">
            <button
              type="button"
              onClick={() => navigate('/groups/new/rules')}
              className="w-full h-11 rounded-[12px] bg-[#0F8A5F] text-white font-bold text-[14px] cursor-pointer"
            >
              {language === 'ha' ? 'Ƙirƙiri Ƙungiya' : 'Create a Group'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/groups')}
              className="w-full h-11 rounded-[12px] bg-white border border-[#E3DDCF] text-[#0B3D2E] font-semibold text-[14px] cursor-pointer"
            >
              {language === 'ha' ? 'Duba Ƙungiyoyi' : 'Browse Groups'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const organiserAccount = targetGroup.organiserAccount || {
    bankName: targetGroup.wallet?.bankName || 'Organizer Bank',
    accountNumber: targetGroup.wallet?.accountNumber || '',
    accountName: targetGroup.organiserName || 'Group Organiser',
  };

  const handleCopyAccount = () => {
    navigator.clipboard?.writeText(organiserAccount.accountNumber);
    setCopiedAccount(true);
    showToast(
      language === 'ha'
        ? `An kwafi lambar asusun banki: ${organiserAccount.accountNumber}`
        : `Account number copied: ${organiserAccount.accountNumber}`,
      'success'
    );
    setTimeout(() => setCopiedAccount(false), 3000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) {
        showToast('Receipt file is too large. Max 4MB allowed.', 'alert');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        setReceiptImage(reader.result as string);
        showToast(language === 'ha' ? 'An ɗora hoton shaidar biya!' : 'Proof of payment receipt attached!', 'success');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitPayment = async () => {
    if (currentPaymentAmount <= 0) {
      showToast('Please enter an amount to contribute.', 'alert');
      return;
    }

    if (!receiptImage && !referenceNumber.trim()) {
      showToast(
        language === 'ha'
          ? 'Da fatan za a ɗora hoton shaidar biya ko lambar shaidar ciniki (Transaction Reference)'
          : 'Please attach proof of payment (screenshot receipt or transaction reference number)',
        'alert'
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const proof: PaymentProof = {
        attachedAt: new Date().toISOString(),
        receiptUrl: receiptImage || undefined,
        referenceNumber: referenceNumber.trim() || undefined,
        note: paymentNote.trim() || undefined,
      };

      await submitMemberPayment(
        targetGroup.id,
        currentPaymentAmount,
        currentPaymentAmount >= userRemainingBalance,
        'bankTransfer',
        proof
      );

      navigate('/pay/receipt');
    } catch (err: any) {
      showToast(err.message || 'Payment submission error', 'alert');
    } finally {
      setIsSubmitting(false);
    }
  };

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
          {/* Target Group Selector (if member has multiple groups) */}
          {groups.length > 1 ? (
            <div>
              <label className="block text-[12px] font-semibold text-[#4F5F57] mb-1">
                {language === 'ha' ? 'Zaɓi Ƙungiya' : 'Select Group to Pay'}
              </label>
              <select
                value={targetGroup.id}
                onChange={(e) => setSelectedGroupId(e.target.value)}
                className="w-full h-11 px-3.5 rounded-[12px] bg-white border border-[#E3DDCF] font-heading font-bold text-[14px] text-[#0B3D2E] focus:border-[#0F8A5F] focus:outline-none"
              >
                {groups.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name} ({formatNaira(g.rules.amount)})
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className="p-3.5 rounded-[16px] bg-white border border-[#E3DDCF] shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-[12px] bg-[#E3F4EC] text-[#0F8A5F] flex items-center justify-center shrink-0">
                  <Icon name="pot" size={22} strokeWidth={2.2} />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-[15px] text-[#0B3D2E]">
                    {targetGroup.name}
                  </h4>
                  <p className="text-[12px] text-[#4F5F57] mt-0.5">
                    {language === 'ha' ? 'Zango' : 'Cycle'} {targetGroup.currentCycle?.number || 1} · Due {targetGroup.rules.dueDay}
                  </p>
                </div>
              </div>
              <span className="text-[11px] font-bold text-[#0F8A5F] bg-[#E3F4EC] px-2 py-0.5 rounded-full">
                {formatNaira(targetGroup.rules.amount)}
              </span>
            </div>
          )}

          {/* Payment Type: Full or Installment */}
          <div className="bg-white rounded-[16px] p-4 border border-[#E3DDCF] shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[12px] font-semibold text-[#4F5F57] uppercase tracking-wider">
                {language === 'ha' ? 'Zaɓin Biya' : 'Payment Option'}
              </span>
              <span className="text-[11px] text-[#0F8A5F] font-bold bg-[#E3F4EC] px-2 py-0.5 rounded-full flex items-center gap-1">
                <Icon name="bank" size={12} strokeWidth={2.5} />
                {language === 'ha' ? 'Bank Transfer' : 'Bank Transfer Only'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 bg-[#FAF7F0] p-1 rounded-[12px] border border-[#E3DDCF]">
              <button
                type="button"
                onClick={() => setPaymentMode('full')}
                className={`h-10 rounded-[10px] text-[13px] font-bold transition-all cursor-pointer ${
                  paymentMode === 'full'
                    ? 'bg-[#0B3D2E] text-white shadow-sm'
                    : 'text-[#4F5F57] hover:text-[#0B3D2E]'
                }`}
              >
                {language === 'ha' ? 'Biya Gaba Ɗaya' : 'Full Payment'}
              </button>
              <button
                type="button"
                onClick={() => setPaymentMode('installment')}
                className={`h-10 rounded-[10px] text-[13px] font-bold transition-all cursor-pointer ${
                  paymentMode === 'installment'
                    ? 'bg-[#0B3D2E] text-white shadow-sm'
                    : 'text-[#4F5F57] hover:text-[#0B3D2E]'
                }`}
              >
                {language === 'ha' ? 'Biya a Hankali' : 'Pay in Installment'}
              </button>
            </div>

            {paymentMode === 'installment' && (
              <div className="pt-2 space-y-2 border-t border-[#E3DDCF]">
                <label className="block text-[12px] font-semibold text-[#4F5F57]">
                  {language === 'ha' ? 'Adadin da kake so ka biya yanzu (₦)' : 'Installment Amount to Pay Now (₦)'}
                </label>
                <div className="flex items-center gap-2">
                  {[5000, 10000, 15000].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setCustomInstallmentAmount(preset)}
                      className={`px-3 py-1.5 rounded-[8px] text-[12px] font-bold border transition-colors cursor-pointer ${
                        customInstallmentAmount === preset
                          ? 'bg-[#E3F4EC] border-[#0F8A5F] text-[#0F8A5F]'
                          : 'bg-white border-[#E3DDCF] text-[#4F5F57]'
                      }`}
                    >
                      {formatNaira(preset)}
                    </button>
                  ))}
                </div>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-[#0B3D2E]">₦</span>
                  <input
                    type="number"
                    min={1000}
                    max={userRemainingBalance}
                    value={customInstallmentAmount}
                    onChange={(e) => setCustomInstallmentAmount(Number(e.target.value) || 0)}
                    className="w-full h-11 pl-8 pr-3.5 rounded-[10px] bg-[#FAF7F0] border border-[#E3DDCF] font-heading font-bold text-[15px] text-[#0B3D2E] focus:border-[#0F8A5F] focus:outline-none"
                  />
                </div>
                <p className="text-[11px] text-[#4F5F57]">
                  {language === 'ha'
                    ? `Sauran kuɗi bayan wannan: ${formatNaira(Math.max(0, userRemainingBalance - customInstallmentAmount))}`
                    : `Remaining balance after this payment: ${formatNaira(Math.max(0, userRemainingBalance - customInstallmentAmount))}`}
                </p>
              </div>
            )}
          </div>

          {/* Amount to Pay Card */}
          <div className="bg-white rounded-[16px] p-5 border border-[#E3DDCF] shadow-sm text-center">
            <span className="text-[12px] font-semibold uppercase tracking-wider text-[#4F5F57] block">
              {paymentTimingStatus === 'late'
                ? t('totalAmountWithFee')
                : paymentMode === 'installment'
                ? (language === 'ha' ? 'Adadin Biya a Hankali' : 'Installment Amount to Pay')
                : t('amountToPayInFull')}
            </span>
            <span className="font-heading font-extrabold text-[36px] text-[#0B3D2E] block my-1">
              {formatNaira(currentPaymentAmount)}
            </span>
            <span className="text-[12px] text-[#4F5F57] block">
              {language === 'ha'
                ? `Ku tura wannan adadin kai tsaye zuwa asusun mai shirya da ke ƙasa`
                : `Transfer this exact amount to the organiser account below`}
            </span>
          </div>

          {/* ORGANISER'S BANK ACCOUNT: Where payment goes */}
          <div className="bg-[#0B3D2E] text-white rounded-[16px] p-4.5 border border-[#2FBF85]/30 shadow-md space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Icon name="bank" size={17} className="text-[#2FBF85]" />
                <span className="text-[13px] font-bold uppercase tracking-wider text-[#2FBF85]">
                  {language === 'ha' ? 'Asusun Mai Shirya' : 'Organiser Receiving Account'}
                </span>
              </div>
              <span className="text-[11px] font-semibold bg-[#072A20] text-[#2FBF85] px-2 py-0.5 rounded border border-[#2FBF85]/30">
                Verified
              </span>
            </div>

            <div className="p-3.5 rounded-[12px] bg-[#072A20] border border-[#2FBF85]/20 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[12px] text-white/70">
                  {language === 'ha' ? 'Banki' : 'Bank'}
                </span>
                <span className="text-[13px] font-bold text-white">
                  {organiserAccount.bankName}
                </span>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[12px] text-white/70">
                  {language === 'ha' ? 'Lambar Asusu' : 'Account Number'}
                </span>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-extrabold text-[16px] text-[#2FBF85] tracking-wider">
                    {organiserAccount.accountNumber}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyAccount}
                    title="Copy Account Number"
                    className="p-1 rounded bg-[#0B3D2E] text-white hover:text-[#2FBF85] cursor-pointer"
                  >
                    <Icon name={copiedAccount ? 'check' : 'copy'} size={15} strokeWidth={2.4} />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-white/10">
                <span className="text-[12px] text-white/70">
                  {language === 'ha' ? 'Sunan Mai Asusu' : 'Account Name'}
                </span>
                <span className="text-[13px] font-semibold text-white/95">
                  {organiserAccount.accountName}
                </span>
              </div>
            </div>

            <p className="text-[11px] text-white/75 leading-relaxed">
              {language === 'ha'
                ? 'Tura kuɗin ta bank transfer ko ussd. Bayan an tura, ɗora shaidar biya (receipt) a ƙasa domin mai shirya ya tantance.'
                : 'Transfer via bank mobile app or USSD, then attach your receipt screenshot below so the organiser can verify and confirm.'}
            </p>
          </div>

          {/* ATTACH PROOF OF PAYMENT: Mandatory for live transparency */}
          <div className="bg-white rounded-[16px] p-4.5 border border-[#E3DDCF] shadow-sm space-y-3">
            <div className="flex items-center gap-2">
              <Icon name="shield" size={17} className="text-[#0F8A5F]" />
              <h3 className="font-heading font-bold text-[15px] text-[#0B3D2E]">
                {language === 'ha' ? 'Shaidar Biyan Kuɗi (Proof of Payment)' : 'Attach Proof of Payment'}
              </h3>
            </div>

            <p className="text-[12px] text-[#4F5F57] leading-relaxed">
              {language === 'ha'
                ? 'Ɗora hoton shaidar biya ko saka lambar ciniki (Reference Number) domin mai shirya ya duba ya amince.'
                : 'Upload your transfer receipt screenshot or enter the transaction reference so the organiser can confirm your payment.'}
            </p>

            {/* Receipt file upload */}
            <div className="space-y-2">
              <label className="block text-[12px] font-semibold text-[#4F5F57]">
                {language === 'ha' ? 'Hoton Shaidar Biya (Screenshot / Photo)' : 'Payment Receipt (Screenshot or Photo)'}
              </label>

              {receiptImage ? (
                <div className="relative rounded-[12px] overflow-hidden border border-[#0F8A5F]/40 bg-[#FAF7F0] p-2 flex items-center gap-3">
                  <img
                    src={receiptImage}
                    alt="Receipt"
                    className="w-16 h-16 object-cover rounded-[8px] border border-[#E3DDCF]"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-[13px] font-bold text-[#0B3D2E] block truncate">
                      receipt_proof.jpg
                    </span>
                    <span className="text-[11px] text-[#0F8A5F] font-semibold flex items-center gap-1 mt-0.5">
                      <Icon name="check" size={12} strokeWidth={2.5} />
                      {language === 'ha' ? 'An ɗora shaidar biya' : 'Receipt attached'}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setReceiptImage(null)}
                    className="px-2.5 py-1 text-[12px] font-semibold text-[#B42318] hover:underline cursor-pointer"
                  >
                    {language === 'ha' ? 'Cire' : 'Remove'}
                  </button>
                </div>
              ) : (
                <label className="border-2 border-dashed border-[#E3DDCF] hover:border-[#0F8A5F] rounded-[12px] p-4 flex flex-col items-center justify-center text-center cursor-pointer bg-[#FAF7F0] hover:bg-[#E3F4EC]/30 transition-colors">
                  <Icon name="wallet" size={24} className="text-[#0F8A5F] mb-1.5" />
                  <span className="text-[13px] font-bold text-[#0B3D2E]">
                    {language === 'ha' ? 'Danna domin ɗora hoton shaidar biya' : 'Click to upload receipt screenshot'}
                  </span>
                  <span className="text-[11px] text-[#4F5F57] mt-0.5">
                    PNG, JPG, or PDF up to 4MB
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {/* Transaction reference number */}
            <div>
              <label className="block text-[12px] font-semibold text-[#4F5F57] mb-1">
                {language === 'ha' ? 'Lambar Shaidar Ciniki (Transaction Reference / Session ID)' : 'Transaction Reference / Narration'}
              </label>
              <input
                type="text"
                value={referenceNumber}
                onChange={(e) => setReferenceNumber(e.target.value)}
                placeholder="e.g. 0000132894109284 or GTB/TRX/8821"
                className="w-full h-11 px-3.5 rounded-[10px] bg-[#FAF7F0] border border-[#E3DDCF] font-mono text-[13px] font-medium text-[#0B3D2E] focus:border-[#0F8A5F] focus:outline-none"
              />
            </div>

            {/* Optional note */}
            <div>
              <label className="block text-[12px] font-semibold text-[#4F5F57] mb-1">
                {language === 'ha' ? 'Ƙarin Bayani (Na zaɓi)' : 'Payment Note (Optional)'}
              </label>
              <input
                type="text"
                value={paymentNote}
                onChange={(e) => setPaymentNote(e.target.value)}
                placeholder="e.g. Paid from my OPay account"
                className="w-full h-10 px-3 rounded-[10px] bg-[#FAF7F0] border border-[#E3DDCF] text-[13px] text-[#0B3D2E] focus:border-[#0F8A5F] focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Footer Submit Button */}
      <div className="p-5 pt-3 pb-8 bg-white border-t border-[#E3DDCF]">
        <button
          type="button"
          disabled={isSubmitting}
          onClick={handleSubmitPayment}
          className="w-full h-[52px] rounded-[14px] bg-[#0F8A5F] active:bg-[#0B6E4B] text-white font-heading font-bold text-[16px] flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:brightness-105 transition-all disabled:opacity-50"
        >
          {isSubmitting ? (
            <span>{language === 'ha' ? 'Ana aikawa…' : 'Submitting payment…'}</span>
          ) : (
            <>
              <Icon name="check" size={18} strokeWidth={2.5} />
              <span>
                {language === 'ha'
                  ? `Na Tura ${formatNaira(currentPaymentAmount)} · Aika Shaidar Biya`
                  : `I Have Transferred ${formatNaira(currentPaymentAmount)} · Submit Proof`}
              </span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
