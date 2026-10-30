import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../i18n/LanguageContext';
import { StatusBar } from '../components/common/StatusBar';
import { Avatar } from '../components/common/Avatar';
import { Icon } from '../components/common/Icon';
import { formatNaira } from '../data/types';

export const W01InviteWebPage: React.FC = () => {
  const { navigate, groups, joinGroupByCodeOrId, showToast, partnerBank } = useApp();
  const { language, t } = useLanguage();
  const [isJoining, setIsJoining] = useState(false);

  const group = groups[0] || {
    id: 'g-kasuwa-stall-weekly',
    name: 'Kasuwa Stall Weekly',
    code: 'KASU-8492',
    organiserId: 'org1',
    rules: {
      amount: 5000,
      currency: 'NGN',
      frequency: 'weekly',
      dueDay: 'Fri, 6 pm',
      size: 8,
      payoutAmount: 40000,
      payoutOrder: 'draw',
      lateRule: { graceDays: 1, feeAmount: 500, feeGoesTo: 'pot' },
      startDate: 'Fri 6 Nov 2026',
      endDate: 'Fri 25 Dec 2026',
      changesNeedGroupVote: true,
    },
    wallet: {
      heldBy: 'Licensed partner bank · NDIC Insured',
      bankName: partnerBank?.bankName || 'Access Bank',
      balanceThisCycle: 0,
    },
  };

  const bankName = group.wallet?.bankName || partnerBank?.bankName || 'Access Bank (CBN Licensed)';
  const totalPayout = (group.rules?.amount || 5000) * (group.rules?.size || 8);

  const handleAcceptAndJoin = async () => {
    setIsJoining(true);
    try {
      await joinGroupByCodeOrId(group.id);
      showToast(
        language === 'ha'
          ? `Barka da zuwa! Kun shiga "${group.name}".`
          : `Welcome! You have joined "${group.name}".`,
        'success'
      );
      setIsJoining(false);
      navigate(`/groups/${group.id}/ledger`);
    } catch {
      setIsJoining(false);
      navigate(`/groups/${group.id}/ledger`);
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
            <span className="truncate">adashenmu.app/join/{group.id}</span>
          </div>
        </div>

        <div className="px-5 pt-3 pb-6">
          {/* Brand mark small */}
          <div className="flex items-center gap-2 mb-5">
            <img src="/brand/adashenmu-mark.svg" alt="Adashenmu" className="w-8 h-8 object-contain" />
            <span className="font-heading font-extrabold text-[20px] text-[#0B3D2E] tracking-tight">
              adashenmu
            </span>
          </div>

          {/* Inviter row */}
          <div className="flex items-center gap-3.5 mb-5 p-3 rounded-[14px] bg-white border border-[#E3DDCF]">
            <Avatar initials="HI" color="clay" size={44} />
            <div>
              <p className="text-[14px] font-semibold text-[#0B3D2E]">
                {language === 'ha'
                  ? `An gayyace ku shiga ${group.name}`
                  : `You were invited to join ${group.name}`}
              </p>
              <div className="flex items-center gap-1.5 text-[12px] text-[#0F8A5F] font-medium mt-0.5">
                <Icon name="shield" size={13} strokeWidth={2.4} />
                <span>
                  {language === 'ha'
                    ? 'Mai shirya ƙungiya · An tantance NIN'
                    : 'Organiser · NIN verified'}
                </span>
              </div>
            </div>
          </div>

          {/* Group details card */}
          <div className="bg-white rounded-[16px] p-4 border border-[#E3DDCF] shadow-sm mb-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-heading font-bold text-[20px] text-[#0B3D2E]">
                {group.name}
              </h2>
              {group.code && (
                <span className="text-[11px] font-mono font-bold bg-[#FAF7F0] px-2 py-0.5 rounded border border-[#E3DDCF] text-[#0B3D2E]">
                  {group.code}
                </span>
              )}
            </div>

            {/* Three stat tiles */}
            <div className="grid grid-cols-3 gap-2 py-3 border-y border-[#EFEAE0] mb-4">
              <div className="text-center">
                <span className="block text-[11px] text-[#4F5F57] uppercase tracking-wider font-medium">
                  {group.rules?.frequency === 'weekly'
                    ? language === 'ha' ? 'Kowane mako' : 'Each week'
                    : language === 'ha' ? 'Kowane wata' : 'Each month'}
                </span>
                <span className="block font-heading font-bold text-[16px] text-[#0B3D2E] mt-0.5">
                  {formatNaira(group.rules?.amount || 5000)}
                </span>
              </div>
              <div className="text-center border-x border-[#EFEAE0]">
                <span className="block text-[11px] text-[#4F5F57] uppercase tracking-wider font-medium">
                  {language === 'ha' ? 'Mambobi' : 'Members'}
                </span>
                <span className="block font-heading font-bold text-[16px] text-[#0B3D2E] mt-0.5">
                  {group.rules?.size || 8}
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
                    ? `Biyan kuɗi kowace ${group.rules?.dueDay || 'Juma\'a da misalin 6 na yamma'}`
                    : `Pay on ${group.rules?.dueDay || 'Friday by 6 pm'}`}
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <div className="w-4 h-4 rounded-full bg-[#E3F4EC] text-[#0F8A5F] flex items-center justify-center shrink-0 mt-0.5">
                  <Icon name="check" size={10} strokeWidth={3} />
                </div>
                <span>
                  {language === 'ha'
                    ? 'Ana raba tsarin karɓar kuɗi a ranar farawa'
                    : 'Payout order is drawn fairly when the group starts'}
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <div className="w-4 h-4 rounded-full bg-[#E3F4EC] text-[#0F8A5F] flex items-center justify-center shrink-0 mt-0.5">
                  <Icon name="check" size={10} strokeWidth={3} />
                </div>
                <span>
                  {language === 'ha'
                    ? `Gafara ta kwana ${group.rules?.lateRule?.graceDays || 1}, sannan tarar ${formatNaira(group.rules?.lateRule?.feeAmount || 500)} wadda za ta tafi cikin tukunyar ƙungiya`
                    : `${group.rules?.lateRule?.graceDays || 1}-day grace, then ${formatNaira(group.rules?.lateRule?.feeAmount || 500)} late fee into the group pot`}
                </span>
              </div>
            </div>
          </div>

          {/* Licensed Bank Escrow Card */}
          <div className="p-4 rounded-[16px] bg-[#0B3D2E] text-white border border-[#2FBF85]/20 shadow-md flex items-start gap-3">
            <div className="w-9 h-9 rounded-full bg-[#072A20] text-[#2FBF85] flex items-center justify-center shrink-0 mt-0.5">
              <Icon name="bank" size={18} strokeWidth={2.2} />
            </div>
            <div>
              <h4 className="font-heading font-bold text-[14px] text-white">
                {bankName}
              </h4>
              <p className="text-[12px] text-white/80 mt-0.5 leading-snug">
                {language === 'ha'
                  ? 'Kudaden ƙungiya suna cikin asusun bankin abokin tarayya mai lasisi da inshorar NDIC. Ba a hannun mutum ɗaya ba.'
                  : 'Group funds are held safely in a CBN-licensed, NDIC-insured partner bank escrow account. No single person can withdraw.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-5 pt-3 pb-8 bg-white border-t border-[#E3DDCF] space-y-2">
        <button
          type="button"
          disabled={isJoining}
          onClick={handleAcceptAndJoin}
          className="w-full h-[52px] rounded-[14px] bg-[#0F8A5F] active:bg-[#0B6E4B] text-white font-heading font-bold text-[16px] flex items-center justify-center cursor-pointer shadow-sm hover:brightness-105 transition-all disabled:opacity-50"
        >
          {isJoining ? (
            <span>{language === 'ha' ? 'Ana shiga…' : 'Joining group…'}</span>
          ) : (
            <span>{language === 'ha' ? 'Amince & Shiga Ƙungiya' : 'Accept & join group'}</span>
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
