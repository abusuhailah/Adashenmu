import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../i18n/LanguageContext';
import { StatusBar } from '../components/common/StatusBar';
import { Avatar } from '../components/common/Avatar';
import { Icon } from '../components/common/Icon';
import { formatNaira, InvitePreview, BankAccountDetails } from '../data/types';
import { fetchInvitePreview } from '../lib/firebase';

export const W01InviteWebPage: React.FC = () => {
  const {
    navigate,
    joinGroupByCodeOrId,
    showToast,
    currentRoute,
    liveUserProfile,
    signInWithGoogle,
    groups,
    partnerBank,
  } = useApp();
  const { language, t } = useLanguage();
  const [isJoining, setIsJoining] = useState(false);
  const [invitePreview, setInvitePreview] = useState<InvitePreview | null>(null);

  // Member Payout Bank Details
  const [payoutBankName, setPayoutBankName] = useState(partnerBank?.bankName || '');
  const [payoutAccountNumber, setPayoutAccountNumber] = useState(partnerBank?.accountNumber || '');
  const [payoutAccountName, setPayoutAccountName] = useState(liveUserProfile?.displayName || partnerBank?.accountName || '');
  const [agreedToRules, setAgreedToRules] = useState(true);

  // Extract invite code or ID from URL path: /join/:codeOrId
  const pathParam = currentRoute.startsWith('/join/')
    ? currentRoute.replace('/join/', '').trim()
    : 'ADAS-8492';

  useEffect(() => {
    let isMounted = true;
    async function loadInvite() {
      const preview = await fetchInvitePreview(pathParam);
      if (isMounted && preview) {
        setInvitePreview(preview);
      }
    }
    loadInvite();
    return () => {
      isMounted = false;
    };
  }, [pathParam]);

  // Update default account name if user profile loads
  useEffect(() => {
    if (liveUserProfile?.displayName && !payoutAccountName) {
      setPayoutAccountName(liveUserProfile.displayName);
    }
  }, [liveUserProfile?.displayName]);

  // Safe preview data
  const groupName = invitePreview?.name || 'Kasuwa Market Savings';
  const groupCode = invitePreview?.code || pathParam.toUpperCase();
  const amount = invitePreview?.amount || 20000;
  const frequency = invitePreview?.frequency || 'monthly';
  const dueDay = invitePreview?.dueDay || '28th of each month';
  const size = invitePreview?.size || 5;
  const memberCount = invitePreview?.memberCount || 1;
  const organiserName = invitePreview?.organiserName || 'Organiser';
  const targetGroupId = invitePreview?.groupId || pathParam;
  const organiserBank = invitePreview?.organiserAccount?.bankName || 'Organizer Bank Account';

  const totalPayout = amount * size;

  const isAlreadyMember = groups.some(
    (g) => g.id === targetGroupId || (g.code && g.code.toUpperCase() === groupCode.toUpperCase())
  );

  const handleAcceptAndJoin = async () => {
    if (isAlreadyMember) {
      navigate(`/groups/${targetGroupId}/ledger`);
      return;
    }

    if (!liveUserProfile) {
      const prof = await signInWithGoogle();
      if (!prof) return;
    }

    if (!payoutBankName) {
      showToast(
        language === 'ha'
          ? 'Da fatan za a zaɓi bankin da za a tura muku kuɗin rabo'
          : 'Please select your payout bank from the list',
        'alert'
      );
      return;
    }

    if (!payoutAccountNumber.trim() || payoutAccountNumber.trim().length !== 10) {
      showToast(
        language === 'ha'
          ? 'Lambar asusun banki dole ta kasance lambobi 10'
          : 'Please enter a valid 10-digit bank account number',
        'alert'
      );
      return;
    }

    if (!payoutAccountName.trim()) {
      showToast(
        language === 'ha'
          ? 'Da fatan za a saka sunan mai asusu'
          : 'Please enter the account holder name',
        'alert'
      );
      return;
    }

    if (!agreedToRules) {
      showToast(
        language === 'ha'
          ? 'Dole ne ku amince da dokokin ƙungiya'
          : 'You must agree to the group rules before joining',
        'alert'
      );
      return;
    }

    setIsJoining(true);
    try {
      const memberPayoutDetails: BankAccountDetails = {
        bankName: payoutBankName,
        accountNumber: payoutAccountNumber.trim(),
        accountName: payoutAccountName.trim() || (liveUserProfile?.displayName || 'Member'),
      };

      const joined = await joinGroupByCodeOrId(groupCode || targetGroupId, memberPayoutDetails);
      showToast(
        language === 'ha'
          ? `Barka da zuwa! Kun shiga "${groupName}".`
          : `Welcome! You have joined "${groupName}".`,
        'success'
      );
      setIsJoining(false);
      navigate(`/groups/${joined.id}/ledger`);
    } catch (err: any) {
      setIsJoining(false);
      showToast(err.message || 'Error joining group', 'alert');
    }
  };

  return (
    <div className="flex-1 bg-[#FAF7F0] flex flex-col justify-between overflow-y-auto hide-scrollbar">
      <div>
        <StatusBar mode="light" />

        {/* Mobile Browser URL Pill */}
        <div className="px-5 py-2">
          <div className="h-9 px-3.5 rounded-full bg-[#EEF0EE] border border-[#E3DDCF] flex items-center gap-2 text-[12px] text-[#4F5F57] font-mono">
            <Icon name="lock" size={13} className="text-[#0F8A5F] shrink-0" />
            <span className="truncate">adashenmu.app/join/{groupCode}</span>
          </div>
        </div>

        <div className="px-5 pt-3 pb-6 space-y-4">
          {/* Brand mark */}
          <div className="flex items-center gap-2">
            <img src="/brand/adashenmu-mark.svg" alt="Adashenmu" className="w-8 h-8 object-contain" />
            <span className="font-heading font-extrabold text-[20px] text-[#0B3D2E] tracking-tight">
              adashenmu
            </span>
          </div>

          {/* Inviter row */}
          <div className="flex items-center gap-3.5 p-3 rounded-[14px] bg-white border border-[#E3DDCF] shadow-xs">
            <Avatar initials={organiserName.slice(0, 2).toUpperCase()} color="clay" size={44} />
            <div>
              <p className="text-[14px] font-semibold text-[#0B3D2E]">
                {language === 'ha'
                  ? `${organiserName} ya gayyace ku shiga`
                  : `${organiserName} invited you to join`}
              </p>
              <div className="flex items-center gap-1.5 text-[12px] text-[#0F8A5F] font-medium mt-0.5">
                <Icon name="shield" size={13} strokeWidth={2.4} />
                <span>
                  {language === 'ha' ? 'Mai shirya ƙungiya · Asusun Google' : 'Organiser · Google Account'}
                </span>
              </div>
            </div>
          </div>

          {/* Group details card from safe preview */}
          <div className="bg-white rounded-[16px] p-4 border border-[#E3DDCF] shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-heading font-bold text-[20px] text-[#0B3D2E]">{groupName}</h2>
              {groupCode && (
                <span className="text-[11px] font-mono font-bold bg-[#FAF7F0] px-2 py-0.5 rounded border border-[#E3DDCF] text-[#0B3D2E]">
                  {groupCode}
                </span>
              )}
            </div>

            {/* Three stat tiles */}
            <div className="grid grid-cols-3 gap-2 py-3 border-y border-[#EFEAE0] mb-4">
              <div className="text-center">
                <span className="block text-[11px] text-[#4F5F57] uppercase tracking-wider font-medium">
                  {frequency === 'weekly'
                    ? language === 'ha' ? 'Kowane mako' : 'Each week'
                    : language === 'ha' ? 'Kowane wata' : 'Each month'}
                </span>
                <span className="block font-heading font-bold text-[16px] text-[#0B3D2E] mt-0.5">
                  {formatNaira(amount)}
                </span>
              </div>
              <div className="text-center border-x border-[#EFEAE0]">
                <span className="block text-[11px] text-[#4F5F57] uppercase tracking-wider font-medium">
                  {language === 'ha' ? 'Mambobi' : 'Members'}
                </span>
                <span className="block font-heading font-bold text-[16px] text-[#0B3D2E] mt-0.5">
                  {memberCount} / {size}
                </span>
              </div>
              <div className="text-center">
                <span className="block text-[11px] text-[#4F5F57] uppercase tracking-wider font-medium">
                  {language === 'ha' ? 'Jimillar Rabo' : 'Payout'}
                </span>
                <span className="block font-heading font-bold text-[16px] text-[#0F8A5F] mt-0.5">
                  {formatNaira(totalPayout)}
                </span>
              </div>
            </div>

            {/* Rules everyone accepts */}
            <h4 className="text-[13px] font-semibold text-[#0B3D2E] mb-2.5">
              {language === 'ha' ? 'Dokokin da kowa ya amince da su' : 'Rules everyone accepts'}
            </h4>
            <div className="space-y-2 text-[13px] text-[#4F5F57]">
              <div className="flex items-start gap-2.5">
                <div className="w-4 h-4 rounded-full bg-[#E3F4EC] text-[#0F8A5F] flex items-center justify-center shrink-0 mt-0.5">
                  <Icon name="check" size={10} strokeWidth={3} />
                </div>
                <span>
                  {language === 'ha'
                    ? `Biyan kuɗi: ${dueDay}`
                    : `Pay on ${dueDay}`}
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <div className="w-4 h-4 rounded-full bg-[#E3F4EC] text-[#0F8A5F] flex items-center justify-center shrink-0 mt-0.5">
                  <Icon name="check" size={10} strokeWidth={3} />
                </div>
                <span>
                  {language === 'ha'
                    ? 'Kowanne mamba yana samun rabonsa akan lokaci a kalandar rabo'
                    : 'Transparent rotation calendar with confirmed turns and dates'}
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <div className="w-4 h-4 rounded-full bg-[#E3F4EC] text-[#0F8A5F] flex items-center justify-center shrink-0 mt-0.5">
                  <Icon name="check" size={10} strokeWidth={3} />
                </div>
                <span>
                  {language === 'ha'
                    ? `Biya yana zuwa asusun mai shirya a ${organiserBank}`
                    : `Payments transfer to organiser account at ${organiserBank}`}
                </span>
              </div>
            </div>
          </div>

          {/* Member's Payout Account Input: REQUIRED FOR RECEIVING PAYOUT */}
          <div className="bg-white rounded-[16px] p-4.5 border border-[#0F8A5F]/40 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-[#0B3D2E]">
              <Icon name="bank" size={18} className="text-[#0F8A5F]" />
              <h4 className="font-heading font-bold text-[15px]">
                {language === 'ha' ? 'Asusun Bankin Karɓar Rabon Kuɗi' : 'Your Payout Bank Account'}
              </h4>
            </div>
            <p className="text-[12px] text-[#4F5F57] leading-relaxed">
              {language === 'ha'
                ? 'Saka asusun bankin da mai shirya zai tura muku kudin rabo lokacin da juyinku ya yi.'
                : 'Enter the bank account where the organiser will transfer your pot payout when it is your turn.'}
            </p>

            <div className="space-y-2.5 pt-1">
              <div>
                <label className="block text-[12px] font-semibold text-[#4F5F57] mb-1">
                  {language === 'ha' ? 'Sunan Banki' : 'Bank Name'}
                </label>
                <select
                  value={payoutBankName}
                  onChange={(e) => setPayoutBankName(e.target.value)}
                  className="w-full h-11 px-3 rounded-[10px] bg-[#FAF7F0] border border-[#E3DDCF] text-[14px] font-semibold text-[#0B3D2E] focus:border-[#0F8A5F] focus:outline-none"
                >
                  <option value="">-- Select Payout Bank --</option>
                  <option value="Guaranty Trust Bank (GTBank)">Guaranty Trust Bank (GTBank)</option>
                  <option value="Access Bank">Access Bank</option>
                  <option value="Zenith Bank">Zenith Bank</option>
                  <option value="First Bank of Nigeria">First Bank of Nigeria</option>
                  <option value="United Bank for Africa (UBA)">United Bank for Africa (UBA)</option>
                  <option value="Kuda Bank">Kuda Bank (Microfinance)</option>
                  <option value="OPay">OPay</option>
                  <option value="Palmpay">Palmpay</option>
                  <option value="Stanbic IBTC">Stanbic IBTC</option>
                  <option value="Fidelity Bank">Fidelity Bank</option>
                </select>
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-[#4F5F57] mb-1">
                  {language === 'ha' ? 'Lambar Asusun Banki (10 digits)' : 'Account Number (10 digits)'}
                </label>
                <input
                  type="text"
                  maxLength={10}
                  inputMode="numeric"
                  value={payoutAccountNumber}
                  onChange={(e) => setPayoutAccountNumber(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="0123456789"
                  className="w-full h-11 px-3 rounded-[10px] bg-[#FAF7F0] border border-[#E3DDCF] font-mono text-[15px] font-bold text-[#0B3D2E] focus:border-[#0F8A5F] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-[#4F5F57] mb-1">
                  {language === 'ha' ? 'Sunan Mai Asusu' : 'Account Name'}
                </label>
                <input
                  type="text"
                  value={payoutAccountName}
                  onChange={(e) => setPayoutAccountName(e.target.value)}
                  placeholder="Full name as on bank account"
                  className="w-full h-11 px-3 rounded-[10px] bg-[#FAF7F0] border border-[#E3DDCF] text-[14px] font-semibold text-[#0B3D2E] focus:border-[#0F8A5F] focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Rules acceptance check */}
          <label className="flex items-start gap-2.5 cursor-pointer select-none px-1">
            <input
              type="checkbox"
              checked={agreedToRules}
              onChange={(e) => setAgreedToRules(e.target.checked)}
              className="w-4 h-4 rounded text-[#0F8A5F] accent-[#0F8A5F] mt-0.5 shrink-0 cursor-pointer"
            />
            <span className="text-[12px] text-[#0B3D2E] leading-snug">
              {language === 'ha'
                ? 'Na amince da biyan kuɗin adashe a ranar da aka tsara kuma na karɓi rabona a kalandar rabo.'
                : 'I agree to pay my contribution on schedule and collect my payout according to the agreed calendar.'}
            </span>
          </label>
        </div>
      </div>

      {/* Footer */}
      <div className="p-5 pt-3 pb-8 bg-white border-t border-[#E3DDCF] space-y-2">
        <button
          type="button"
          disabled={isJoining}
          onClick={handleAcceptAndJoin}
          className="w-full h-[52px] rounded-[14px] bg-[#0F8A5F] active:bg-[#0B6E4B] text-white font-heading font-bold text-[15px] flex items-center justify-center gap-2.5 cursor-pointer shadow-sm hover:brightness-105 transition-all disabled:opacity-50"
        >
          {isJoining ? (
            <span>{language === 'ha' ? 'Ana shiga…' : 'Joining group…'}</span>
          ) : isAlreadyMember ? (
            <span>{language === 'ha' ? 'Kun riga kun shiga · Bude Ƙungiya' : 'You are a member · Open Ledger'}</span>
          ) : !liveUserProfile ? (
            <div className="flex items-center gap-2.5">
              <svg className="w-4 h-4 shrink-0 bg-white rounded-full p-0.5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.35 24 12 24z"/>
                <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.16 0 9.97 0 12s.45 3.84 1.25 5.42l4.03-3.15z"/>
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
              </svg>
              <span>{language === 'ha' ? 'Shiga da Google domin Haɗuwa' : 'Sign in with Google to Join'}</span>
            </div>
          ) : (
            <span>{language === 'ha' ? 'Amince & Shiga Ƙungiya' : 'Accept & Join Group'}</span>
          )}
        </button>
        <button
          type="button"
          onClick={() => navigate('/home')}
          className="w-full py-2 text-[13px] font-semibold text-[#4F5F57] hover:text-[#0B3D2E] text-center"
        >
          {language === 'ha' ? 'Koma gida' : 'Back to Home'}
        </button>
      </div>
    </div>
  );
};
