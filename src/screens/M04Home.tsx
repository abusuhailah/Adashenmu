import React from 'react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../i18n/LanguageContext';
import { StatusBar } from '../components/common/StatusBar';
import { BottomTabBar } from '../components/common/BottomTabBar';
import { MoneyStateBadge } from '../components/common/MoneyStateBadge';
import { TurnChip } from '../components/common/TurnChip';
import { Avatar } from '../components/common/Avatar';
import { Icon } from '../components/common/Icon';
import { formatNaira } from '../data/types';

export const M04Home: React.FC = () => {
  const {
    navigate,
    currentUser,
    groups,
    hasPaidUserContribution,
    userContributionState,
    potTotal,
    potConfirmedCount,
    userPaidAmount,
    userRemainingBalance,
    totalCycleContribution,
    partnerBank,
    setPartnerBankModalOpen,
    setJoinModalOpen,
  } = useApp();
  const { language, t } = useLanguage();

  const isFullyPaid = hasPaidUserContribution || userRemainingBalance <= 0;
  const isPartiallyPaid = userPaidAmount > 0 && userRemainingBalance > 0;
  const activeGroup = groups[0];
  const groupSize = activeGroup?.rules?.size || 10;
  const targetPot = (activeGroup?.rules?.amount || 20000) * groupSize;
  const progressPercent = Math.min(100, Math.round((potConfirmedCount / groupSize) * 100));

  const firstName = currentUser.name.split(' ')[0] || 'Member';
  const isOrganiser = activeGroup?.organiserId === currentUser.id;

  return (
    <div className="flex-1 bg-[#FAF7F0] flex flex-col justify-between overflow-hidden">
      <div className="flex-1 overflow-y-auto hide-scrollbar">
        <StatusBar mode="light" />

        {/* Top Header */}
        <div className="px-5 pt-2 pb-3 flex items-center justify-between">
          <div>
            <span className="text-[12px] font-medium text-[#4F5F57] block">
              {t('dateMonday')}
            </span>
            <div className="flex items-center gap-2 mt-0.5">
              <h1 className="font-heading font-bold text-[22px] text-[#0B3D2E] leading-tight">
                {language === 'ha' ? `Sannu, ${firstName}` : `Welcome, ${firstName}`}
              </h1>
              {activeGroup && (
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isOrganiser
                      ? 'bg-[#E3F4EC] text-[#0B6E4B] border border-[#0F8A5F]/20'
                      : 'bg-[#EBF3FB] text-[#1E5D88] border border-[#1E5D88]/20'
                  }`}
                >
                  {isOrganiser
                    ? language === 'ha' ? 'Mai Shirya' : 'Organiser'
                    : language === 'ha' ? 'Mamba' : 'Member'}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Bell Notification Button */}
            <button
              type="button"
              onClick={() => navigate('/activity')}
              aria-label="Notifications"
              className="w-10 h-10 rounded-full bg-white border border-[#E3DDCF] flex items-center justify-center text-[#0B3D2E] relative cursor-pointer active:scale-95 transition-all shadow-sm"
            >
              <Icon name="bell" size={18} strokeWidth={2.2} />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-[#B42318] ring-2 ring-white" />
            </button>
          </div>
        </div>

        <div className="px-5 space-y-4 pb-6">
          {/* Partner Bank Escrow Badge */}
          <div
            onClick={() => setPartnerBankModalOpen(true)}
            className="p-3 rounded-[14px] bg-white border border-[#E3DDCF] flex items-center justify-between cursor-pointer hover:border-[#0F8A5F] shadow-xs transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#E3F4EC] text-[#0F8A5F] flex items-center justify-center shrink-0">
                <Icon name="bank" size={16} strokeWidth={2.4} />
              </div>
              <div className="text-[12px]">
                <span className="font-bold text-[#0B3D2E] block leading-tight">
                  {partnerBank?.bankName || 'Access Bank (CBN Licensed)'}
                </span>
                <span className="text-[#0F8A5F] font-semibold">
                  {partnerBank?.isVerified
                    ? t('accountVerified')
                    : language === 'ha' ? 'Haɗa asusun banki' : 'Link partner account'}
                </span>
              </div>
            </div>
            <Icon name="chevron-right" size={16} className="text-[#8A968F]" />
          </div>

          {/* Reminder banner: shows remaining balance if partially paid, full if not paid */}
          {!isFullyPaid && (
            <div className="p-3.5 rounded-[14px] bg-[#FFF4DB] border border-[#F2B33D]/30 flex items-center justify-between gap-2.5 animate-in fade-in duration-200">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="text-[#8A5A00] shrink-0">
                  <Icon name="clock" size={18} strokeWidth={2.2} />
                </div>
                <p className="text-[13px] text-[#0B3D2E] font-medium leading-tight truncate">
                  {isPartiallyPaid
                    ? t('reminderRemaining', { amount: formatNaira(userRemainingBalance) })
                    : t('reminderDue')}
                </p>
              </div>
              <button
                type="button"
                onClick={() => navigate('/pay')}
                className="text-[13px] font-bold text-[#0B6E4B] hover:underline whitespace-nowrap cursor-pointer shrink-0"
              >
                {isPartiallyPaid ? t('payBalance') : t('payNow')}
              </button>
            </div>
          )}

          {/* Pot Card -> tap opens group ledger */}
          <div
            onClick={() => navigate(`/groups/${activeGroup?.id || 'g-kasuwa-atamfa'}/ledger`)}
            className="bg-[#0B3D2E] rounded-[16px] p-5 text-white shadow-md cursor-pointer hover:brightness-105 transition-all"
          >
            <div className="flex items-center justify-between mb-1.5">
              <p className="text-[11px] font-semibold tracking-wider text-[#2FBF85] uppercase">
                {activeGroup?.name || 'KASUWA ATAMFA ADASHE'} · {language === 'ha' ? 'ZANGO' : 'CYCLE'} 4 {language === 'ha' ? 'CIKIN' : 'OF'} {groupSize}
              </p>
              {activeGroup?.code && (
                <span className="text-[10px] font-mono font-bold bg-[#072A20] px-2 py-0.5 rounded text-[#2FBF85] border border-[#2FBF85]/30">
                  {activeGroup.code}
                </span>
              )}
            </div>

            <div className="flex items-baseline gap-2 mb-3">
              <span className="font-heading font-extrabold text-[32px] text-white tracking-tight">
                {formatNaira(potTotal)}
              </span>
              <span className="text-[15px] font-semibold text-[#2FBF85]">
                {language === 'ha' ? `na ${formatNaira(targetPot)}` : `of ${formatNaira(targetPot)}`}
              </span>
            </div>

            {/* Progress bar */}
            <div className="w-full h-2 rounded-full bg-[#072A20] overflow-hidden mb-3">
              <div
                style={{ width: `${progressPercent}%` }}
                className="h-full bg-[#2FBF85] rounded-full transition-all duration-700 ease-out"
              />
            </div>

            <div className="flex items-center justify-between text-[12px] text-white/80 pb-3 border-b border-white/10">
              <span>{t('inThePotCount', { count: potConfirmedCount })}</span>
              <span className="text-[#2FBF85]">{t('heldByBank')}</span>
            </div>

            {/* Next payout row */}
            <div className="pt-3 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Avatar initials="HL" color="gold" size={32} />
                <div>
                  <span className="text-[13px] font-semibold text-white block leading-tight">
                    {t('payoutTo')}
                  </span>
                  <span className="text-[11px] text-[#2FBF85] block mt-0.5">
                    {t('payoutDate')}
                  </span>
                </div>
              </div>
              <TurnChip status="next" />
            </div>
          </div>

          {/* Two tiles side by side */}
          <div className="grid grid-cols-2 gap-3">
            {/* Your Payment Tile */}
            <div
              onClick={() => navigate('/pay')}
              className="bg-white rounded-[16px] p-3.5 border border-[#E3DDCF] shadow-sm flex flex-col justify-between cursor-pointer hover:border-[#0F8A5F]/40 transition-colors"
            >
              <div>
                <span className="text-[11px] font-semibold text-[#4F5F57] uppercase tracking-wider block">
                  {t('yourPayment')}
                </span>
                <span className="font-heading font-extrabold text-[20px] text-[#0B3D2E] block mt-0.5">
                  {isPartiallyPaid ? formatNaira(userPaidAmount) : formatNaira(totalCycleContribution)}
                </span>
                {isPartiallyPaid && (
                  <span className="text-[10px] text-[#8A5A00] font-semibold block mt-0.5">
                    {t('ofPaid', { total: formatNaira(totalCycleContribution) })}
                  </span>
                )}
              </div>
              <div className="mt-3 flex flex-col gap-1.5 items-start">
                <MoneyStateBadge state={userContributionState} />
                <span className="text-[11px] text-[#4F5F57]">
                  {isFullyPaid
                    ? t('paidOnDate')
                    : isPartiallyPaid
                    ? `${formatNaira(userRemainingBalance)} ${t('remaining')}`
                    : t('dueWed')}
                </span>
              </div>
            </div>

            {/* Your Turn to Collect Tile */}
            <div
              onClick={() => navigate(`/groups/${activeGroup?.id || 'g-kasuwa-atamfa'}/calendar`)}
              className="bg-[#FFF4DB] rounded-[16px] p-3.5 border border-[#F2B33D]/30 shadow-sm flex flex-col justify-between cursor-pointer hover:border-[#F2B33D] transition-colors"
            >
              <div>
                <span className="text-[11px] font-semibold text-[#8A5A00] uppercase tracking-wider block">
                  {t('yourTurnToCollect')}
                </span>
                <span className="font-heading font-extrabold text-[20px] text-[#0B3D2E] block mt-0.5">
                  {formatNaira(targetPot)}
                </span>
              </div>
              <div className="mt-3 flex flex-col gap-1.5 items-start">
                <TurnChip status="yourTurn" />
                <span className="text-[11px] font-medium text-[#8A5A00]">
                  {t('yourTurnDate')}
                </span>
              </div>
            </div>
          </div>

          {/* Recent Activity card */}
          <div className="bg-white rounded-[16px] p-4 border border-[#E3DDCF] shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-heading font-bold text-[16px] text-[#0B3D2E]">
                {t('recentActivity')}
              </h3>
              <button
                type="button"
                onClick={() => navigate('/activity')}
                className="text-[13px] font-semibold text-[#0B6E4B] hover:underline cursor-pointer"
              >
                {t('seeAll')}
              </button>
            </div>

            <div className="divide-y divide-[#EFEAE0]">
              {/* If user recently contributed */}
              {userPaidAmount > 0 && (
                <div className="py-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar initials={currentUser.initials} color={currentUser.avatarColor} size={36} />
                    <div>
                      <span className="text-[13px] font-semibold text-[#0B3D2E] block leading-tight">
                        {t('youPaid')} {formatNaira(userPaidAmount)}
                      </span>
                      <span className="text-[11px] text-[#4F5F57] block mt-0.5">
                        {t('todayTime')} · USSD {isPartiallyPaid && '(Instalment)'}
                      </span>
                    </div>
                  </div>
                  <MoneyStateBadge state={userContributionState} />
                </div>
              )}

              {/* Activity rows */}
              <div className="py-2.5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar initials="RA" color="blue" size={36} />
                  <div>
                    <span className="text-[13px] font-semibold text-[#0B3D2E] block leading-tight">
                      Rukayya Adamu
                    </span>
                    <span className="text-[11px] text-[#4F5F57] block mt-0.5">
                      Paid ₦20,000 · {t('todayTime')}
                    </span>
                  </div>
                </div>
                <MoneyStateBadge state="confirming" />
              </div>

              <div className="py-2.5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar initials="MS" color="green" size={36} />
                  <div>
                    <span className="text-[13px] font-semibold text-[#0B3D2E] block leading-tight">
                      Maryam Sani
                    </span>
                    <span className="text-[11px] text-[#4F5F57] block mt-0.5">
                      Paid ₦20,000 · {t('yesterday')}
                    </span>
                  </div>
                </div>
                <MoneyStateBadge state="inThePot" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <BottomTabBar
        activeTab="home"
        onTabChange={(tab) => {
          if (tab === 'pay') navigate('/pay');
          else if (tab === 'groups') navigate('/groups');
          else if (tab === 'activity') navigate('/activity');
          else if (tab === 'profile') navigate('/profile');
        }}
      />
    </div>
  );
};
