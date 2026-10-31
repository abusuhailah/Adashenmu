import React from 'react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../i18n/LanguageContext';
import { StatusBar } from '../components/common/StatusBar';
import { TopBar } from '../components/common/TopBar';
import { Avatar } from '../components/common/Avatar';
import { Icon } from '../components/common/Icon';
import { formatNaira } from '../data/types';

export const M11InviteMembers: React.FC = () => {
  const { navigate, showToast, activeGroup, createGroupDraft } = useApp();
  const { language, t } = useLanguage();

  const groupName = activeGroup?.name || createGroupDraft.name;
  const groupCode = activeGroup?.code || 'ADAS-8492';
  const groupSize = activeGroup?.rules.size || createGroupDraft.size;
  const bankName = activeGroup?.organiserAccount?.bankName || activeGroup?.wallet?.bankName || 'Guaranty Trust Bank (GTBank)';
  const members = activeGroup?.members || [];

  const inviteLink = `${window.location.origin}/join/${groupCode}`;

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(inviteLink);
    showToast(t('linkCopied'), 'success');
  };

  const handleCopyCode = () => {
    navigator.clipboard?.writeText(groupCode);
    showToast(
      language === 'ha'
        ? `An kwafi lambar ƙungiya: ${groupCode}`
        : `Group code copied: ${groupCode}`,
      'success'
    );
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      language === 'ha'
        ? `Ku shiga ƙungiyarmu ta adashe "${groupName}" a Adashenmu tare da Lambar Ƙungiya: ${groupCode}\nMahada: ${inviteLink}`
        : `Join our rotating savings group "${groupName}" on Adashenmu using Group Code: ${groupCode}\nLink: ${inviteLink}`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const handleShareSms = () => {
    const text = encodeURIComponent(
      `Join "${groupName}" on Adashenmu with Code: ${groupCode} -> ${inviteLink}`
    );
    window.location.href = `sms:?body=${text}`;
  };

  const handleShareMore = () => {
    if (navigator.share) {
      navigator.share({
        title: `Adashenmu: ${groupName}`,
        text: `Join our savings group "${groupName}" (Code: ${groupCode})`,
        url: inviteLink,
      }).catch(() => {});
    } else {
      handleCopyLink();
    }
  };

  return (
    <div className="flex-1 bg-[#FAF7F0] flex flex-col justify-between overflow-y-auto hide-scrollbar">
      <div>
        <StatusBar mode="light" />
        <TopBar
          title={t('manageInvites')}
          onBack={() => navigate('/groups')}
          showBack={true}
        />

        <div className="px-5 pt-1 pb-6 space-y-4">
          {/* Ready notification card */}
          <div className="p-4 rounded-[16px] bg-[#E3F4EC] border border-[#0F8A5F]/20 flex items-center gap-3.5 shadow-sm">
            <div className="w-10 h-10 rounded-full bg-[#0F8A5F] text-white flex items-center justify-center shrink-0">
              <Icon name="check" size={20} strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="font-heading font-bold text-[16px] text-[#0B3D2E]">
                {groupName} {language === 'ha' ? 'a shirye take' : 'is active'}
              </h3>
              <p className="text-[12px] text-[#0F8A5F] font-medium mt-0.5">
                {language === 'ha'
                  ? `Kudaden biya zasu shiga asusun ${bankName}`
                  : `Member contributions routed to ${bankName}`}
              </p>
            </div>
          </div>

          {/* Group Code Card */}
          <div className="bg-white rounded-[16px] p-4 border border-[#E3DDCF] shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[12px] font-semibold text-[#4F5F57]">
                {language === 'ha' ? 'Lambar Ƙungiya ta Musamman' : 'Unique Group Code'}
              </span>
              <span className="text-[11px] font-bold text-[#0F8A5F] bg-[#E3F4EC] px-2 py-0.5 rounded-md">
                LIVE
              </span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-[12px] bg-[#FAF7F0] border border-[#E3DDCF]">
              <span className="text-[20px] font-heading font-extrabold text-[#0B3D2E] tracking-wider font-mono">
                {groupCode}
              </span>
              <button
                type="button"
                onClick={handleCopyCode}
                className="px-3 py-1.5 rounded-[8px] bg-white border border-[#E3DDCF] text-[#0B3D2E] text-[12px] font-bold flex items-center gap-1.5 hover:bg-[#EEF0EE] cursor-pointer"
              >
                <Icon name="copy" size={14} />
                <span>{t('copyLink')}</span>
              </button>
            </div>
          </div>

          {/* Invite link card */}
          <div className="bg-white rounded-[16px] p-4 border border-[#E3DDCF] shadow-sm space-y-3">
            <span className="block text-[12px] font-semibold text-[#4F5F57]">
              {t('shareInviteLink')}
            </span>

            <div className="flex items-center justify-between p-3 rounded-[10px] bg-[#EEF0EE] border border-[#E3DDCF]">
              <span className="text-[12px] font-mono text-[#0B3D2E] truncate mr-2 select-all">
                {inviteLink}
              </span>
              <button
                type="button"
                onClick={handleCopyLink}
                title="Copy link"
                className="w-8 h-8 rounded-lg bg-white border border-[#E3DDCF] text-[#0B3D2E] flex items-center justify-center shrink-0 cursor-pointer active:scale-95"
              >
                <Icon name="copy" size={16} />
              </button>
            </div>

            {/* Three Share Buttons */}
            <div className="grid grid-cols-3 gap-2 pt-1">
              <button
                type="button"
                onClick={handleShareWhatsApp}
                className="h-10 rounded-[10px] border border-[#E3DDCF] bg-white text-[#0B3D2E] text-[13px] font-semibold flex items-center justify-center gap-1.5 hover:bg-[#FAF7F0] cursor-pointer"
              >
                <Icon name="message" size={15} className="text-[#0F8A5F]" />
                <span>WhatsApp</span>
              </button>

              <button
                type="button"
                onClick={handleShareSms}
                className="h-10 rounded-[10px] border border-[#E3DDCF] bg-white text-[#0B3D2E] text-[13px] font-semibold flex items-center justify-center gap-1.5 hover:bg-[#FAF7F0] cursor-pointer"
              >
                <Icon name="phone" size={15} />
                <span>SMS</span>
              </button>

              <button
                type="button"
                onClick={handleShareMore}
                className="h-10 rounded-[10px] border border-[#E3DDCF] bg-white text-[#0B3D2E] text-[13px] font-semibold flex items-center justify-center gap-1.5 hover:bg-[#FAF7F0] cursor-pointer"
              >
                <Icon name="more" size={15} />
                <span>{language === 'ha' ? 'Kari' : 'More'}</span>
              </button>
            </div>
          </div>

          {/* Clean Instruction: Self-service joining */}
          <div className="p-3.5 rounded-[14px] bg-[#FFF4DB] border border-[#F2B33D]/30 flex items-start gap-2.5">
            <Icon name="info" size={17} className="text-[#8A5A00] shrink-0 mt-0.5" />
            <p className="text-[12px] text-[#4F5F57] leading-relaxed">
              {language === 'ha'
                ? 'Aika wannan mahada ko lambar ƙungiya ga mambobi. Lokacin da suka shiga, zasu shiga da Gmail, saka asusun bankin da zasu karɓi rabon kuɗi, kuma su haɗa kansu.'
                : 'Send this invite link or group code to members. When they open it, they will sign in with Gmail, add their payout bank account, and join the group themselves.'}
            </p>
          </div>

          {/* Real Members list */}
          <div className="bg-white rounded-[16px] border border-[#E3DDCF] shadow-sm overflow-hidden">
            <div className="px-4 py-3 bg-[#FAF7F0] border-b border-[#E3DDCF] flex items-center justify-between text-[13px]">
              <span className="font-semibold text-[#0B3D2E]">
                {language === 'ha' ? 'Mambobin da ke ciki' : 'Joined Members'}
              </span>
              <span className="font-semibold text-[#0F8A5F]">
                {members.length} {language === 'ha' ? 'cikin' : 'of'} {groupSize}{' '}
                {language === 'ha' ? 'sun shiga' : 'joined'}
              </span>
            </div>

            <div className="divide-y divide-[#EFEAE0]">
              {members.length === 0 ? (
                <div className="p-4 text-center text-[13px] text-[#4F5F57]">
                  {language === 'ha' ? 'Babu wani mamba da ya shiga tukuna.' : 'No members have joined yet.'}
                </div>
              ) : (
                members.map((item, idx) => (
                  <div key={item.id} className="p-3.5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar initials={item.initials} color={item.avatarColor} size={36} />
                      <div>
                        <span className="text-[14px] font-semibold text-[#0B3D2E] block leading-tight">
                          {item.name}
                        </span>
                        <div className="flex items-center gap-1.5 text-[12px] text-[#4F5F57] mt-0.5">
                          <Icon name="shield" size={13} className="text-[#0F8A5F]" strokeWidth={2.2} />
                          <span>
                            {item.role === 'Organiser'
                              ? language === 'ha' ? 'Mai Shirya · Asusun Google' : 'Organiser · Google Account'
                              : language === 'ha' ? `Mamba #${idx + 1}` : `Member #${idx + 1}`}
                          </span>
                        </div>
                      </div>
                    </div>

                    <span className="text-[11px] font-bold text-[#0F8A5F] bg-[#E3F4EC] px-2 py-0.5 rounded-full">
                      {item.role === 'Organiser' ? 'Organiser' : 'Joined'}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-5 pt-3 pb-8 bg-white border-t border-[#E3DDCF]">
        <button
          type="button"
          onClick={() => navigate('/groups')}
          className="w-full h-[52px] rounded-[14px] bg-[#0F8A5F] active:bg-[#0B6E4B] text-white font-heading font-bold text-[16px] flex items-center justify-center cursor-pointer shadow-sm hover:brightness-105 transition-all"
        >
          {language === 'ha' ? 'An gama' : 'Done'}
        </button>
      </div>
    </div>
  );
};
