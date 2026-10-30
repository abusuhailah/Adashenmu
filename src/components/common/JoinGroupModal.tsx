import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { Icon } from './Icon';

interface JoinGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const JoinGroupModal: React.FC<JoinGroupModalProps> = ({ isOpen, onClose }) => {
  const { joinGroupByCodeOrId, showToast, navigate } = useApp();
  const { language, t } = useLanguage();
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleJoin = async () => {
    if (!code.trim()) return;

    setIsLoading(true);
    try {
      const group = await joinGroupByCodeOrId(code.trim());
      showToast(
        language === 'ha'
          ? `Kun shiga ƙungiyar "${group.name}" cikin nasara!`
          : `Joined "${group.name}" successfully!`,
        'success'
      );
      setIsLoading(false);
      onClose();
      navigate(`/groups/${group.id}/ledger`);
    } catch (err: any) {
      setIsLoading(false);
      showToast(err.message || 'Could not join group. Check code and try again.', 'alert');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/60 backdrop-blur-xs p-0 md:p-4">
      <div
        className="w-full max-w-[400px] bg-white rounded-t-[28px] md:rounded-[28px] p-6 shadow-2xl border border-[#E3DDCF] animate-in slide-in-from-bottom-6 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-[#EFEAE0]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#E3F4EC] text-[#0F8A5F] flex items-center justify-center shrink-0">
              <Icon name="users" size={20} strokeWidth={2.4} />
            </div>
            <div>
              <h3 className="font-heading font-bold text-[17px] text-[#0B3D2E]">
                {t('joinGroupWithCode')}
              </h3>
              <p className="text-[12px] text-[#4F5F57]">
                {language === 'ha'
                  ? 'Shigar da lambar sirri ko mahadar gayyata'
                  : 'Enter group code or invite link'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#FAF7F0] text-[#4F5F57] hover:text-[#0B3D2E] flex items-center justify-center cursor-pointer"
          >
            <Icon name="close" size={18} />
          </button>
        </div>

        <div className="py-4 space-y-4">
          <div>
            <label className="block text-[13px] font-semibold text-[#0B3D2E] mb-1.5">
              {t('enterGroupCode')}
            </label>
            <input
              type="text"
              placeholder={t('groupCodePlaceholder')}
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              className="w-full h-[52px] px-4 rounded-[12px] bg-[#FAF7F0] border border-[#E3DDCF] text-[16px] font-mono font-bold tracking-wider text-[#0B3D2E] focus:outline-none focus:border-[#0F8A5F]"
            />
            <p className="text-[12px] text-[#4F5F57] mt-1.5 leading-snug">
              {language === 'ha'
                ? 'Mai shirya ƙungiya na iya ba ku wannan lambar ko aika muku mahada ta WhatsApp ko SMS.'
                : 'The group organiser can give you this code or share an invite link via WhatsApp or SMS.'}
            </p>
          </div>
        </div>

        <div className="space-y-2 pt-2">
          <button
            type="button"
            disabled={!code.trim() || isLoading}
            onClick={handleJoin}
            className="w-full h-[50px] rounded-[14px] bg-[#0F8A5F] active:bg-[#0B6E4B] text-white font-heading font-bold text-[15px] flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:brightness-105 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span>{language === 'ha' ? 'Ana duba ƙungiya…' : 'Finding group…'}</span>
            ) : (
              <span>{t('joinGroup')}</span>
            )}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 text-[13px] font-semibold text-[#4F5F57] hover:text-[#0B3D2E] cursor-pointer"
          >
            {language === 'ha' ? 'Soke' : 'Cancel'}
          </button>
        </div>
      </div>
    </div>
  );
};
