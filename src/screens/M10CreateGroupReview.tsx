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

  const isBankDetailsValid =
    !!createGroupDraft.organiserAccount?.bankName &&
    !!createGroupDraft.organiserAccount?.accountNumber &&
    createGroupDraft.organiserAccount.accountNumber.length === 10 &&
    !!createGroupDraft.organiserAccount?.accountName?.trim();

  const canCreate = createGroupDraft.agreedToRules && isBankDetailsValid;

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

          {/* Organiser Receiving Bank Account */}
          <div className="bg-white rounded-[16px] p-4.5 border border-[#E3DDCF] shadow-sm space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-[#E3F4EC] text-[#0F8A5F] flex items-center justify-center shrink-0">
                <Icon name="bank" size={18} strokeWidth={2.2} />
              </div>
              <div>
                <h4 className="font-heading font-bold text-[15px] text-[#0B3D2E]">
                  Your Receiving Bank Account
                </h4>
                <p className="text-[12px] text-[#4F5F57]">
                  Members will transfer their contributions to this account and upload proof.
                </p>
              </div>
            </div>

            <div className="space-y-2.5 pt-1">
              <div>
                <label className="block text-[12px] font-semibold text-[#4F5F57] mb-1">
                  Bank Name
                </label>
                <select
                  value={createGroupDraft.organiserAccount?.bankName || ''}
                  onChange={(e) =>
                    updateCreateGroupDraft({
                      organiserAccount: {
                        bankName: e.target.value,
                        accountNumber: createGroupDraft.organiserAccount?.accountNumber || '',
                        accountName: createGroupDraft.organiserAccount?.accountName || '',
                      },
                    })
                  }
                  className="w-full h-[46px] px-3.5 rounded-[10px] bg-[#FAF7F0] border border-[#E3DDCF] text-[14px] text-[#0B3D2E] font-medium focus:border-[#0F8A5F] focus:outline-none"
                >
                  <option value="">-- Select Receiving Bank --</option>
                  <option value="Guaranty Trust Bank (GTBank)">Guaranty Trust Bank (GTBank)</option>
                  <option value="Zenith Bank">Zenith Bank</option>
                  <option value="Access Bank">Access Bank</option>
                  <option value="First Bank of Nigeria">First Bank of Nigeria</option>
                  <option value="United Bank for Africa (UBA)">United Bank for Africa (UBA)</option>
                  <option value="Kuda Microfinance Bank">Kuda Microfinance Bank</option>
                  <option value="OPay">OPay</option>
                  <option value="Moniepoint MFB">Moniepoint MFB</option>
                  <option value="Stanbic IBTC Bank">Stanbic IBTC Bank</option>
                  <option value="Jaiz Bank">Jaiz Bank</option>
                  <option value="Taj Bank">Taj Bank</option>
                  <option value="Fidelity Bank">Fidelity Bank</option>
                  <option value="Union Bank">Union Bank</option>
                  <option value="Wema Bank">Wema Bank</option>
                  <option value="Palmpay">Palmpay</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[12px] font-semibold text-[#4F5F57] mb-1">
                    Account Number
                  </label>
                  <input
                    type="text"
                    maxLength={10}
                    placeholder="10-digit number"
                    value={createGroupDraft.organiserAccount?.accountNumber || ''}
                    onChange={(e) =>
                      updateCreateGroupDraft({
                        organiserAccount: {
                          bankName: createGroupDraft.organiserAccount?.bankName || '',
                          accountNumber: e.target.value.replace(/\D/g, ''),
                          accountName: createGroupDraft.organiserAccount?.accountName || '',
                        },
                      })
                    }
                    className="w-full h-[46px] px-3 rounded-[10px] bg-[#FAF7F0] border border-[#E3DDCF] font-mono text-[14px] text-[#0B3D2E] font-bold focus:border-[#0F8A5F] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-[#4F5F57] mb-1">
                    Account Name
                  </label>
                  <input
                    type="text"
                    placeholder="Account Name"
                    value={createGroupDraft.organiserAccount?.accountName || ''}
                    onChange={(e) =>
                      updateCreateGroupDraft({
                        organiserAccount: {
                          bankName: createGroupDraft.organiserAccount?.bankName || '',
                          accountNumber: createGroupDraft.organiserAccount?.accountNumber || '',
                          accountName: e.target.value,
                        },
                      })
                    }
                    className="w-full h-[46px] px-3 rounded-[10px] bg-[#FAF7F0] border border-[#E3DDCF] text-[13px] text-[#0B3D2E] font-medium focus:border-[#0F8A5F] focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Dark trust banner */}
          <div className="p-4.5 rounded-[16px] bg-[#0B3D2E] text-white border border-[#2FBF85]/20 shadow-md flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-full bg-[#072A20] text-[#2FBF85] flex items-center justify-center shrink-0">
              <Icon name="bank" size={20} strokeWidth={2.2} />
            </div>
            <div>
              <h4 className="font-heading font-bold text-[14px] text-white">
                Live Transparency & Payment Verification
              </h4>
              <p className="text-[12px] text-white/80 mt-1 leading-relaxed">
                When members transfer contributions, they upload proof of payment. You will confirm each payment before the pot updates and payouts are released.
              </p>
            </div>
          </div>

          {/* Bank validation warning if incomplete */}
          {!isBankDetailsValid && (
            <p className="text-[12px] text-[#B42318] font-semibold bg-[#FDECEA] p-2.5 rounded-[10px] border border-[#B42318]/20">
              Please enter your receiving bank name, 10-digit account number, and account name above to proceed.
            </p>
          )}

          {/* Checkbox confirmation */}
          <label className="flex items-start gap-3 pt-1 cursor-pointer select-none">
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
          disabled={!canCreate || isSubmitting}
          onClick={handleCreate}
          className="w-full h-[52px] rounded-[14px] bg-[#0F8A5F] active:bg-[#0B6E4B] text-white font-heading font-bold text-[16px] flex items-center justify-center cursor-pointer shadow-sm hover:brightness-105 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Creating group…' : 'Create group'}
        </button>
      </div>
    </div>
  );
};
