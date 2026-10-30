import React from 'react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../i18n/LanguageContext';
import { StatusBar } from '../components/common/StatusBar';
import { TopBar } from '../components/common/TopBar';
import { TurnChip } from '../components/common/TurnChip';
import { Icon } from '../components/common/Icon';

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

export const M07PayoutCalendar: React.FC = () => {
  const { navigate, groupActiveTab, setGroupActiveTab } = useApp();
  const { t } = useLanguage();

  return (
    <div className="flex-1 bg-[#FAF7F0] flex flex-col justify-between overflow-hidden">
      <div className="flex-1 overflow-y-auto hide-scrollbar">
        <StatusBar mode="light" />
        <TopBar
          title="Kasuwa Atamfa Adashe"
          onBack={() => {
            setGroupActiveTab('ledger');
            navigate('/groups/g-kasuwa-atamfa/ledger');
          }}
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

        {/* If Rules tab is selected, render rules */}
        {groupActiveTab === 'rules' ? (
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
        ) : (
          /* Calendar view */
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
      </div>
    </div>
  );
};
