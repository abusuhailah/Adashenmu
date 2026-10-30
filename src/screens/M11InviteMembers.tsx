import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { StatusBar } from '../components/common/StatusBar';
import { TopBar } from '../components/common/TopBar';
import { Avatar } from '../components/common/Avatar';
import { Icon } from '../components/common/Icon';

interface InviteMember {
  id: string;
  name: string;
  initials: string;
  avatarColor: 'green' | 'gold' | 'blue' | 'clay' | 'grey';
  status: 'joined' | 'invited';
  subtitle: string;
}

export const M11InviteMembers: React.FC = () => {
  const { navigate, showToast } = useApp();
  const [phoneNumber, setPhoneNumber] = useState('+234 806 221 0934');
  const [invitedMembers, setInvitedMembers] = useState<InviteMember[]>([
    {
      id: 'inv1',
      name: 'Zainab Musa',
      initials: 'ZM',
      avatarColor: 'green',
      status: 'joined',
      subtitle: 'Joined · ID verified',
    },
    {
      id: 'inv2',
      name: 'Aisha Bello',
      initials: 'AB',
      avatarColor: 'clay',
      status: 'joined',
      subtitle: 'Joined · ID verified',
    },
    {
      id: 'inv3',
      name: 'Fatima Yusuf',
      initials: 'FY',
      avatarColor: 'blue',
      status: 'joined',
      subtitle: 'Joined · ID verified',
    },
    {
      id: 'inv4',
      name: 'Hadiza Lawal',
      initials: 'HL',
      avatarColor: 'gold',
      status: 'joined',
      subtitle: 'Joined · ID verified',
    },
    {
      id: 'inv5',
      name: 'Maryam Sani',
      initials: 'MS',
      avatarColor: 'grey',
      status: 'invited',
      subtitle: 'Invited · not opened yet',
    },
  ]);

  const inviteLink = 'adashenmu.app/join/kasuwa-stall-weekly';

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(`https://${inviteLink}`);
    showToast('Link copied to clipboard!', 'success');
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `Join our rotating savings group "Kasuwa Stall Weekly" on Adashenmu: https://${inviteLink}`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const handleShareSms = () => {
    const text = encodeURIComponent(
      `Join our group "Kasuwa Stall Weekly" on Adashenmu: https://${inviteLink}`
    );
    window.location.href = `sms:?body=${text}`;
  };

  const handleShareMore = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Adashenmu Group Invite',
        text: 'Join Kasuwa Stall Weekly on Adashenmu',
        url: `https://${inviteLink}`,
      }).catch(() => {});
    } else {
      handleCopyLink();
    }
  };

  const handleAddPhone = () => {
    if (!phoneNumber) return;
    const newMember: InviteMember = {
      id: `inv-${Date.now()}`,
      name: `Member (${phoneNumber.slice(-4)})`,
      initials: 'M',
      avatarColor: 'blue',
      status: 'invited',
      subtitle: 'Invited just now',
    };
    setInvitedMembers((prev) => [...prev, newMember]);
    showToast(`Invite sent to ${phoneNumber}!`, 'success');
    setPhoneNumber('');
  };

  return (
    <div className="flex-1 bg-[#FAF7F0] flex flex-col justify-between overflow-y-auto hide-scrollbar">
      <div>
        <StatusBar mode="light" />
        <TopBar
          title="Invite members"
          onBack={() => navigate('/groups')}
          showBack={true}
        />

        <div className="px-5 pt-1 pb-6 space-y-4">
          {/* Success card */}
          <div className="p-4 rounded-[16px] bg-[#E3F4EC] border border-[#0F8A5F]/20 flex items-center gap-3.5 shadow-sm">
            <div className="w-10 h-10 rounded-full bg-[#0F8A5F] text-white flex items-center justify-center shrink-0">
              <Icon name="check" size={20} strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="font-heading font-bold text-[16px] text-[#0B3D2E]">
                Kasuwa Stall Weekly is ready
              </h3>
              <p className="text-[12px] text-[#0F8A5F] font-medium mt-0.5">
                Wallet opened at the partner bank
              </p>
            </div>
          </div>

          {/* Invite link card */}
          <div className="bg-white rounded-[16px] p-4 border border-[#E3DDCF] shadow-sm space-y-3">
            <span className="block text-[12px] font-semibold text-[#4F5F57]">
              Invite link
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
                <span>More</span>
              </button>
            </div>
          </div>

          {/* Add by phone number field with 52px green plus button */}
          <div>
            <label className="block text-[14px] font-semibold text-[#0B3D2E] mb-1.5">
              Add by phone number
            </label>
            <div className="flex gap-2">
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+234 ..."
                className="flex-1 h-[52px] px-4 rounded-[10px] bg-white border border-[#E3DDCF] focus:border-[#0F8A5F] focus:outline-none text-[15px] font-medium text-[#0B3D2E]"
              />
              <button
                type="button"
                onClick={handleAddPhone}
                aria-label="Add member by phone"
                className="w-[52px] h-[52px] rounded-[10px] bg-[#0F8A5F] active:bg-[#0B6E4B] text-white flex items-center justify-center shrink-0 cursor-pointer shadow-sm hover:brightness-105"
              >
                <Icon name="plus" size={24} strokeWidth={2.5} />
              </button>
            </div>
          </div>

          {/* Members list */}
          <div className="bg-white rounded-[16px] border border-[#E3DDCF] shadow-sm overflow-hidden">
            <div className="px-4 py-3 bg-[#FAF7F0] border-b border-[#E3DDCF] flex items-center justify-between text-[13px]">
              <span className="font-semibold text-[#0B3D2E]">Members</span>
              <span className="font-semibold text-[#0F8A5F]">
                {invitedMembers.length} of 8 joined
              </span>
            </div>

            <div className="divide-y divide-[#EFEAE0]">
              {invitedMembers.map((item) => (
                <div key={item.id} className="p-3.5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar initials={item.initials} color={item.avatarColor} size={36} />
                    <div>
                      <span className="text-[14px] font-semibold text-[#0B3D2E] block leading-tight">
                        {item.name}
                      </span>
                      <div className="flex items-center gap-1.5 text-[12px] text-[#4F5F57] mt-0.5">
                        {item.status === 'joined' && (
                          <Icon name="shield" size={13} className="text-[#0F8A5F]" strokeWidth={2.2} />
                        )}
                        <span>{item.subtitle}</span>
                      </div>
                    </div>
                  </div>

                  {item.status === 'invited' && (
                    <button
                      type="button"
                      onClick={() => showToast(`Reminder sent to ${item.name}!`, 'info')}
                      className="text-[12px] font-bold text-[#0B6E4B] hover:underline cursor-pointer"
                    >
                      Remind
                    </button>
                  )}
                </div>
              ))}
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
          Done
        </button>
      </div>
    </div>
  );
};
