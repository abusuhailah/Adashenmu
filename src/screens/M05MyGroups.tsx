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
    currentUser,
  } = useApp();
  const { language, t } = useLanguage();

  return (
    <div className="h-full max-h-full flex-1 bg-[#FAF7F0] flex flex-col justify-between overflow-hidden">
      <div className="flex-1 overflow-y-auto hide-scrollbar overscroll-contain">
        <StatusBar mode="light" />
        <TopBar title={t('myGroups')} showBack={false} />

        <div className="px-5 space-y-4 pb-6 pt-1">
          {/* Empty state if user has no groups yet */}
          {groups.length === 0 && (
            <div className="bg-white rounded-[16px] p-6 border border-[#E3DDCF] shadow-sm text-center my-2">
              <div className="w-14 h-14 rounded-full bg-[#E3F4EC] text-[#0F8A5F] flex items-center justify-center mx-auto mb-3">
                <Icon name="pot" size={28} strokeWidth={2.2} />
              </div>
              <h3 className="font-heading font-bold text-[18px] text-[#0B3D2E] mb-1">
                {language === 'ha' ? 'Babu Kungiyar Ajiya Tukuna' : 'No Savings Groups Yet'}
              </h3>
              <p className="text-[13px] text-[#4F5F57] leading-relaxed max-w-[280px] mx-auto mb-5">
                {language === 'ha'
                  ? 'Kira ko shiga kungiyar adashe tare da iyalai ko abokan kasuwanci don tara kudi cikin amana.'
                  : 'Start your own adashe group as an organiser, or join an existing group with an invite code.'}
              </p>
            </div>
          )}

          {/* Groups You Organise Section */}
          {groups.filter((g) => g.organiserId === currentUser.id).length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <span className="text-[12px] font-bold text-[#0F8A5F] uppercase tracking-wider">
                  {language === 'ha' ? 'Kungiyoyin da Kake Shiryawa' : 'Groups You Organise'}
                </span>
                <span className="text-[11px] font-semibold bg-[#E3F4EC] text-[#0B6E4B] px-2 py-0.5 rounded-full border border-[#0F8A5F]/20">
                  {groups.filter((g) => g.organiserId === currentUser.id).length}
                </span>
              </div>

              {groups
                .filter((g) => g.organiserId === currentUser.id)
                .map((group) => {
                  const size = group.rules?.size || 10;
                  const confirmedCount = group.members?.length || 1;
                  const progressPercent = Math.min(100, Math.round((confirmedCount / size) * 100));

                  return (
                    <div
                      key={group.id}
                      onClick={() => navigate(`/groups/${group.id}/ledger`)}
                      className="bg-white rounded-[16px] p-4.5 border border-[#0F8A5F]/30 shadow-sm cursor-pointer hover:border-[#0F8A5F] transition-all"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-[12px] bg-[#E3F4EC] text-[#0F8A5F] flex items-center justify-center shrink-0">
                            <Icon name="pot" size={24} strokeWidth={2.2} />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="font-heading font-bold text-[17px] text-[#0B3D2E] leading-tight">
                                {group.name}
                              </h3>
                              {group.code && (
                                <span className="text-[10px] font-mono font-bold bg-[#FAF7F0] px-1.5 py-0.5 rounded border border-[#E3DDCF] text-[#4F5F57]">
                                  {group.code}
                                </span>
                              )}
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E3F4EC] text-[#0B6E4B] border border-[#0F8A5F]/20">
                                {language === 'ha' ? 'Mai Shirya' : 'Organiser'}
                              </span>
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

                      <div className="flex items-center justify-between text-[12px] text-[#4F5F57] mb-1.5 font-medium">
                        <span>
                          {language === 'ha' ? 'Zango na' : 'Cycle'}{' '}
                          {group.currentCycle?.number || 1} {language === 'ha' ? 'cikin' : 'of'}{' '}
                          {group.currentCycle?.of || size}
                        </span>
                        <span>
                          {language === 'ha'
                            ? `Mambobi · ${group.members?.length || 1} cikin ${size}`
                            : `Members · ${group.members?.length || 1} of ${size} joined`}
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-[#EFEAE0] overflow-hidden mb-3">
                        <div
                          style={{ width: `${progressPercent}%` }}
                          className="h-full bg-[#0F8A5F] rounded-full transition-all duration-500 ease-out"
                        />
                      </div>

                      <div className="pt-2.5 border-t border-[#EFEAE0] flex items-center justify-between text-[12px]">
                        <div>
                          <span className="text-[#4F5F57] block">{t('nextPayout')}</span>
                          <span className="font-semibold text-[#0B3D2E]">
                            {group.currentCycle?.payoutTo || group.members?.[0]?.name || 'Next in rotation'}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-[#4F5F57] block mb-1">
                            {language === 'ha' ? 'Asusun Karba' : 'Receiving Account'}
                          </span>
                          <span className="font-mono text-[11px] font-semibold text-[#0F8A5F]">
                            {group.organiserAccount?.bankName ? group.organiserAccount.bankName.split(' ')[0] : 'Bank'}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}

          {/* Groups You Joined Section */}
          {groups.filter((g) => g.organiserId !== currentUser.id).length > 0 && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between px-1">
                <span className="text-[12px] font-bold text-[#1E5D88] uppercase tracking-wider">
                  {language === 'ha' ? 'Kungiyoyin da Kake Ciki (Mamba)' : 'Groups You Joined'}
                </span>
                <span className="text-[11px] font-semibold bg-[#EBF3FB] text-[#1E5D88] px-2 py-0.5 rounded-full border border-[#1E5D88]/20">
                  {groups.filter((g) => g.organiserId !== currentUser.id).length}
                </span>
              </div>

              {groups
                .filter((g) => g.organiserId !== currentUser.id)
                .map((group) => {
                  const size = group.rules?.size || 10;
                  const confirmedCount = group.members?.length || 1;
                  const progressPercent = Math.min(100, Math.round((confirmedCount / size) * 100));

                  return (
                    <div
                      key={group.id}
                      onClick={() => navigate(`/groups/${group.id}/ledger`)}
                      className="bg-white rounded-[16px] p-4.5 border border-[#E3DDCF] shadow-sm cursor-pointer hover:border-[#1E5D88]/40 transition-all"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-[12px] bg-[#EBF3FB] text-[#1E5D88] flex items-center justify-center shrink-0">
                            <Icon name="pot" size={24} strokeWidth={2.2} />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="font-heading font-bold text-[17px] text-[#0B3D2E] leading-tight">
                                {group.name}
                              </h3>
                              {group.code && (
                                <span className="text-[10px] font-mono font-bold bg-[#FAF7F0] px-1.5 py-0.5 rounded border border-[#E3DDCF] text-[#4F5F57]">
                                  {group.code}
                                </span>
                              )}
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#EBF3FB] text-[#1E5D88] border border-[#1E5D88]/20">
                                {language === 'ha' ? 'Mamba' : 'Member'}
                              </span>
                            </div>
                            <p className="text-[12px] text-[#4F5F57] mt-0.5">
                              {language === 'ha' ? 'Mai shiryawa:' : 'Organiser:'}{' '}
                              <span className="font-semibold text-[#0B3D2E]">{group.organiserName}</span> ·{' '}
                              {formatNaira(group.rules?.amount || 20000)}
                            </p>
                          </div>
                        </div>
                        <Icon name="chevron-right" size={20} className="text-[#8A968F]" />
                      </div>

                      <div className="flex items-center justify-between text-[12px] text-[#4F5F57] mb-1.5 font-medium">
                        <span>
                          {language === 'ha' ? 'Zango na' : 'Cycle'}{' '}
                          {group.currentCycle?.number || 1} {language === 'ha' ? 'cikin' : 'of'}{' '}
                          {group.currentCycle?.of || size}
                        </span>
                        <span>
                          {language === 'ha'
                            ? `A cikin tukunya · ${group.members?.length || 1} cikin ${size}`
                            : `In the pot · ${group.members?.length || 1} of ${size}`}
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-[#EFEAE0] overflow-hidden mb-3">
                        <div
                          style={{ width: `${progressPercent}%` }}
                          className="h-full bg-[#1E5D88] rounded-full transition-all duration-500 ease-out"
                        />
                      </div>

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
            </div>
          )}

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
