import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../i18n/LanguageContext';
import { StatusBar } from '../components/common/StatusBar';
import { TopBar } from '../components/common/TopBar';
import { BottomTabBar } from '../components/common/BottomTabBar';
import { Avatar, AvatarColor } from '../components/common/Avatar';
import { MoneyStateBadge } from '../components/common/MoneyStateBadge';
import { Icon } from '../components/common/Icon';
import { formatNaira } from '../data/types';

type FilterType = 'all' | 'pending' | 'confirming' | 'late' | 'released';

export const M17Activity: React.FC = () => {
  const { navigate, activity, members, notifications, markNotificationRead } = useApp();
  const { t, language } = useLanguage();
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
    <div className="h-full max-h-full flex-1 bg-[#FAF7F0] flex flex-col justify-between overflow-hidden">
      <div className="flex-1 overflow-y-auto hide-scrollbar overscroll-contain">
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

        {/* Notifications and Activity grouped list */}
        <div className="px-5 pt-2 pb-6 space-y-5">
          {/* Recent System Notifications */}
          {notifications && notifications.length > 0 && (
            <div>
              <span className="text-[12px] font-bold text-[#0F8A5F] uppercase tracking-wider block mb-2 px-1">
                {language === 'ha' ? 'Sanarwar Kudi' : 'System & Payment Alerts'}
              </span>
              <div className="bg-white rounded-[16px] border border-[#E3DDCF] shadow-sm divide-y divide-[#EFEAE0] overflow-hidden">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    onClick={() => markNotificationRead(notif.id)}
                    className={`p-3.5 flex items-start gap-3 transition-colors ${
                      notif.read ? 'bg-white' : 'bg-[#E3F4EC]/30'
                    }`}
                  >
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                        notif.type.includes('payout')
                          ? 'bg-[#EBF3FB] text-[#1E5D88]'
                          : notif.type.includes('confirm')
                          ? 'bg-[#E3F4EC] text-[#0F8A5F]'
                          : notif.type === 'late'
                          ? 'bg-[#FEF3F2] text-[#B42318]'
                          : 'bg-[#FAF7F0] text-[#0B3D2E]'
                      }`}
                    >
                      <Icon
                        name={
                          notif.type.includes('payout')
                            ? 'party'
                            : notif.type.includes('confirm')
                            ? 'check'
                            : notif.type === 'late'
                            ? 'alert'
                            : 'bell'
                        }
                        size={18}
                        strokeWidth={2.2}
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-heading font-bold text-[14px] text-[#0B3D2E]">
                          {notif.title}
                        </span>
                        <span className="text-[11px] text-[#8A968F]">{notif.time || notif.timestamp || 'Just now'}</span>
                      </div>
                      <p className="text-[12px] text-[#4F5F57] mt-0.5 leading-snug">
                        {notif.detail || notif.message}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Activity items */}
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
                        <MoneyStateBadge state={item.state as any} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          {/* Clean empty state when no activity exists */}
          {activity.length === 0 && (!notifications || notifications.length === 0) && (
            <div className="bg-white rounded-[16px] p-6 border border-[#E3DDCF] shadow-sm text-center my-4">
              <div className="w-13 h-13 rounded-full bg-[#E3F4EC] text-[#0F8A5F] flex items-center justify-center mx-auto mb-3">
                <Icon name="activity" size={24} strokeWidth={2.2} />
              </div>
              <h3 className="font-heading font-bold text-[16px] text-[#0B3D2E] mb-1">
                {language === 'ha' ? 'Babu Ayyukan Kudi Tukuna' : 'No Activity Yet'}
              </h3>
              <p className="text-[13px] text-[#4F5F57] leading-relaxed max-w-[280px] mx-auto">
                {language === 'ha'
                  ? 'Da zarar mambobi suka tura kudi ko aka fitar da kudin adashe, dukkan bayanan za su bayyana a nan tare da tabbatar da gaskiya.'
                  : 'As soon as members transfer contributions or payouts are disbursed, real-time records and payment receipts will appear here.'}
              </p>
            </div>
          )}
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
