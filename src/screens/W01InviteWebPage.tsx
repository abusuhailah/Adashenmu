import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../i18n/LanguageContext';
import { StatusBar } from '../components/common/StatusBar';
import { Avatar } from '../components/common/Avatar';
import { Icon } from '../components/common/Icon';
import { formatNaira, InvitePreview } from '../data/types';
import { fetchInvitePreview } from '../lib/firebase';

export const W01InviteWebPage: React.FC = () => {
  const { navigate, joinGroupByCodeOrId, showToast, partnerBank, currentRoute } = useApp();
  const { language, t } = useLanguage();
  const [isJoining, setIsJoining] = useState(false);
  const [invitePreview, setInvitePreview] = useState<InvitePreview | null>(null);

  // Extract invite code or ID from the URL path: /join/:codeOrId
  const pathParam = currentRoute.startsWith('/join/')
    ? currentRoute.replace('/join/', '')
    : 'kasuwa-stall-weekly';

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

  // Safe preview data
  const groupName = invitePreview?.name || 'Kasuwa Stall Weekly';
  const groupCode = invitePreview?.code || 'KASU-8821';
  const amount = invitePreview?.amount || 5000;
  const frequency = invitePreview?.frequency || 'weekly';
  const dueDay = invitePreview?.dueDay || 'Friday by 6 pm';
  const size = invitePreview?.size || 8;
  const memberCount = invitePreview?.memberCount || 1;
  const organiserName = invitePreview?.organiserName || 'Hauwa Ibrahim';
  const targetGroupId = invitePreview?.groupId || pathParam;

  const totalPayout = amount * size;
  const bankName = partnerBank?.bankName || 'Access Bank (CBN Licensed)';

  const handleAcceptAndJoin = async () => {
    setIsJoining(true);
    try {
      const joined = await joinGroupByCodeOrId(groupCode || targetGroupId);
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

        <div className="px-5 pt-3 pb-6">
          {/* Brand mark */}
          <div className="flex items-center gap-2 mb-5">
            <img src="/brand/adashenmu-mark.svg" alt="Adashenmu" className="w-8 h-8 object-contain" />
            <span className="font-heading font-extrabold text-[20px] text-[#0B3D2E] tracking-tight">
              adashenmu
            </span>
          </div>

          {/* Inviter row (read from safe invite preview) */}
          <div className="flex items-center gap-3.5 mb-5 p-3 rounded-[14px] bg-white border border-[#E3DDCF]">
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
                  {language === 'ha' ? 'Mai shirya ƙungiya · An tantance' : 'Organiser · Verified'}
                </span>
              </div>
            </div>
          </div>

          {/* Group details card from safe preview */}
          <div className="bg-white rounded-[16px] p-4 border border-[#E3DDCF] shadow-sm mb-4">
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
                    ? 'Ana raba tsarin karɓar kuɗi a ranar farawa ta adashe'
                    : 'Payout order is drawn fairly when the group starts'}
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <div className="w-4 h-4 rounded-full bg-[#E3F4EC] text-[#0F8A5F] flex items-center justify-center shrink-0 mt-0.5">
                  <Icon name="check" size={10} strokeWidth={3} />
                </div>
                <span>
                  {language === 'ha'
                    ? 'Gafara ta kwana 1, sannan tarar rashin biya tana zuwa tukunyar ƙungiya'
                    : '1-day grace, then late fee goes directly to the group pot'}
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
