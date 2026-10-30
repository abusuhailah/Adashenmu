import React from 'react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../i18n/LanguageContext';
import { StatusBar } from '../components/common/StatusBar';
import { TopBar } from '../components/common/TopBar';
import { BottomTabBar } from '../components/common/BottomTabBar';
import { Icon } from '../components/common/Icon';
import { MoneyStateBadge } from '../components/common/MoneyStateBadge';
import { formatNaira } from '../data/types';

export const M05MyGroups: React.FC = () => {
  const {
    groups,
    navigate,
    potConfirmedCount,
    userContributionState,
    setJoinModalOpen,
  } = useApp();
  const { language, t } = useLanguage();

  return (
    <div className="flex-1 bg-[#FAF7F0] flex flex-col justify-between overflow-hidden">
      <div className="flex-1 overflow-y-auto hide-scrollbar">
        <StatusBar mode="light" />
        <TopBar title={t('myGroups')} showBack={false} />

        <div className="px-5 space-y-4 pb-6 pt-1">
          {/* Dynamic Groups List */}
          {groups.map((group, index) => {
            const isFirst = index === 0;
            const size = group.rules?.size || 10;
            const confirmedCount = isFirst ? potConfirmedCount : Math.min(size, group.members?.length || 1);
            const progressPercent = Math.min(100, Math.round((confirmedCount / size) * 100));

            return (
              <div
                key={group.id}
                onClick={() => navigate(`/groups/${group.id}/ledger`)}
                className="bg-white rounded-[16px] p-4.5 border border-[#E3DDCF] shadow-sm cursor-pointer hover:border-[#0F8A5F]/40 transition-colors"
              >
                {/* Header row with pot icon */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-[12px] bg-[#E3F4EC] text-[#0F8A5F] flex items-center justify-center shrink-0">
                      <Icon name="pot" size={24} strokeWidth={2.2} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-heading font-bold text-[17px] text-[#0B3D2E] leading-tight">
                          {group.name}
                        </h3>
                        {group.code && (
                          <span className="text-[10px] font-mono font-bold bg-[#FAF7F0] px-1.5 py-0.5 rounded border border-[#E3DDCF] text-[#4F5F57]">
                            {group.code}
                          </span>
                        )}
                      </div>
                      <p className="text-[12px] text-[#4F5F57] mt-0.5">
                        {formatNaira(group.rules?.amount || 20000)}{' '}
                        {group.rules?.frequency === 'weekly'
                          ? language === 'ha' ? 'mako-mako' : 'weekly'
                          : language === 'ha' ? 'kowane wata' : 'monthly'} · {size} {language === 'ha' ? 'mambobi' : 'members'}
                      </p>
                    </div>
                  </div>
                  <Icon name="chevron-right" size={20} className="text-[#8A968F]" />
                </div>

                {/* Cycle progress row */}
                <div className="flex items-center justify-between text-[12px] text-[#4F5F57] mb-1.5 font-medium">
                  <span>
                    {language === 'ha' ? 'Zango na' : 'Cycle'}{' '}
                    {group.currentCycle?.number || 1} {language === 'ha' ? 'cikin' : 'of'}{' '}
                    {group.currentCycle?.of || size}
                  </span>
                  <span>
                    {language === 'ha'
                      ? `A cikin tukunya · ${confirmedCount} cikin ${size}`
                      : `In the pot · ${confirmedCount} of ${size} confirmed`}
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#EFEAE0] overflow-hidden mb-3">
                  <div
                    style={{ width: `${progressPercent}%` }}
                    className="h-full bg-[#0F8A5F] rounded-full transition-all duration-500 ease-out"
                  />
                </div>

                {/* Next payout & your payment */}
                <div className="pt-2.5 border-t border-[#EFEAE0] flex items-center justify-between text-[12px]">
                  <div>
                    <span className="text-[#4F5F57] block">{t('nextPayout')}</span>
                    <span className="font-semibold text-[#0B3D2E]">
                      {group.currentCycle?.payoutTo || 'Next in rotation'}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[#4F5F57] block mb-1">{t('yourPayment')}</span>
                    <MoneyStateBadge state={userContributionState} />
                  </div>
                </div>
              </div>
            );
          })}

          {/* Dashed primary card: Create a new group */}
          <div
            onClick={() => navigate('/groups/new/rules')}
            className="rounded-[16px] p-4.5 border-2 border-dashed border-[#0F8A5F] bg-white hover:bg-[#E3F4EC]/40 transition-all cursor-pointer flex items-center gap-3.5 group shadow-sm"
          >
            <div className="w-11 h-11 rounded-full bg-[#E3F4EC] group-hover:bg-[#0F8A5F] text-[#0F8A5F] group-hover:text-white flex items-center justify-center shrink-0 transition-colors">
              <Icon name="plus" size={22} strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="font-heading font-bold text-[16px] text-[#0B3D2E]">
                {t('createNewGroup')}
              </h3>
              <p className="text-[12px] text-[#4F5F57] mt-0.5 leading-snug">
                {t('createNewGroupDesc')}
              </p>
            </div>
          </div>

          {/* Join with an invite link or code */}
          <div
            onClick={() => setJoinModalOpen(true)}
            className="rounded-[16px] p-4 bg-white border border-[#E3DDCF] shadow-sm hover:border-[#0F8A5F]/40 transition-colors cursor-pointer flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-[12px] bg-[#FAF7F0] text-[#0B3D2E] flex items-center justify-center shrink-0">
                <Icon name="send" size={18} strokeWidth={2.2} />
              </div>
              <div>
                <h4 className="font-heading font-semibold text-[15px] text-[#0B3D2E]">
                  {t('joinInvite')}
                </h4>
                <p className="text-[12px] text-[#4F5F57]">
                  {t('joinInviteDesc')}
                </p>
              </div>
            </div>
            <Icon name="chevron-right" size={20} className="text-[#8A968F]" />
          </div>

          {/* Info Card: Treasurer note */}
          <div className="p-3.5 rounded-[16px] bg-[#E3F4EC] border border-[#0F8A5F]/20 flex items-start gap-2.5">
            <Icon name="info" size={18} className="text-[#0F8A5F] shrink-0 mt-0.5" />
            <p className="text-[12px] text-[#0B3D2E] leading-snug">
              {t('treasurerNotice')}
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <BottomTabBar
        activeTab="groups"
        onTabChange={(tab) => {
          if (tab === 'home') navigate('/home');
          else if (tab === 'pay') navigate('/pay');
          else if (tab === 'activity') navigate('/activity');
          else if (tab === 'profile') navigate('/profile');
        }}
      />
    </div>
  );
};
