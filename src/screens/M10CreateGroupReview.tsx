import React from 'react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../i18n/LanguageContext';
import { StatusBar } from '../components/common/StatusBar';
import { TopBar } from '../components/common/TopBar';
import { Icon } from '../components/common/Icon';
import { formatNaira } from '../data/types';

export const M10CreateGroupReview: React.FC = () => {
  const { navigate, createGroupDraft, updateCreateGroupDraft, commitNewGroup } = useApp();
  const { t } = useLanguage();

  const payoutTotal = createGroupDraft.amount * createGroupDraft.size;

  const getPayoutOrderText = () => {
    if (createGroupDraft.payoutOrder === 'fixed') return t('fixedOrder');
    if (createGroupDraft.payoutOrder === 'vote') return t('groupVote');
    return t('drawAtStart');
  };

  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleCreate = async () => {
    setIsSubmitting(true);
    try {
      await commitNewGroup();
      navigate('/groups/invite');
    } catch {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 bg-[#FAF7F0] flex flex-col justify-between overflow-y-auto hide-scrollbar">
      <div>
        <StatusBar mode="light" />
        <TopBar
          title={t('createNewGroup')}
          onBack={() => navigate('/groups/new/order')}
          showBack={true}
        />

        {/* Stepper bar */}
        <div className="px-5 pt-1 pb-3 flex items-center justify-between">
          <div className="flex-1 flex gap-1.5 mr-3">
            <div className="h-1 flex-1 rounded-full bg-[#0F8A5F]" />
            <div className="h-1 flex-1 rounded-full bg-[#0F8A5F]" />
            <div className="h-1 flex-1 rounded-full bg-[#0F8A5F]" />
          </div>
          <span className="text-[12px] font-medium text-[#4F5F57] whitespace-nowrap">
            {t('step3Review')}
          </span>
        </div>

        <div className="px-5 pt-2 pb-6 space-y-4">
          <h2 className="font-heading font-bold text-[20px] text-[#0B3D2E] leading-tight">
            {t('checkTheRules')}
          </h2>

          {/* Key-value summary card */}
          <div className="bg-white rounded-[16px] p-4.5 border border-[#E3DDCF] shadow-sm divide-y divide-[#EFEAE0] text-[14px]">
            <div className="flex items-center justify-between py-2">
              <span className="text-[#4F5F57]">Group</span>
              <span className="font-semibold text-[#0B3D2E] text-right">
                {createGroupDraft.name}
              </span>
            </div>

            <div className="flex items-center justify-between py-2">
              <span className="text-[#4F5F57]">Each member pays</span>
              <span className="font-semibold text-[#0B3D2E] text-right">
                {formatNaira(createGroupDraft.amount)} · {createGroupDraft.dueDay}
              </span>
            </div>

            <div className="flex items-center justify-between py-2">
              <span className="text-[#4F5F57]">Members</span>
              <span className="font-semibold text-[#0B3D2E] text-right">
                {createGroupDraft.size}, including you
              </span>
            </div>

            <div className="flex items-center justify-between py-2">
              <span className="text-[#4F5F57]">Each payout</span>
              <span className="font-heading font-bold text-[#0F8A5F] text-right">
                {formatNaira(payoutTotal)}
              </span>
            </div>

            <div className="flex items-center justify-between py-2">
              <span className="text-[#4F5F57]">Payout order</span>
              <span className="font-semibold text-[#0B3D2E] text-right">
                {getPayoutOrderText()}
              </span>
            </div>

            <div className="flex items-center justify-between py-2">
              <span className="text-[#4F5F57]">If late</span>
              <span className="font-semibold text-[#B42318] text-right">
                {createGroupDraft.lateGraceDays}-day grace, then {formatNaira(createGroupDraft.lateFee)} fee
              </span>
            </div>

            <div className="flex items-center justify-between py-2">
              <span className="text-[#4F5F57]">Dates</span>
              <span className="font-semibold text-[#0B3D2E] text-right">
                {createGroupDraft.startDate} to {createGroupDraft.endDate}
              </span>
            </div>
          </div>

          {/* Dark wallet card */}
          <div className="p-4.5 rounded-[16px] bg-[#0B3D2E] text-white border border-[#2FBF85]/20 shadow-md flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-full bg-[#072A20] text-[#2FBF85] flex items-center justify-center shrink-0">
              <Icon name="bank" size={20} strokeWidth={2.2} />
            </div>
            <div>
              <h4 className="font-heading font-bold text-[14px] text-white">
                Group wallet at a licensed partner bank
              </h4>
              <p className="text-[12px] text-white/80 mt-1 leading-relaxed">
                Payments go straight into the group wallet. The app releases each payout on its date. No member, including you, can withdraw it.
              </p>
            </div>
          </div>

          {/* Checkbox confirmation */}
          <label className="flex items-start gap-3 pt-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={createGroupDraft.agreedToRules}
              onChange={(e) => updateCreateGroupDraft({ agreedToRules: e.target.checked })}
              className="w-5 h-5 rounded-[6px] text-[#0F8A5F] accent-[#0F8A5F] focus:ring-[#0F8A5F] shrink-0 mt-0.5 cursor-pointer"
            />
            <span className="text-[13px] text-[#0B3D2E] font-medium leading-snug">
              I agree to these rules. Any change later needs a group vote.
            </span>
          </label>
        </div>
      </div>

      {/* Footer */}
      <div className="p-5 pt-3 pb-8 bg-white border-t border-[#E3DDCF]">
        <button
          type="button"
          disabled={!createGroupDraft.agreedToRules}
          onClick={handleCreate}
          className="w-full h-[52px] rounded-[14px] bg-[#0F8A5F] active:bg-[#0B6E4B] text-white font-heading font-bold text-[16px] flex items-center justify-center cursor-pointer shadow-sm hover:brightness-105 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Create group
        </button>
      </div>
    </div>
  );
};
