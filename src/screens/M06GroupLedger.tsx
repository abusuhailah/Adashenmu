import React from 'react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../i18n/LanguageContext';
import { StatusBar } from '../components/common/StatusBar';
import { TopBar } from '../components/common/TopBar';
import { Avatar } from '../components/common/Avatar';
import { MoneyStateBadge } from '../components/common/MoneyStateBadge';
import { MoneyStatesSheet } from '../components/common/MoneyStatesSheet';
import { TurnChip } from '../components/common/TurnChip';
import { Icon } from '../components/common/Icon';
import { formatNaira } from '../data/types';

interface PayoutTurnRow {
  turn: number;
  name: string;
  date: string;
  status: 'collected' | 'next' | 'yourTurn' | 'upcoming';
  isYou?: boolean;
}

const payoutTurns: PayoutTurnRow[] = [
  { turn: 1, name: 'Zainab Musa', date: 'Fri 31 Jul', status: 'collected' },
  { turn: 2, name: 'Aisha Bello', date: 'Mon 31 Aug', status: 'collected' },
  { turn: 3, name: 'Fatima Yusuf', date: 'Wed 30 Sep', status: 'collected' },
  { turn: 4, name: 'Hadiza Lawal', date: 'Sat 31 Oct', status: 'next' },
  { turn: 5, name: 'Hauwa Ibrahim', date: 'Mon 30 Nov', status: 'yourTurn', isYou: true },
  { turn: 6, name: 'Maryam Sani', date: 'Thu 31 Dec', status: 'upcoming' },
  { turn: 7, name: 'Rukayya Adamu', date: 'Sun 31 Jan 2027', status: 'upcoming' },
  { turn: 8, name: 'Halima Garba', date: 'Sun 28 Feb 2027', status: 'upcoming' },
  { turn: 9, name: 'Safiya Umar', date: 'Wed 31 Mar 2027', status: 'upcoming' },
  { turn: 10, name: 'Amina Danjuma', date: 'Fri 30 Apr 2027', status: 'upcoming' },
];

export const M06GroupLedger: React.FC = () => {
  const {
    navigate,
    userContributionState,
    potTotal,
    potConfirmedCount,
    userPaidAmount,
    userRemainingBalance,
    isStatesSheetOpen,
    setStatesSheetOpen,
    groupActiveTab,
    setGroupActiveTab,
  } = useApp();
  const { t } = useLanguage();

  const confirmingCount = userContributionState === 'confirming' ? 2 : 1;
  const pendingCount = userContributionState === 'inThePot' ? 1 : userContributionState === 'confirming' ? 1 : 2;

  // Split bar calculations (total 10 members)
  const inPotPercent = (potConfirmedCount / 10) * 100;
  const confirmingPercent = (confirmingCount / 10) * 100;
  const pendingPercent = (pendingCount / 10) * 100;

  return (
    <div className="flex-1 bg-[#FAF7F0] flex flex-col justify-between overflow-hidden">
      <div className="flex-1 overflow-y-auto hide-scrollbar">
        <StatusBar mode="light" />
        <TopBar
          title="Kasuwa Atamfa Adashe"
          onBack={() => navigate('/home')}
          showBack={true}
        />

        {/* Segmented control tabs */}
        <div className="px-5 py-2">
          <div className="h-10 p-1 rounded-full bg-[#EFEAE0] flex items-center justify-between text-[13px] font-semibold text-[#4F5F57]">
            <button
              type="button"
              onClick={() => {
                setGroupActiveTab('ledger');
                navigate('/groups/g-kasuwa-atamfa/ledger');
              }}
              className={`flex-1 h-full rounded-full transition-all cursor-pointer ${
                groupActiveTab === 'ledger'
                  ? 'bg-white text-[#0B3D2E] shadow-sm font-bold'
                  : 'hover:text-[#0B3D2E]'
              }`}
            >
              {t('ledger')}
            </button>
            <button
              type="button"
              onClick={() => {
                setGroupActiveTab('calendar');
                navigate('/groups/g-kasuwa-atamfa/calendar');
              }}
              className={`flex-1 h-full rounded-full transition-all cursor-pointer ${
                groupActiveTab === 'calendar'
                  ? 'bg-white text-[#0B3D2E] shadow-sm font-bold'
                  : 'hover:text-[#0B3D2E]'
              }`}
            >
              {t('payoutCalendar')}
            </button>
            <button
              type="button"
              onClick={() => {
                setGroupActiveTab('rules');
                navigate('/groups/g-kasuwa-atamfa/rules');
              }}
              className={`flex-1 h-full rounded-full transition-all cursor-pointer ${
                groupActiveTab === 'rules'
                  ? 'bg-white text-[#0B3D2E] shadow-sm font-bold'
                  : 'hover:text-[#0B3D2E]'
              }`}
            >
              {t('rules')}
            </button>
          </div>
        </div>

        {/* VIEW 1: RULES VIEW */}
        {groupActiveTab === 'rules' && (
          <div className="px-5 py-3 space-y-4">
            <div className="bg-white rounded-[16px] p-5 border border-[#E3DDCF] shadow-sm space-y-4">
              <h3 className="font-heading font-bold text-[18px] text-[#0B3D2E] pb-2 border-b border-[#EFEAE0]">
                {t('agreedRulesTitle')}
              </h3>

              <div className="space-y-3 text-[14px]">
                <div className="flex justify-between py-1.5 border-b border-[#EFEAE0]">
                  <span className="text-[#4F5F57]">{t('ruleContribution')}</span>
                  <span className="font-semibold text-[#0B3D2E]">₦20,000 {t('monthly').toLowerCase()}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-[#EFEAE0]">
                  <span className="text-[#4F5F57]">{t('ruleDueDay')}</span>
                  <span className="font-semibold text-[#0B3D2E]">28th</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-[#EFEAE0]">
                  <span className="text-[#4F5F57]">{t('ruleGroupSize')}</span>
                  <span className="font-semibold text-[#0B3D2E]">10</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-[#EFEAE0]">
                  <span className="text-[#4F5F57]">{t('ruleTotalPayout')}</span>
                  <span className="font-semibold text-[#0F8A5F]">₦200,000</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-[#EFEAE0]">
                  <span className="text-[#4F5F57]">{t('rulePayoutOrder')}</span>
                  <span className="font-semibold text-[#0B3D2E]">{t('drawAtStart')}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-[#EFEAE0]">
                  <span className="text-[#4F5F57]">{t('ruleLatePayment')}</span>
                  <span className="font-semibold text-[#B42318]">2 days grace, then ₦1,000 fee</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-[#4F5F57]">{t('ruleChangesRequire')}</span>
                  <span className="font-semibold text-[#0B3D2E]">{t('unanimousVote')}</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setGroupActiveTab('ledger');
                navigate('/groups/g-kasuwa-atamfa/ledger');
              }}
              className="w-full h-[48px] rounded-[14px] bg-white border border-[#E3DDCF] font-semibold text-[#0B3D2E] text-[14px] cursor-pointer"
            >
              {t('backToLedger')}
            </button>
          </div>
        )}

        {/* VIEW 2: PAYOUT CALENDAR VIEW */}
        {groupActiveTab === 'calendar' && (
          <div className="px-5 space-y-3.5 pb-6 pt-1">
            {/* Note with shuffle icon */}
            <div className="p-3.5 rounded-[14px] bg-white border border-[#E3DDCF] flex items-start gap-2.5 shadow-sm">
              <div className="text-[#0F8A5F] mt-0.5 shrink-0">
                <Icon name="shuffle" size={17} strokeWidth={2.2} />
              </div>
              <p className="text-[13px] text-[#0B3D2E] leading-snug">
                {t('orderDrawnNote')}
              </p>
            </div>

            {/* List of 10 turns */}
            <div className="bg-white rounded-[16px] border border-[#E3DDCF] shadow-sm overflow-hidden divide-y divide-[#EFEAE0]">
              {payoutTurns.map((item) => {
                const isCollected = item.status === 'collected';
                const isNext = item.status === 'next';
                const isYourTurn = item.status === 'yourTurn';

                return (
                  <div
                    key={item.turn}
                    className={`p-3.5 flex items-center justify-between transition-colors ${
                      isYourTurn ? 'bg-[#FFF4DB]/80 border-l-4 border-l-[#F2B33D]' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {/* Turn number badge */}
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-bold shrink-0 ${
                          isYourTurn
                            ? 'bg-[#F2B33D] text-[#0B3D2E]'
                            : isNext
                            ? 'bg-[#E3F4EC] text-[#0B6E4B]'
                            : isCollected
                            ? 'bg-[#EEF0EE] text-[#8A968F]'
                            : 'bg-[#FAF7F0] text-[#4F5F57] border border-[#E3DDCF]'
                        }`}
                      >
                        {item.turn}
                      </div>

                      <div>
                        <span
                          className={`text-[14px] block leading-tight ${
                            isYourTurn
                              ? 'font-bold text-[#0B3D2E]'
                              : isCollected
                              ? 'font-medium text-[#8A968F]'
                              : 'font-semibold text-[#0B3D2E]'
                          }`}
                        >
                          {item.isYou ? `${item.name} ${t('you')}` : item.name}
                        </span>
                        <span
                          className={`text-[12px] block mt-0.5 ${
                            isCollected ? 'text-[#8A968F]' : 'text-[#4F5F57]'
                          }`}
                        >
                          {item.date} · ₦200,000
                        </span>
                      </div>
                    </div>

                    <TurnChip status={item.status} />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* VIEW 3: LEDGER VIEW */}
        {groupActiveTab === 'ledger' && (
          <div className="px-5 space-y-4 pb-6 pt-1">
            {/* Summary card */}
            <div className="bg-white rounded-[16px] p-4.5 border border-[#E3DDCF] shadow-sm">
              <div className="flex items-center justify-between text-[12px] text-[#4F5F57] mb-1 font-medium">
                <span>{t('cycleOctober')}</span>
                <span className="font-semibold text-[#0B3D2E]">₦20,000 {t('each')}</span>
              </div>

              <div className="flex items-baseline gap-2 mb-3">
                <span className="font-heading font-extrabold text-[26px] text-[#0B3D2E]">
                  {formatNaira(potTotal)}
                </span>
                <span className="text-[14px] font-semibold text-[#4F5F57]">
                  {t('inThePotOf')} ₦200,000
                </span>
              </div>

              {/* Split Bar (3px gaps): inThePot (primary), confirming (onDark), pending (accent) */}
              <div className="w-full h-2.5 rounded-full flex gap-[3px] overflow-hidden mb-2.5 bg-[#EFEAE0]">
                {inPotPercent > 0 && (
                  <div
                    style={{ width: `${inPotPercent}%` }}
                    className="h-full bg-[#0F8A5F] rounded-l-full transition-all duration-500"
                  />
                )}
                {confirmingPercent > 0 && (
                  <div
                    style={{ width: `${confirmingPercent}%` }}
                    className="h-full bg-[#2FBF85] transition-all duration-500"
                  />
                )}
                {pendingPercent > 0 && (
                  <div
                    style={{ width: `${pendingPercent}%` }}
                    className="h-full bg-[#F2B33D] rounded-r-full transition-all duration-500"
                  />
                )}
              </div>

              {/* Legend dots */}
              <div className="flex items-center gap-3.5 text-[11px] font-medium text-[#4F5F57] mb-3">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#0F8A5F]" />
                  <span>{potConfirmedCount} {t('inThePot')}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#2FBF85]" />
                  <span>{confirmingCount} {t('confirming')}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#F2B33D]" />
                  <span>{pendingCount} {t('pending')}</span>
                </div>
              </div>

              {/* Link: What do these states mean? */}
              <button
                type="button"
                onClick={() => setStatesSheetOpen(true)}
                className="flex items-center gap-1.5 text-[12px] font-semibold text-[#0B6E4B] hover:underline cursor-pointer pt-1"
              >
                <Icon name="info" size={15} />
                <span>{t('whatDoStatesMean')}</span>
              </button>
            </div>

            {/* Members card with full ledger order */}
            <div className="bg-white rounded-[16px] border border-[#E3DDCF] shadow-sm overflow-hidden">
              <div className="px-4 py-3 bg-[#FAF7F0] border-b border-[#E3DDCF] flex items-center justify-between text-[12px] font-semibold text-[#4F5F57]">
                <span>{t('member')}</span>
                <span>{t('status')}</span>
              </div>

              <div className="divide-y divide-[#EFEAE0]">
                {/* 1. Hauwa Ibrahim (you) */}
                <div className="p-3.5 flex items-center justify-between bg-[#FAF7F0]/30">
                  <div className="flex items-center gap-3">
                    <Avatar initials="HI" color="clay" size={38} />
                    <div>
                      <span className="text-[14px] font-semibold text-[#0B3D2E] block leading-tight">
                        Hauwa Ibrahim {t('you')}
                      </span>
                      <span className="text-[12px] text-[#4F5F57] block mt-0.5">
                        {userContributionState === 'inThePot'
                          ? 'Paid ₦20,000 · Mon 26 Oct'
                          : userPaidAmount > 0
                          ? `₦${userPaidAmount.toLocaleString()} paid · ₦${userRemainingBalance.toLocaleString()} ${t('remaining')}`
                          : 'Due Wed 28 Oct'}
                      </span>
                    </div>
                  </div>
                  <MoneyStateBadge state={userContributionState} />
                </div>

                {/* 2. Safiya Umar */}
                <div className="p-3.5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar initials="SU" color="gold" size={38} />
                    <div>
                      <span className="text-[14px] font-semibold text-[#0B3D2E] block leading-tight">
                        Safiya Umar
                      </span>
                      <span className="text-[12px] text-[#4F5F57] block mt-0.5">
                        Due Wed 28 Oct
                      </span>
                    </div>
                  </div>
                  <MoneyStateBadge state="pending" />
                </div>

                {/* 3. Rukayya Adamu */}
                <div className="p-3.5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar initials="RA" color="blue" size={38} />
                    <div>
                      <span className="text-[14px] font-semibold text-[#0B3D2E] block leading-tight">
                        Rukayya Adamu
                      </span>
                      <span className="text-[12px] text-[#4F5F57] block mt-0.5">
                        {t('todayTime')} · {t('bankConfirming')}
                      </span>
                    </div>
                  </div>
                  <MoneyStateBadge state="confirming" />
                </div>

                {/* 4. Amina Danjuma */}
                <div className="p-3.5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar initials="AD" color="green" size={38} />
                    <div>
                      <span className="text-[14px] font-semibold text-[#0B3D2E] block leading-tight">
                        Amina Danjuma
                      </span>
                      <span className="text-[12px] text-[#4F5F57] block mt-0.5">
                        Sun 25 Oct
                      </span>
                    </div>
                  </div>
                  <MoneyStateBadge state="inThePot" />
                </div>

                {/* 5. Halima Garba */}
                <div className="p-3.5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar initials="HG" color="grey" size={38} />
                    <div>
                      <span className="text-[14px] font-semibold text-[#0B3D2E] block leading-tight">
                        Halima Garba
                      </span>
                      <span className="text-[12px] text-[#4F5F57] block mt-0.5">
                        Sun 25 Oct
                      </span>
                    </div>
                  </div>
                  <MoneyStateBadge state="inThePot" />
                </div>

                {/* 6. Maryam Sani */}
                <div className="p-3.5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar initials="MS" color="green" size={38} />
                    <div>
                      <span className="text-[14px] font-semibold text-[#0B3D2E] block leading-tight">
                        Maryam Sani
                      </span>
                      <span className="text-[12px] text-[#4F5F57] block mt-0.5">
                        Sun 25 Oct
                      </span>
                    </div>
                  </div>
                  <MoneyStateBadge state="inThePot" />
                </div>

                {/* 7. Hadiza Lawal */}
                <div className="p-3.5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar initials="HL" color="gold" size={38} />
                    <div>
                      <span className="text-[14px] font-semibold text-[#0B3D2E] block leading-tight">
                        Hadiza Lawal
                      </span>
                      <span className="text-[12px] text-[#4F5F57] block mt-0.5">
                        Fri 23 Oct
                      </span>
                    </div>
                  </div>
                  <MoneyStateBadge state="inThePot" />
                </div>

                {/* 8. Fatima Yusuf */}
                <div className="p-3.5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar initials="FY" color="blue" size={38} />
                    <div>
                      <span className="text-[14px] font-semibold text-[#0B3D2E] block leading-tight">
                        Fatima Yusuf
                      </span>
                      <span className="text-[12px] text-[#4F5F57] block mt-0.5">
                        Thu 22 Oct
                      </span>
                    </div>
                  </div>
                  <MoneyStateBadge state="inThePot" />
                </div>

                {/* 9. Aisha Bello */}
                <div className="p-3.5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar initials="AB" color="clay" size={38} />
                    <div>
                      <span className="text-[14px] font-semibold text-[#0B3D2E] block leading-tight">
                        Aisha Bello
                      </span>
                      <span className="text-[12px] text-[#4F5F57] block mt-0.5">
                        Thu 22 Oct
                      </span>
                    </div>
                  </div>
                  <MoneyStateBadge state="inThePot" />
                </div>

                {/* 10. Zainab Musa */}
                <div className="p-3.5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar initials="ZM" color="green" size={38} />
                    <div>
                      <span className="text-[14px] font-semibold text-[#0B3D2E] block leading-tight">
                        Zainab Musa
                      </span>
                      <span className="text-[12px] text-[#4F5F57] block mt-0.5">
                        Wed 21 Oct
                      </span>
                    </div>
                  </div>
                  <MoneyStateBadge state="inThePot" />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Money States Bottom Sheet */}
      <MoneyStatesSheet
        isOpen={isStatesSheetOpen}
        onClose={() => setStatesSheetOpen(false)}
      />
    </div>
  );
};
