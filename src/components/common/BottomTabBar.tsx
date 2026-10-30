import React from 'react';
import { Icon } from './Icon';
import { useLanguage, TranslationKey } from '../../i18n/LanguageContext';

export type MainTab = 'home' | 'groups' | 'pay' | 'activity' | 'profile';

interface BottomTabBarProps {
  activeTab: MainTab;
  onTabChange: (tab: MainTab) => void;
}

export const BottomTabBar: React.FC<BottomTabBarProps> = ({ activeTab, onTabChange }) => {
  const { t } = useLanguage();
  const tabs = [
    { id: 'home' as MainTab, label: t('home'), icon: 'home' },
    { id: 'groups' as MainTab, label: t('groups'), icon: 'users' },
    { id: 'pay' as MainTab, label: t('pay'), icon: 'wallet', isRaised: true },
    { id: 'activity' as MainTab, label: t('activity'), icon: 'activity' },
    { id: 'profile' as MainTab, label: t('profile'), icon: 'user' },
  ];

  return (
    <div className="h-[92px] pb-6 pt-2 bg-white border-t border-[#E3DDCF] px-4 flex items-center justify-between shrink-0 select-none z-20">
      {tabs.map((tab) => {
        if (tab.isRaised) {
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className="flex flex-col items-center justify-center -mt-6 group cursor-pointer focus:outline-none"
              aria-label="Pay contribution"
            >
              <div className="w-[50px] h-[50px] rounded-full bg-[#0F8A5F] active:bg-[#0B6E4B] text-white flex items-center justify-center shadow-md border-[3px] border-white group-hover:scale-105 transition-transform duration-150">
                <Icon name="wallet" size={24} strokeWidth={2.2} />
              </div>
              <span className="text-[11px] font-semibold text-[#0B6E4B] mt-1">
                {tab.label}
              </span>
            </button>
          );
        }

        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className="flex-1 flex flex-col items-center justify-center py-1 cursor-pointer group focus:outline-none"
          >
            <div
              className={`transition-colors duration-150 ${
                isActive ? 'text-[#0F8A5F]' : 'text-[#8A968F] group-hover:text-[#4F5F57]'
              }`}
            >
              <Icon name={tab.icon} size={22} strokeWidth={isActive ? 2.3 : 2} />
            </div>
            <span
              className={`text-[11px] mt-1 font-medium transition-colors duration-150 ${
                isActive ? 'font-semibold text-[#0B6E4B]' : 'text-[#4F5F57]'
              }`}
            >
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};
