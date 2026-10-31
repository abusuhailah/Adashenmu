import React from 'react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../i18n/LanguageContext';
import { StatusBar } from '../components/common/StatusBar';
import { TopBar } from '../components/common/TopBar';
import { Icon } from '../components/common/Icon';
import { formatNaira } from '../data/types';

export const M07PayoutCalendar: React.FC = () => {
  const { navigate, activeGroup, groups, groupActiveTab, setGroupActiveTab } = useApp();
  const { language, t } = useLanguage();

  const targetGroup = activeGroup || groups[0] || null;

  if (!targetGroup) {
    return (
      <div className="flex-1 bg-[#FAF7F0] flex flex-col justify-between overflow-y-auto">
        <StatusBar mode="light" />
        <TopBar title={t('payoutCalendar')} onBack={() => navigate('/groups')} showBack={true} />
        <div className="p-6 text-center space-y-4 my-auto">
          <h3 className="font-heading font-bold text-[18px] text-[#0B3D2E]">
            {language === 'ha' ? 'Ba a sami ƙungiya ba' : 'No Group Selected'}
          </h3>
          <button
            type="button"
            onClick={() => navigate('/groups')}
            className="px-6 py-2.5 rounded-[12px] bg-[#0F8A5F] text-white font-bold text-[14px]"
          >
            {language === 'ha' ? 'Duba Ƙungiyoyi' : 'View My Groups'}
          </button>
        </div>
      </div>
    );
  }

  const cycle = targetGroup.currentCycle || {
    number: 1,
    of: targetGroup.rules.size,
    month: 'Cycle 1',
    dueDate: targetGroup.rules.dueDay,
    payoutDate: targetGroup.rules.startDate || '',
    payoutTo: targetGroup.members?.[0]?.name || 'Organiser',
  };

  const payoutCalendar = targetGroup.payoutCalendar || [];

  return (
    <div className="flex-1 bg-[#FAF7F0] flex flex-col justify-between overflow-hidden">
      <div className="flex-1 overflow-y-auto hide-scrollbar">
        <StatusBar mode="light" />
        <TopBar
          title={targetGroup.name}
          onBack={() => {
            setGroupActiveTab('ledger');
            navigate(`/groups/${targetGroup.id}/ledger`);
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
                navigate(`/groups/${targetGroup.id}/ledger`);
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
                navigate(`/groups/${targetGroup.id}/calendar`);
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
                navigate(`/groups/${targetGroup.id}/rules`);
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

        {/* Calendar View */}
        <div className="px-5 space-y-3.5 pb-6 pt-1">
          <div className="p-3.5 rounded-[14px] bg-white border border-[#E3DDCF] flex items-start gap-2.5 shadow-sm">
            <Icon name="shuffle" size={17} className="text-[#0F8A5F] mt-0.5 shrink-0" strokeWidth={2.2} />
            <p className="text-[13px] text-[#0B3D2E] leading-snug">
              {language === 'ha'
                ? `Tsarin rabo mai gaskiya na mambobi ${targetGroup.rules.size}. Mai shirya zai tura rabo akan lokaci.`
                : `Transparent rotation order for ${targetGroup.rules.size} members. The organiser transfers each payout when the cycle completes.`}
            </p>
          </div>

          {/* List of Turns */}
          <div className="bg-white rounded-[16px] border border-[#E3DDCF] shadow-sm overflow-hidden divide-y divide-[#EFEAE0]">
            {payoutCalendar.map((tRow) => {
              const isCurrentTurn = tRow.turn === cycle.number;
              const isCollected = tRow.status === 'collected';
              const isPendingConf = tRow.status === 'pending_member_confirmation';

              return (
                <div key={tRow.turn} className="p-3.5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-mono font-bold text-[13px] ${
                        isCollected
                          ? 'bg-[#E3F4EC] text-[#0F8A5F]'
                          : isCurrentTurn
                          ? 'bg-[#0F8A5F] text-white shadow-sm'
                          : 'bg-[#FAF7F0] text-[#4F5F57] border border-[#E3DDCF]'
                      }`}
                    >
                      {tRow.turn}
                    </div>

                    <div>
                      <span className="font-heading font-bold text-[14px] text-[#0B3D2E] block">
                        {tRow.memberName || `Turn #${tRow.turn}`}
                      </span>
                      <span className="text-[12px] text-[#4F5F57] block mt-0.5">
                        {tRow.date} · {formatNaira(tRow.amount)}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    {isCollected ? (
                      <span className="text-[11px] font-bold text-[#0B6E4B] bg-[#E3F4EC] px-2 py-0.5 rounded-full">
                        Collected
                      </span>
                    ) : isPendingConf ? (
                      <span className="text-[11px] font-bold text-[#8A5A00] bg-[#FFF4DB] px-2 py-0.5 rounded-full">
                        Awaiting Conf.
                      </span>
                    ) : isCurrentTurn ? (
                      <span className="text-[11px] font-bold text-white bg-[#0F8A5F] px-2.5 py-0.5 rounded-full shadow-xs">
                        Current Turn
                      </span>
                    ) : (
                      <span className="text-[11px] font-medium text-[#8A968F]">
                        Upcoming
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
