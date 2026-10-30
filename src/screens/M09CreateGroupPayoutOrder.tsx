import React from 'react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../i18n/LanguageContext';
import { StatusBar } from '../components/common/StatusBar';
import { TopBar } from '../components/common/TopBar';
import { Icon } from '../components/common/Icon';

export const M09CreateGroupPayoutOrder: React.FC = () => {
  const { navigate, createGroupDraft, updateCreateGroupDraft } = useApp();
  const { t } = useLanguage();

  const options = [
    {
      id: 'fixed' as const,
      icon: 'list',
      title: t('fixedOrder'),
      description: t('fixedOrderDesc'),
    },
    {
      id: 'draw' as const,
      icon: 'shuffle',
      title: t('drawAtStart'),
      description: t('drawAtStartDesc', { size: createGroupDraft.size }),
    },
    {
      id: 'vote' as const,
      icon: 'vote',
      title: t('groupVote'),
      description: t('groupVoteDesc'),
    },
  ];

  return (
    <div className="flex-1 bg-[#FAF7F0] flex flex-col justify-between overflow-y-auto hide-scrollbar">
      <div>
        <StatusBar mode="light" />
        <TopBar
          title={t('createNewGroup')}
          onBack={() => navigate('/groups/new/rules')}
          showBack={true}
        />

        {/* Stepper bar */}
        <div className="px-5 pt-1 pb-3 flex items-center justify-between">
          <div className="flex-1 flex gap-1.5 mr-3">
            <div className="h-1 flex-1 rounded-full bg-[#0F8A5F]" />
            <div className="h-1 flex-1 rounded-full bg-[#0F8A5F]" />
            <div className="h-1 flex-1 rounded-full bg-[#E3DDCF]" />
          </div>
          <span className="text-[12px] font-medium text-[#4F5F57] whitespace-nowrap">
            {t('step2Order')}
          </span>
        </div>

        <div className="px-5 pt-2 pb-6 space-y-4">
          <h2 className="font-heading font-bold text-[20px] text-[#0B3D2E] leading-tight">
            {t('howDecideOrder')}
          </h2>

          {/* Three Radio Cards */}
          <div className="space-y-3 pt-1">
            {options.map((option) => {
              const isSelected = createGroupDraft.payoutOrder === option.id;
              return (
                <div
                  key={option.id}
                  onClick={() => updateCreateGroupDraft({ payoutOrder: option.id })}
                  className={`p-4 rounded-[16px] cursor-pointer transition-all flex items-start gap-3.5 shadow-sm ${
                    isSelected
                      ? 'bg-[#E3F4EC] border-2 border-[#0F8A5F]'
                      : 'bg-white border border-[#E3DDCF] hover:border-[#0F8A5F]/40'
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-[12px] flex items-center justify-center shrink-0 ${
                      isSelected
                        ? 'bg-[#0F8A5F] text-white'
                        : 'bg-[#FAF7F0] text-[#0B3D2E]'
                    }`}
                  >
                    <Icon name={option.icon} size={20} strokeWidth={2.2} />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-heading font-bold text-[15px] text-[#0B3D2E]">
                        {option.title}
                      </span>
                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                          isSelected
                            ? 'border-[#0F8A5F] bg-[#0F8A5F]'
                            : 'border-[#8A968F] bg-white'
                        }`}
                      >
                        {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                      </div>
                    </div>
                    <p className="text-[13px] text-[#4F5F57] mt-1 leading-snug">
                      {option.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Note with info icon */}
          <div className="p-3.5 rounded-[14px] bg-white border border-[#E3DDCF] flex items-start gap-2.5">
            <Icon name="info" size={17} className="text-[#0F8A5F] mt-0.5 shrink-0" />
            <p className="text-[13px] text-[#4F5F57] leading-snug">
              Later, two members can swap turns only if both agree and the group approves.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-5 pt-3 pb-8 bg-white border-t border-[#E3DDCF]">
        <button
          type="button"
          onClick={() => navigate('/groups/new/review')}
          className="w-full h-[52px] rounded-[14px] bg-[#0F8A5F] active:bg-[#0B6E4B] text-white font-heading font-bold text-[16px] flex items-center justify-center cursor-pointer shadow-sm hover:brightness-105 transition-all"
        >
          Next: review
        </button>
      </div>
    </div>
  );
};
