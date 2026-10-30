import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../i18n/LanguageContext';
import { StatusBar } from '../components/common/StatusBar';
import { TopBar } from '../components/common/TopBar';
import { Icon } from '../components/common/Icon';
import { formatNaira } from '../data/types';

export const M08CreateGroupRules: React.FC = () => {
  const { navigate, createGroupDraft, updateCreateGroupDraft } = useApp();
  const { t } = useLanguage();
  const [showTimePicker, setShowTimePicker] = useState(false);

  const payoutTotal = createGroupDraft.amount * createGroupDraft.size;

  const handleMemberChange = (delta: number) => {
    const newSize = Math.max(3, Math.min(30, createGroupDraft.size + delta));
    updateCreateGroupDraft({ size: newSize });
  };

  return (
    <div className="flex-1 bg-[#FAF7F0] flex flex-col justify-between overflow-y-auto hide-scrollbar">
      <div>
        <StatusBar mode="light" />
        <TopBar
          title={t('createNewGroup')}
          onBack={() => navigate('/groups')}
          showBack={true}
        />

        {/* Stepper bar */}
        <div className="px-5 pt-1 pb-3 flex items-center justify-between">
          <div className="flex-1 flex gap-1.5 mr-3">
            <div className="h-1 flex-1 rounded-full bg-[#0F8A5F]" />
            <div className="h-1 flex-1 rounded-full bg-[#E3DDCF]" />
            <div className="h-1 flex-1 rounded-full bg-[#E3DDCF]" />
          </div>
          <span className="text-[12px] font-medium text-[#4F5F57] whitespace-nowrap">
            {t('step1Rules')}
          </span>
        </div>

        <div className="px-5 pt-2 pb-6 space-y-4">
          {/* Template chips */}
          <div>
            <span className="text-[11px] font-bold text-[#4F5F57] uppercase tracking-wider block mb-2">
              {t('template')}
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => updateCreateGroupDraft({ templateId: 'weekly-stall' })}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-[13px] font-semibold transition-all cursor-pointer ${
                  createGroupDraft.templateId === 'weekly-stall'
                    ? 'bg-[#E3F4EC] text-[#0B6E4B] border-2 border-[#0F8A5F]'
                    : 'bg-white text-[#4F5F57] border border-[#E3DDCF]'
                }`}
              >
                {createGroupDraft.templateId === 'weekly-stall' && (
                  <Icon name="check" size={14} strokeWidth={2.5} />
                )}
                Weekly stall
              </button>

              <button
                type="button"
                onClick={() => updateCreateGroupDraft({ templateId: 'monthly-market' })}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-[13px] font-semibold transition-all cursor-pointer ${
                  createGroupDraft.templateId === 'monthly-market'
                    ? 'bg-[#E3F4EC] text-[#0B6E4B] border-2 border-[#0F8A5F]'
                    : 'bg-white text-[#4F5F57] border border-[#E3DDCF]'
                }`}
              >
                {createGroupDraft.templateId === 'monthly-market' && (
                  <Icon name="check" size={14} strokeWidth={2.5} />
                )}
                Monthly market
              </button>
            </div>
          </div>

          {/* Group Name */}
          <div>
            <label className="block text-[14px] font-semibold text-[#0B3D2E] mb-1.5">
              Group name
            </label>
            <input
              type="text"
              value={createGroupDraft.name}
              onChange={(e) => updateCreateGroupDraft({ name: e.target.value })}
              className="w-full h-[52px] px-4 rounded-[10px] bg-white border border-[#E3DDCF] focus:border-[#0F8A5F] focus:outline-none text-[15px] font-medium text-[#0B3D2E]"
            />
          </div>

          {/* Amount each member pays */}
          <div>
            <label className="block text-[14px] font-semibold text-[#0B3D2E] mb-1.5">
              Amount each member pays
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[16px] font-bold text-[#0B3D2E]">
                ₦
              </span>
              <input
                type="text"
                value={createGroupDraft.amount.toLocaleString()}
                onChange={(e) => {
                  const raw = e.target.value.replace(/[^0-9]/g, '');
                  updateCreateGroupDraft({ amount: Number(raw) || 0 });
                }}
                className="w-full h-[52px] pl-9 pr-4 rounded-[10px] bg-white border border-[#E3DDCF] focus:border-[#0F8A5F] focus:outline-none text-[16px] font-heading font-bold text-[#0B3D2E]"
              />
            </div>
          </div>

          {/* How often */}
          <div>
            <label className="block text-[14px] font-semibold text-[#0B3D2E] mb-2">
              How often
            </label>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => updateCreateGroupDraft({ frequency: 'weekly', dueDay: 'Fri, 6 pm' })}
                className={`px-3.5 py-2 rounded-full text-[13px] font-semibold transition-all cursor-pointer ${
                  createGroupDraft.frequency === 'weekly'
                    ? 'bg-[#0F8A5F] text-white'
                    : 'bg-white text-[#4F5F57] border border-[#E3DDCF]'
                }`}
              >
                Weekly
              </button>

              <button
                type="button"
                onClick={() => updateCreateGroupDraft({ frequency: 'monthly', dueDay: '28th of each month' })}
                className={`px-3.5 py-2 rounded-full text-[13px] font-semibold transition-all cursor-pointer ${
                  createGroupDraft.frequency === 'monthly'
                    ? 'bg-[#0F8A5F] text-white'
                    : 'bg-white text-[#4F5F57] border border-[#E3DDCF]'
                }`}
              >
                Monthly
              </button>

              <button
                type="button"
                onClick={() => setShowTimePicker(!showTimePicker)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-white border border-[#E3DDCF] text-[13px] font-medium text-[#0B3D2E] hover:border-[#0F8A5F] cursor-pointer"
              >
                <Icon name="calendar" size={14} className="text-[#0F8A5F]" />
                <span>{createGroupDraft.dueDay}</span>
              </button>
            </div>

            {showTimePicker && (
              <div className="mt-2.5 p-3 rounded-[12px] bg-white border border-[#E3DDCF] flex items-center justify-between text-[13px]">
                <span className="text-[#4F5F57]">Select collection time:</span>
                <select
                  value={createGroupDraft.dueDay}
                  onChange={(e) => {
                    updateCreateGroupDraft({ dueDay: e.target.value });
                    setShowTimePicker(false);
                  }}
                  className="bg-[#FAF7F0] border border-[#E3DDCF] rounded-lg px-2.5 py-1 text-[#0B3D2E] font-medium focus:outline-none"
                >
                  <option value="Fri, 6 pm">Friday 6 pm</option>
                  <option value="Sun, 12 pm">Sunday 12 pm</option>
                  <option value="Mon, 9 am">Monday 9 am</option>
                  <option value="28th of each month">28th of month</option>
                  <option value="End of month">Last day of month</option>
                </select>
              </div>
            )}
          </div>

          {/* Number of members with Stepper */}
          <div className="flex items-center justify-between p-3.5 bg-white rounded-[12px] border border-[#E3DDCF]">
            <div>
              <span className="block text-[14px] font-semibold text-[#0B3D2E]">
                Number of members
              </span>
              <span className="text-[12px] text-[#4F5F57]">
                Including you
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => handleMemberChange(-1)}
                disabled={createGroupDraft.size <= 3}
                aria-label="Decrease members"
                className="w-9 h-9 rounded-full bg-[#FAF7F0] border border-[#E3DDCF] text-[#0B3D2E] font-bold text-[18px] flex items-center justify-center disabled:opacity-40 cursor-pointer active:scale-95"
              >
                −
              </button>
              <span className="font-heading font-bold text-[18px] text-[#0B3D2E] w-6 text-center">
                {createGroupDraft.size}
              </span>
              <button
                type="button"
                onClick={() => handleMemberChange(1)}
                disabled={createGroupDraft.size >= 30}
                aria-label="Increase members"
                className="w-9 h-9 rounded-full bg-[#FAF7F0] border border-[#E3DDCF] text-[#0B3D2E] font-bold text-[18px] flex items-center justify-center disabled:opacity-40 cursor-pointer active:scale-95"
              >
                +
              </button>
            </div>
          </div>

          {/* If someone pays late */}
          <div>
            <label className="block text-[14px] font-semibold text-[#0B3D2E] mb-1.5">
              If someone pays late
            </label>
            <div className="relative">
              <select
                value={`${createGroupDraft.lateGraceDays}-${createGroupDraft.lateFee}`}
                onChange={(e) => {
                  const [days, fee] = e.target.value.split('-').map(Number);
                  updateCreateGroupDraft({ lateGraceDays: days, lateFee: fee });
                }}
                className="w-full h-[52px] px-4 rounded-[10px] bg-white border border-[#E3DDCF] focus:border-[#0F8A5F] focus:outline-none text-[14px] font-medium text-[#0B3D2E] appearance-none cursor-pointer"
              >
                <option value="1-500">1-day grace, then ₦500 fee to the pot</option>
                <option value="2-1000">2-day grace, then ₦1,000 fee to the pot</option>
                <option value="3-2000">3-day grace, then ₦2,000 fee to the pot</option>
              </select>
              <Icon
                name="chevron-down"
                size={18}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8A968F] pointer-events-none"
              />
            </div>
          </div>

          {/* Live Summary Card */}
          <div className="p-4 rounded-[16px] bg-[#E3F4EC] border border-[#0F8A5F]/20 flex items-start gap-3">
            <div className="w-10 h-10 rounded-[10px] bg-white text-[#0F8A5F] flex items-center justify-center shrink-0 shadow-sm">
              <Icon name="pot" size={20} strokeWidth={2.2} />
            </div>
            <div>
              <p className="font-heading font-bold text-[16px] text-[#0B3D2E]">
                Each payout: {formatNaira(payoutTotal)}
              </p>
              <p className="text-[12px] text-[#0B6E4B] font-medium mt-0.5">
                {createGroupDraft.size} {createGroupDraft.frequency === 'weekly' ? 'weeks' : 'months'} · {createGroupDraft.startDate} to {createGroupDraft.endDate}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-5 pt-3 pb-8 bg-white border-t border-[#E3DDCF]">
        <button
          type="button"
          onClick={() => navigate('/groups/new/order')}
          className="w-full h-[52px] rounded-[14px] bg-[#0F8A5F] active:bg-[#0B6E4B] text-white font-heading font-bold text-[16px] flex items-center justify-center cursor-pointer shadow-sm hover:brightness-105 transition-all"
        >
          Next: payout order
        </button>
      </div>
    </div>
  );
};
