import React from 'react';
import { useApp } from '../context/AppContext';
import { StatusBar } from '../components/common/StatusBar';
import { Avatar } from '../components/common/Avatar';
import { Icon } from '../components/common/Icon';

export const W01InviteWebPage: React.FC = () => {
  const { navigate } = useApp();

  return (
    <div className="flex-1 bg-[#FAF7F0] flex flex-col justify-between overflow-y-auto hide-scrollbar">
      <div>
        <StatusBar mode="light" />

        {/* Mobile Browser URL Pill */}
        <div className="px-5 py-2">
          <div className="h-9 px-3.5 rounded-full bg-[#EEF0EE] border border-[#E3DDCF] flex items-center gap-2 text-[12px] text-[#4F5F57] font-mono">
            <Icon name="lock" size={13} className="text-[#0F8A5F] shrink-0" />
            <span className="truncate">adashenmu.app/join/kasuwa-stall-weekly</span>
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
                Hauwa Ibrahim invited you to join
              </p>
              <div className="flex items-center gap-1.5 text-[12px] text-[#0F8A5F] font-medium mt-0.5">
                <Icon name="shield" size={13} strokeWidth={2.4} />
                <span>Organiser · verified</span>
              </div>
            </div>
          </div>

          {/* Group details card */}
          <div className="bg-white rounded-[16px] p-4 border border-[#E3DDCF] shadow-sm mb-4">
            <h2 className="font-heading font-bold text-[20px] text-[#0B3D2E] mb-3">
              Kasuwa Stall Weekly
            </h2>

            {/* Three stat tiles */}
            <div className="grid grid-cols-3 gap-2 py-3 border-y border-[#EFEAE0] mb-4">
              <div className="text-center">
                <span className="block text-[11px] text-[#4F5F57] uppercase tracking-wider font-medium">
                  Each week
                </span>
                <span className="block font-heading font-bold text-[16px] text-[#0B3D2E] mt-0.5">
                  ₦5,000
                </span>
              </div>
              <div className="text-center border-x border-[#EFEAE0]">
                <span className="block text-[11px] text-[#4F5F57] uppercase tracking-wider font-medium">
                  Members
                </span>
                <span className="block font-heading font-bold text-[16px] text-[#0B3D2E] mt-0.5">
                  8
                </span>
              </div>
              <div className="text-center">
                <span className="block text-[11px] text-[#4F5F57] uppercase tracking-wider font-medium">
                  Payout
                </span>
                <span className="block font-heading font-bold text-[16px] text-[#0F8A5F] mt-0.5">
                  ₦40,000
                </span>
              </div>
            </div>

            {/* Rules everyone accepts */}
            <h4 className="text-[13px] font-semibold text-[#0B3D2E] mb-2.5">
              Rules everyone accepts
            </h4>
            <div className="space-y-2 text-[13px] text-[#4F5F57]">
              <div className="flex items-start gap-2.5">
                <div className="w-4 h-4 rounded-full bg-[#E3F4EC] text-[#0F8A5F] flex items-center justify-center shrink-0 mt-0.5">
                  <Icon name="check" size={10} strokeWidth={3} />
                </div>
                <span>Pay every Friday by 6 pm</span>
              </div>
              <div className="flex items-start gap-2.5">
                <div className="w-4 h-4 rounded-full bg-[#E3F4EC] text-[#0F8A5F] flex items-center justify-center shrink-0 mt-0.5">
                  <Icon name="check" size={10} strokeWidth={3} />
                </div>
                <span>Payout order is drawn when the group starts</span>
              </div>
              <div className="flex items-start gap-2.5">
                <div className="w-4 h-4 rounded-full bg-[#E3F4EC] text-[#0F8A5F] flex items-center justify-center shrink-0 mt-0.5">
                  <Icon name="check" size={10} strokeWidth={3} />
                </div>
                <span>1-day grace, then marked Late with a ₦500 fee added to the pot</span>
              </div>
            </div>

            {/* Overlapping avatar stack */}
            <div className="flex items-center gap-3 mt-4 pt-4 border-t border-[#EFEAE0]">
              <div className="flex -space-x-2">
                <Avatar initials="HI" color="clay" size={28} className="border-2 border-white" />
                <Avatar initials="ZM" color="green" size={28} className="border-2 border-white" />
                <Avatar initials="AB" color="clay" size={28} className="border-2 border-white" />
                <Avatar initials="FY" color="blue" size={28} className="border-2 border-white" />
                <Avatar initials="HL" color="gold" size={28} className="border-2 border-white" />
              </div>
              <span className="text-[13px] font-medium text-[#0B3D2E]">
                5 of 8 places filled
              </span>
            </div>
          </div>

          {/* Info Card */}
          <div className="p-3.5 rounded-[16px] bg-[#E3F4EC] border border-[#0F8A5F]/20 flex items-start gap-3">
            <div className="text-[#0F8A5F] mt-0.5 shrink-0">
              <Icon name="shield" size={18} strokeWidth={2.2} />
            </div>
            <p className="text-[12px] text-[#0B3D2E] leading-snug">
              Money is held by a licensed partner bank. Every member verifies with their NIN.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-5 pt-3 pb-8 bg-white border-t border-[#E3DDCF]">
        <button
          type="button"
          onClick={() => navigate('/sign-in')}
          className="w-full h-[52px] rounded-[14px] bg-[#0F8A5F] active:bg-[#0B6E4B] text-white font-heading font-bold text-[16px] flex items-center justify-center cursor-pointer shadow-sm hover:brightness-105 transition-all"
        >
          Join group
        </button>
        <p className="text-[12px] text-center text-[#4F5F57] mt-2">
          You will get the app after you accept the rules.
        </p>
      </div>
    </div>
  );
};
