import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../i18n/LanguageContext';
import { StatusBar } from '../components/common/StatusBar';
import { TopBar } from '../components/common/TopBar';
import { BottomTabBar } from '../components/common/BottomTabBar';
import { Avatar, AvatarColor } from '../components/common/Avatar';
import { MoneyStateBadge } from '../components/common/MoneyStateBadge';
import { formatNaira } from '../data/types';

type FilterType = 'all' | 'pending' | 'confirming' | 'late' | 'released';

export const M17Activity: React.FC = () => {
  const { navigate, activity, members } = useApp();
  const { t } = useLanguage();
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  const filterOptions: { id: FilterType; label: string }[] = [
    { id: 'all', label: t('all') },
    { id: 'pending', label: t('statePending') },
    { id: 'confirming', label: t('stateConfirming') },
    { id: 'late', label: t('stateLate') },
    { id: 'released', label: t('stateReleased') },
  ];

  const getMemberInitials = (memberId: string) => {
    const found = members.find((m) => m.id === memberId);
    return found ? found.initials : 'AD';
  };

  const getMemberColor = (memberId: string): AvatarColor => {
    const found = members.find((m) => m.id === memberId);
    return (found?.avatarColor as AvatarColor) || 'green';
  };

  return (
    <div className="flex-1 bg-[#FAF7F0] flex flex-col justify-between overflow-hidden">
      <div className="flex-1 overflow-y-auto hide-scrollbar">
        <StatusBar mode="light" />
        <TopBar title={t('activity')} showBack={false} />

        {/* Filter chips bar */}
        <div className="px-5 py-2 overflow-x-auto hide-scrollbar flex items-center gap-2">
          {filterOptions.map((opt) => {
            const isSelected = activeFilter === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => setActiveFilter(opt.id)}
                className={`px-4 py-1.5 rounded-full text-[13px] font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-[#0B3D2E] text-white shadow-sm'
                    : 'bg-white border border-[#E3DDCF] text-[#4F5F57] hover:border-[#0F8A5F]'
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>

        {/* Activity grouped list */}
        <div className="px-5 pt-2 pb-6 space-y-5">
          {activity.map((section) => {
            const filteredItems = section.items.filter((item) => {
              if (activeFilter === 'all') return true;
              return item.state.toLowerCase() === activeFilter.toLowerCase();
            });

            if (filteredItems.length === 0) return null;

            return (
              <div key={section.date}>
                <span className="text-[12px] font-semibold text-[#4F5F57] uppercase tracking-wider block mb-2 px-1">
                  {section.label}
                </span>

                <div className="bg-white rounded-[16px] border border-[#E3DDCF] shadow-sm divide-y divide-[#EFEAE0] overflow-hidden">
                  {filteredItems.map((item, idx) => (
                    <div key={idx} className="p-3.5 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar
                          initials={getMemberInitials(item.who)}
                          color={getMemberColor(item.who)}
                          size={38}
                        />
                        <div>
                          <span className="font-heading font-bold text-[14px] text-[#0B3D2E] block leading-tight">
                            {item.title}
                          </span>
                          <span className="text-[12px] text-[#4F5F57] block mt-0.5">
                            {item.detail}
                          </span>
                        </div>
                      </div>

                      <div className="text-right flex flex-col items-end gap-1">
                        <span className="font-heading font-bold text-[14px] text-[#0B3D2E]">
                          {formatNaira(item.amount)}
                        </span>
                        <MoneyStateBadge state={item.state} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Bar */}
      <BottomTabBar
        activeTab="activity"
        onTabChange={(tab) => {
          if (tab === 'home') navigate('/home');
          else if (tab === 'groups') navigate('/groups');
          else if (tab === 'pay') navigate('/pay');
          else if (tab === 'profile') navigate('/profile');
        }}
      />
    </div>
  );
};
