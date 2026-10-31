import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { NIGERIAN_BANKS, validateNuban } from '../../data/nigerianBanks';
import { Icon } from './Icon';

interface PartnerBankModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PartnerBankModal: React.FC<PartnerBankModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, partnerBank, savePartnerBank, showToast } = useApp();
  const { language, t } = useLanguage();

  const [selectedBankCode, setSelectedBankCode] = useState<string>(
    partnerBank?.bankCode || NIGERIAN_BANKS[0].code
  );
  const [accountNumber, setAccountNumber] = useState<string>(partnerBank?.accountNumber || '');
  const [accountName, setAccountName] = useState<string>(
    partnerBank?.accountName || currentUser.name || ''
  );
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const currentBank = NIGERIAN_BANKS.find((b) => b.code === selectedBankCode) || NIGERIAN_BANKS[0];
  const isValidNuban = validateNuban(accountNumber);

  const handleSave = async () => {
    if (!isValidNuban) {
      showToast(
        language === 'ha'
          ? 'Da fatan za a shigar da lambar asusu mai lambobi 10'
          : 'Please enter a valid 10-digit NUBAN account number',
        'alert'
      );
      return;
    }

    setIsVerifying(true);
    try {
      await savePartnerBank({
        bankName: currentBank.name,
        bankCode: currentBank.code,
        accountNumber: accountNumber.trim(),
        accountName: accountName.trim() || currentUser.name,
      });
      setIsSuccess(true);
      showToast(
        language === 'ha'
          ? `An danganta asusun ${currentBank.name} cikin nasara!`
          : `${currentBank.name} account linked successfully!`,
        'success'
      );
      setTimeout(() => {
        setIsSuccess(false);
        setIsVerifying(false);
        onClose();
      }, 900);
    } catch {
      setIsVerifying(false);
      showToast(
        language === 'ha' ? 'Kuskure wajen ajiye banki' : 'Failed to save bank account',
        'alert'
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/60 backdrop-blur-xs p-0 md:p-4">
      <div
        className="w-full max-w-[420px] bg-white rounded-t-[28px] md:rounded-[28px] p-6 shadow-2xl border border-[#E3DDCF] max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom-6 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#EFEAE0]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#E3F4EC] text-[#0F8A5F] flex items-center justify-center shrink-0">
              <Icon name="bank" size={20} strokeWidth={2.4} />
            </div>
            <div>
              <h3 className="font-heading font-bold text-[17px] text-[#0B3D2E]">
                {currentUser.role === 'Organiser'
                  ? language === 'ha' ? 'Asusun Karɓar Kuɗi na Mai Shirya' : 'Organiser Receiving Account'
                  : language === 'ha' ? 'Asusun Karɓar Rabo na Mamba' : 'Member Payout Account'}
              </h3>
              <p className="text-[12px] text-[#4F5F57]">
                {currentUser.role === 'Organiser'
                  ? language === 'ha' ? 'Mambobi za su tura gudunmawa zuwa wannan asusun' : 'Members will transfer contributions to this account'
                  : language === 'ha' ? 'Mai shirya zai tura muku kuɗin rabo zuwa nan' : 'Organiser will transfer your pot payouts to this account'}
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

        {/* Content */}
        <div className="space-y-4 pt-4">
          {/* Bank Selection */}
          <div>
            <label className="block text-[13px] font-semibold text-[#0B3D2E] mb-1.5">
              {t('selectBank')}
            </label>
            <div className="relative">
              <select
                value={selectedBankCode}
                onChange={(e) => setSelectedBankCode(e.target.value)}
                className="w-full h-[50px] px-3.5 pr-10 rounded-[12px] bg-[#FAF7F0] border border-[#E3DDCF] text-[14px] font-medium text-[#0B3D2E] focus:outline-none focus:border-[#0F8A5F] cursor-pointer appearance-none"
              >
                {NIGERIAN_BANKS.map((b) => (
                  <option key={b.code} value={b.code}>
                    {b.name} ({b.type})
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[#4F5F57]">
                <Icon name="chevron-down" size={18} />
              </div>
            </div>
          </div>

          {/* Account Number */}
          <div>
            <label className="block text-[13px] font-semibold text-[#0B3D2E] mb-1.5">
              {t('accountNumber')}
            </label>
            <input
              type="text"
              inputMode="numeric"
              maxLength={10}
              placeholder="0123456789"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ''))}
              className="w-full h-[50px] px-3.5 rounded-[12px] bg-[#FAF7F0] border border-[#E3DDCF] text-[16px] font-mono tracking-wider font-semibold text-[#0B3D2E] focus:outline-none focus:border-[#0F8A5F]"
            />
            <div className="flex items-center justify-between text-[11px] mt-1 text-[#4F5F57]">
              <span>{language === 'ha' ? 'NUBAN lambobi 10' : '10-digit NUBAN'}</span>
              <span className={isValidNuban ? 'text-[#0F8A5F] font-bold' : ''}>
                {accountNumber.length}/10
              </span>
            </div>
          </div>

          {/* Account Name */}
          <div>
            <label className="block text-[13px] font-semibold text-[#0B3D2E] mb-1.5">
              {language === 'ha' ? 'Sunan Mai Asusun (Kamar a Banki)' : 'Account Holder Name'}
            </label>
            <input
              type="text"
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
              placeholder="e.g. Hauwa Ibrahim Bello"
              className="w-full h-[50px] px-3.5 rounded-[12px] bg-[#FAF7F0] border border-[#E3DDCF] text-[14px] font-medium text-[#0B3D2E] focus:outline-none focus:border-[#0F8A5F]"
            />
          </div>

          {/* Assurance Badge */}
          <div className="p-3.5 rounded-[14px] bg-[#E3F4EC] border border-[#0F8A5F]/20 flex items-start gap-2.5">
            <Icon name="shield" size={18} className="text-[#0F8A5F] shrink-0 mt-0.5" strokeWidth={2.4} />
            <div className="text-[12px] text-[#0B3D2E] leading-snug">
              <span className="font-bold block">
                {language === 'ha'
                  ? 'Biyan Kuɗi Kai Tsaye Cikin Amana'
                  : 'Direct & Transparent Transfers'}
              </span>
              <span className="text-[#0B6E4B]">
                {language === 'ha'
                  ? 'Duk wani biya yana tafiya kai tsaye ne tsakanin asusun banki tare da ɗora shaidar biya da tabbatarwa a fili.'
                  : 'All contributions and payouts transfer directly between trusted Nigerian bank accounts with receipt proof and instant confirmation.'}
              </span>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="pt-5 space-y-2">
          <button
            type="button"
            disabled={!isValidNuban || isVerifying}
            onClick={handleSave}
            className="w-full h-[50px] rounded-[14px] bg-[#0F8A5F] active:bg-[#0B6E4B] text-white font-heading font-bold text-[15px] flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:brightness-105 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isVerifying ? (
              <span>{language === 'ha' ? 'Ana tabbatarwa…' : 'Verifying account…'}</span>
            ) : isSuccess ? (
              <span className="flex items-center gap-2">
                <Icon name="check" size={18} strokeWidth={2.5} />
                {t('accountVerified')}
              </span>
            ) : (
              <span>{t('saveBank')}</span>
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
