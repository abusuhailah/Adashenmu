import React from 'react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { Icon } from './Icon';

interface RoleSelectionModalProps {
  isOpen: boolean;
  onClose?: () => void;
}

export const RoleSelectionModal: React.FC<RoleSelectionModalProps> = ({ isOpen, onClose }) => {
  const { setUserRole, userRole } = useApp();
  const { language } = useLanguage();

  if (!isOpen) return null;

  const handleSelect = (role: 'organizer' | 'member') => {
    setUserRole(role);
    if (onClose) onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div
        className="w-full max-w-[420px] bg-white rounded-[24px] p-6 shadow-2xl border border-[#E3DDCF] space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="text-center space-y-1.5 pb-1">
          <div className="w-12 h-12 rounded-full bg-[#E3F4EC] text-[#0F8A5F] flex items-center justify-center mx-auto mb-2">
            <Icon name="users" size={24} strokeWidth={2.4} />
          </div>
          <h2 className="font-heading font-extrabold text-[20px] text-[#0B3D2E]">
            {language === 'ha'
              ? 'Wace rawa kuke son takawa?'
              : 'Choose Your Primary Role'}
          </h2>
          <p className="text-[13px] text-[#4F5F57] leading-snug">
            {language === 'ha'
              ? 'Zaɓi yadda kuke son amfani da Adashenmu. Kuna iya sauyawa a kowane lokaci a shafin ku.'
              : 'Select how you want to get started. You can switch roles or create groups anytime from your profile.'}
          </p>
        </div>

        {/* Options */}
        <div className="space-y-3 pt-1">
          {/* Option 1: Group Organiser */}
          <div
            onClick={() => handleSelect('organizer')}
            className={`p-4 rounded-[18px] border-2 cursor-pointer transition-all hover:scale-[1.01] active:scale-[0.99] flex items-start gap-3.5 ${
              userRole === 'organizer'
                ? 'bg-[#E3F4EC] border-[#0F8A5F] shadow-sm'
                : 'bg-white border-[#E3DDCF] hover:border-[#0F8A5F]/50'
            }`}
          >
            <div className="w-11 h-11 rounded-[14px] bg-[#0F8A5F] text-white flex items-center justify-center shrink-0 shadow-xs">
              <Icon name="pot" size={22} strokeWidth={2.2} />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="font-heading font-bold text-[16px] text-[#0B3D2E]">
                  {language === 'ha' ? 'Mai Shirya Ƙungiya' : 'Group Organiser'}
                </span>
                <span className="text-[10px] font-bold bg-[#E3F4EC] text-[#0B6E4B] px-2 py-0.5 rounded-full border border-[#0F8A5F]/20">
                  {language === 'ha' ? 'Ƙirƙira & Gudanarwa' : 'Create & Manage'}
                </span>
              </div>
              <p className="text-[12px] text-[#4F5F57] mt-1 leading-relaxed">
                {language === 'ha'
                  ? 'Ƙirƙiri ƙungiyar adashe, saita ranakun rabo, saka asusun bankin karɓar kuɗi, tabbatar da biyan mambobi, da fitar da kuɗin rabo.'
                  : 'Create groups, set rotation schedules, enter receiving bank details for contributions, verify payment receipts, and disburse payouts.'}
              </p>
            </div>
          </div>

          {/* Option 2: Group Member */}
          <div
            onClick={() => handleSelect('member')}
            className={`p-4 rounded-[18px] border-2 cursor-pointer transition-all hover:scale-[1.01] active:scale-[0.99] flex items-start gap-3.5 ${
              userRole === 'member'
                ? 'bg-[#EBF3FB] border-[#1E5D88] shadow-sm'
                : 'bg-white border-[#E3DDCF] hover:border-[#1E5D88]/50'
            }`}
          >
            <div className="w-11 h-11 rounded-[14px] bg-[#1E5D88] text-white flex items-center justify-center shrink-0 shadow-xs">
              <Icon name="shield" size={22} strokeWidth={2.2} />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="font-heading font-bold text-[16px] text-[#0B3D2E]">
                  {language === 'ha' ? 'Mamba a Ƙungiya' : 'Group Member'}
                </span>
                <span className="text-[10px] font-bold bg-[#EBF3FB] text-[#1E5D88] px-2 py-0.5 rounded-full border border-[#1E5D88]/20">
                  {language === 'ha' ? 'Tara & Karɓa' : 'Save & Collect'}
                </span>
              </div>
              <p className="text-[12px] text-[#4F5F57] mt-1 leading-relaxed">
                {language === 'ha'
                  ? 'Shiga ƙungiya da lambar gayyata, saka asusun bankin karɓar rabonku, biya kashi-kashi tare da ɗora shaida, da karɓar kuɗin rabo.'
                  : 'Join with invite code/link, add your payout account details, make full or installment contributions with transfer receipts, and collect when it is your turn.'}
              </p>
            </div>
          </div>
        </div>

        {/* Footnote */}
        <p className="text-[11px] text-center text-[#8A968F] pt-1">
          {language === 'ha'
            ? 'Ko wace irin rawa kuka zaɓa, kuna iya duba dukkan ayyukan ƙungiyoyinku a fili.'
            : 'Whether a member or organiser, you can see all group activities and transparent rotation records.'}
        </p>
      </div>
    </div>
  );
};
