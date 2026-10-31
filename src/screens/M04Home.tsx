import React from 'react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../i18n/LanguageContext';
import { StatusBar } from '../components/common/StatusBar';
import { BottomTabBar } from '../components/common/BottomTabBar';
import { Avatar } from '../components/common/Avatar';
import { Icon } from '../components/common/Icon';
import { formatNaira } from '../data/types';

export const M04Home: React.FC = () => {
  const {
    navigate,
    currentUser,
    groups,
    activeGroup,
    activity,
    notifications,
    setJoinModalOpen,
  } = useApp();
  const { language, t } = useLanguage();

  const firstName = currentUser.name.split(' ')[0] || 'Member';
  const targetGroup = activeGroup || groups[0] || null;

  // Unread notifications count
  const unreadCount = notifications.filter((n) => !n.read).length;

  // Check if organiser has pending payments to confirm
  const isOrganiser = targetGroup?.organiserId === currentUser.id;
  const pendingConfirmations = (targetGroup?.currentCycle?.contributions || []).filter(
    (c) => c.state === 'confirming'
  );

  // Check if current user has a pending payout to confirm
  const currentTurn = (targetGroup?.payoutCalendar || []).find(
    (t) => t.turn === (targetGroup?.currentCycle?.number || 1)
  );
  const isPendingPayoutRecipient =
    currentTurn?.memberId === currentUser.id &&
    currentTurn?.status === 'pending_member_confirmation';

  return (
    <div className="flex-1 bg-[#FAF7F0] flex flex-col justify-between overflow-hidden">
      <div className="flex-1 overflow-y-auto hide-scrollbar">
        <StatusBar mode="light" />

        {/* Top Header */}
        <div className="px-5 pt-3 pb-3 flex items-center justify-between">
          <div>
            <span className="text-[12px] font-medium text-[#4F5F57] block">
              {new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'short' })}
            </span>
            <div className="flex items-center gap-2 mt-0.5">
              <h1 className="font-heading font-bold text-[22px] text-[#0B3D2E] leading-tight">
                {language === 'ha' ? `Sannu, ${firstName}` : `Welcome, ${firstName}`}
              </h1>
              {targetGroup && (
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
            <button
              type="button"
              onClick={() => navigate('/activity')}
              aria-label="Notifications"
              className="w-10 h-10 rounded-full bg-white border border-[#E3DDCF] flex items-center justify-center text-[#0B3D2E] relative cursor-pointer active:scale-95 transition-all shadow-sm"
            >
              <Icon name="bell" size={18} strokeWidth={2.2} />
              {unreadCount > 0 && (
                <span className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-[#B42318] ring-2 ring-white" />
              )}
            </button>
          </div>
        </div>

        <div className="px-5 space-y-4 pb-6">
          {/* EMPTY STATE: WHEN NO GROUPS EXIST */}
          {groups.length === 0 ? (
            <div className="p-6 rounded-[20px] bg-white border border-[#E3DDCF] shadow-sm text-center space-y-4 my-2">
              <div className="w-16 h-16 rounded-full bg-[#E3F4EC] text-[#0F8A5F] flex items-center justify-center mx-auto">
                <Icon name="pot" size={32} strokeWidth={2.2} />
              </div>
              <div>
                <h3 className="font-heading font-bold text-[19px] text-[#0B3D2E]">
                  {language === 'ha' ? 'Fara Adashenmu Yau' : 'Start Saving Together'}
                </h3>
                <p className="text-[13px] text-[#4F5F57] mt-1.5 leading-relaxed max-w-sm mx-auto">
                  {language === 'ha'
                    ? 'Ƙirƙiri ƙungiyar adashe domin gayyatar abokai da dangi, ko shiga ƙungiya tare da lambar gayyata daga mai shirya.'
                    : 'Create your rotating savings group to invite friends and community, or join an active group using an invite link or code.'}
                </p>
              </div>

              <div className="pt-2 space-y-2.5 max-w-xs mx-auto">
                <button
                  type="button"
                  onClick={() => navigate('/groups/new/rules')}
                  className="w-full h-[48px] rounded-[12px] bg-[#0F8A5F] active:bg-[#0B6E4B] text-white font-heading font-bold text-[14px] flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:brightness-105 transition-all"
                >
                  <Icon name="plus" size={18} strokeWidth={2.5} />
                  <span>{language === 'ha' ? 'Ƙirƙiri Ƙungiya' : 'Create a Savings Group'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setJoinModalOpen(true)}
                  className="w-full h-[48px] rounded-[12px] bg-white border border-[#E3DDCF] text-[#0B3D2E] font-heading font-bold text-[14px] flex items-center justify-center gap-2 cursor-pointer hover:bg-[#FAF7F0] transition-colors"
                >
                  <Icon name="send" size={16} strokeWidth={2.2} />
                  <span>{language === 'ha' ? 'Shiga da Lambar Gayyata' : 'Join with Invite Code'}</span>
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* ACTION BANNER: PENDING PAYMENTS FOR ORGANISER */}
              {isOrganiser && pendingConfirmations.length > 0 && (
                <div
                  onClick={() => navigate(`/groups/${targetGroup.id}/ledger`)}
                  className="p-3.5 rounded-[14px] bg-[#FFF4DB] border border-[#F2B33D] flex items-center justify-between gap-3 cursor-pointer hover:brightness-95 transition-all shadow-xs"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-[#8A5A00] text-white flex items-center justify-center shrink-0">
                      <Icon name="clock" size={16} strokeWidth={2.4} />
                    </div>
                    <div className="min-w-0">
                      <span className="font-heading font-bold text-[13px] text-[#8A5A00] block truncate">
                        {language === 'ha'
                          ? `Biyan kuɗi ${pendingConfirmations.length} na jiran tabbatarwa`
                          : `${pendingConfirmations.length} Payment(s) Waiting For Confirmation`}
                      </span>
                      <span className="text-[11px] text-[#4F5F57] block truncate">
                        {language === 'ha' ? 'Danna domin duba shaidar biya' : 'Tap to review receipts & confirm'}
                      </span>
                    </div>
                  </div>
                  <Icon name="chevron-right" size={16} className="text-[#8A5A00] shrink-0" />
                </div>
              )}

              {/* ACTION BANNER: PAYOUT READY FOR RECIPIENT MEMBER */}
              {isPendingPayoutRecipient && (
                <div
                  onClick={() => navigate(`/groups/${targetGroup.id}/ledger`)}
                  className="p-3.5 rounded-[14px] bg-[#E3F4EC] border-2 border-[#0F8A5F] flex items-center justify-between gap-3 cursor-pointer shadow-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-[#0F8A5F] text-white flex items-center justify-center shrink-0">
                      <Icon name="check" size={16} strokeWidth={3} />
                    </div>
                    <div>
                      <span className="font-heading font-bold text-[13px] text-[#0B3D2E] block">
                        🎉 {language === 'ha' ? 'An tura rabon kuɗinku!' : 'Your Payout Has Been Sent!'}
                      </span>
                      <span className="text-[11px] text-[#0F8A5F] font-semibold block">
                        {language === 'ha' ? 'Danna domin tabbatar da karɓa' : 'Tap to confirm receipt in your account'}
                      </span>
                    </div>
                  </div>
                  <Icon name="chevron-right" size={16} className="text-[#0F8A5F]" />
                </div>
              )}

              {/* ACTIVE POT CARD */}
              <div
                onClick={() => navigate(`/groups/${targetGroup.id}/ledger`)}
                className="bg-[#0B3D2E] rounded-[18px] p-5 text-white shadow-md cursor-pointer hover:brightness-105 transition-all"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <p className="text-[11px] font-bold tracking-wider text-[#2FBF85] uppercase">
                    {targetGroup.name} · {language === 'ha' ? 'ZANGO' : 'CYCLE'} {targetGroup.currentCycle?.number || 1} {language === 'ha' ? 'CIKIN' : 'OF'} {targetGroup.rules.size}
                  </p>
                  {targetGroup.code && (
                    <span className="text-[10px] font-mono font-bold bg-[#072A20] px-2 py-0.5 rounded text-[#2FBF85] border border-[#2FBF85]/30">
                      {targetGroup.code}
                    </span>
                  )}
                </div>

                <div className="flex items-baseline gap-2 mb-3">
                  <span className="font-heading font-extrabold text-[32px] text-white tracking-tight">
                    {formatNaira(targetGroup.wallet?.balanceThisCycle || 0)}
                  </span>
                  <span className="text-[15px] font-semibold text-[#2FBF85]">
                    of {formatNaira(targetGroup.rules.amount * targetGroup.rules.size)}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2 rounded-full bg-[#072A20] overflow-hidden mb-3">
                  <div
                    style={{
                      width: `${Math.min(
                        100,
                        Math.round(
                          ((targetGroup.currentCycle?.inThePotCount || 0) / targetGroup.rules.size) * 100
                        )
                      )}%`,
                    }}
                    className="h-full bg-[#2FBF85] rounded-full transition-all duration-500"
                  />
                </div>

                <div className="flex items-center justify-between text-[12px] text-white/80 pt-1 border-t border-white/10">
                  <span>{targetGroup.currentCycle?.inThePotCount || 0} of {targetGroup.rules.size} paid</span>
                  <span>Due: {targetGroup.rules.dueDay}</span>
                </div>
              </div>

              {/* QUICK ACTION TILES */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => navigate('/pay')}
                  className="p-3.5 rounded-[14px] bg-white border border-[#E3DDCF] flex items-center gap-3 text-left shadow-xs hover:border-[#0F8A5F] cursor-pointer transition-colors"
                >
                  <div className="w-9 h-9 rounded-full bg-[#E3F4EC] text-[#0F8A5F] flex items-center justify-center shrink-0">
                    <Icon name="wallet" size={18} strokeWidth={2.4} />
                  </div>
                  <div>
                    <span className="font-heading font-bold text-[13px] text-[#0B3D2E] block">
                      {language === 'ha' ? 'Biya Adashe' : 'Pay Contribution'}
                    </span>
                    <span className="text-[11px] text-[#4F5F57] block">
                      {formatNaira(targetGroup.rules.amount)}
                    </span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => navigate('/groups/invite')}
                  className="p-3.5 rounded-[14px] bg-white border border-[#E3DDCF] flex items-center gap-3 text-left shadow-xs hover:border-[#0F8A5F] cursor-pointer transition-colors"
                >
                  <div className="w-9 h-9 rounded-full bg-[#FAF7F0] text-[#0B3D2E] flex items-center justify-center shrink-0">
                    <Icon name="send" size={18} strokeWidth={2.4} />
                  </div>
                  <div>
                    <span className="font-heading font-bold text-[13px] text-[#0B3D2E] block">
                      {language === 'ha' ? 'Gayyaci Mamba' : 'Invite Members'}
                    </span>
                    <span className="text-[11px] text-[#4F5F57] block font-mono">
                      {targetGroup.code}
                    </span>
                  </div>
                </button>
              </div>
            </>
          )}

          {/* RECENT ACTIVITY SECTION */}
          <div className="space-y-2.5 pt-1">
            <div className="flex items-center justify-between">
              <h3 className="font-heading font-bold text-[16px] text-[#0B3D2E]">
                {t('recentActivity')}
              </h3>
              <button
                type="button"
                onClick={() => navigate('/activity')}
                className="text-[12px] font-bold text-[#0F8A5F] hover:underline cursor-pointer"
              >
                {t('seeAll')}
              </button>
            </div>

            {activity.length === 0 || activity[0]?.items.length === 0 ? (
              <div className="p-5 rounded-[16px] bg-white border border-[#E3DDCF] text-center text-[12px] text-[#4F5F57] shadow-xs">
                {language === 'ha'
                  ? 'Babu ayyuka tukuna. Biyan kuɗi da rabon kuɗi zasu bayyana anan.'
                  : 'No activity records yet. Real payments and payouts will appear here with full transparency.'}
              </div>
            ) : (
              <div className="bg-white rounded-[16px] border border-[#E3DDCF] shadow-sm divide-y divide-[#EFEAE0] overflow-hidden">
                {activity[0].items.slice(0, 3).map((item, idx) => (
                  <div key={idx} className="p-3.5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar initials={item.title.slice(0, 2).toUpperCase()} color="green" size={36} />
                      <div>
                        <span className="font-heading font-bold text-[13px] text-[#0B3D2E] block leading-tight">
                          {item.title}
                        </span>
                        <span className="text-[11px] text-[#4F5F57] block mt-0.5">
                          {item.detail}
                        </span>
                      </div>
                    </div>
                    {item.amount > 0 && (
                      <span className="font-heading font-bold text-[13px] text-[#0B3D2E]">
                        {formatNaira(item.amount)}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Fitted Bottom Navigation */}
      <BottomTabBar
        activeTab="home"
        onTabChange={(tab) => {
          if (tab === 'groups') navigate('/groups');
          else if (tab === 'pay') navigate('/pay');
          else if (tab === 'activity') navigate('/activity');
          else if (tab === 'profile') navigate('/profile');
        }}
      />
    </div>
  );
};
