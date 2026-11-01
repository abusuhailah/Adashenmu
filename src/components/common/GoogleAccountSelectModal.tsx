import React, { useState } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { Icon } from './Icon';

export interface KnownGoogleAccount {
  email: string;
  name: string;
  avatarLetter: string;
  isPrimary?: boolean;
}

interface GoogleAccountSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAccount: (email: string, name?: string) => Promise<void>;
  onTriggerGooglePopup: () => Promise<void>;
}

export const GoogleAccountSelectModal: React.FC<GoogleAccountSelectModalProps> = ({
  isOpen,
  onClose,
  onSelectAccount,
  onTriggerGooglePopup,
}) => {
  const { language } = useLanguage();
  const [isAddingCustom, setIsAddingCustom] = useState(false);
  const [customEmail, setCustomEmail] = useState('');
  const [customName, setCustomName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Default known device accounts
  const [accounts, setAccounts] = useState<KnownGoogleAccount[]>(() => {
    const list: KnownGoogleAccount[] = [
      {
        email: 'suhailahmart@gmail.com',
        name: 'Suhailah Mart',
        avatarLetter: 'S',
        isPrimary: true,
      },
    ];
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('adashenmu_saved_emails');
        if (stored) {
          const parsed: KnownGoogleAccount[] = JSON.parse(stored);
          parsed.forEach((item) => {
            if (!list.some((a) => a.email.toLowerCase() === item.email.toLowerCase())) {
              list.push(item);
            }
          });
        }
      } catch {}
    }
    return list;
  });

  if (!isOpen) return null;

  const handlePickAccount = async (account: KnownGoogleAccount) => {
    setIsSubmitting(true);
    try {
      await onSelectAccount(account.email, account.name);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddCustomSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customEmail.trim() || !customEmail.includes('@')) return;

    const email = customEmail.trim().toLowerCase();
    const name = customName.trim() || email.split('@')[0];
    const letter = (name[0] || 'G').toUpperCase();

    const newAcc: KnownGoogleAccount = {
      email,
      name,
      avatarLetter: letter,
    };

    const updated = [...accounts, newAcc];
    setAccounts(updated);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('adashenmu_saved_emails', JSON.stringify(updated));
      } catch {}
    }

    setIsSubmitting(true);
    try {
      await onSelectAccount(email, name);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-200">
      <div
        className="w-full max-w-[420px] bg-white rounded-t-[28px] sm:rounded-[24px] shadow-2xl border border-[#E3DDCF] overflow-hidden flex flex-col max-h-[90vh] animate-in slide-in-from-bottom-6 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Google Logo */}
        <div className="p-5 pb-3 border-b border-[#EFEAE0] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <svg className="w-6 h-6 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.35 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.16 0 9.97 0 12s.45 3.84 1.25 5.42l4.03-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
            <div>
              <h3 className="font-heading font-bold text-[17px] text-[#0B3D2E] leading-tight">
                {language === 'ha' ? 'Zaɓi Asusun Gmail' : 'Choose an account'}
              </h3>
              <p className="text-[12px] text-[#4F5F57] mt-0.5">
                {language === 'ha' ? 'domin ci gaba zuwa Adashenmu' : 'to continue to Adashenmu'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#FAF7F0] text-[#4F5F57] hover:text-[#0B3D2E] flex items-center justify-center cursor-pointer transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Content: List of Accounts */}
        <div className="p-4 space-y-2 overflow-y-auto">
          <p className="text-[12px] font-semibold text-[#4F5F57] px-1">
            {language === 'ha'
              ? 'Asusun da ke kan wannan na\'ura:'
              : 'Google accounts found on this device:'}
          </p>

          <div className="divide-y divide-[#EFEAE0] border border-[#E3DDCF] rounded-[16px] overflow-hidden bg-white shadow-xs">
            {accounts.map((acc) => (
              <button
                key={acc.email}
                type="button"
                disabled={isSubmitting}
                onClick={() => handlePickAccount(acc)}
                className="w-full p-3.5 flex items-center justify-between text-left hover:bg-[#FAF7F0] active:bg-[#E3F4EC] transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-[#0F8A5F] text-white flex items-center justify-center font-bold text-[15px] shrink-0 shadow-xs">
                    {acc.avatarLetter}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-heading font-bold text-[14px] text-[#0B3D2E] block truncate">
                        {acc.name}
                      </span>
                      {acc.isPrimary && (
                        <span className="text-[10px] font-bold bg-[#E3F4EC] text-[#0B6E4B] px-1.5 py-0.2 rounded border border-[#0F8A5F]/20">
                          {language === 'ha' ? 'Asali' : 'Primary'}
                        </span>
                      )}
                    </div>
                    <span className="text-[12px] text-[#4F5F57] font-mono block truncate">
                      {acc.email}
                    </span>
                  </div>
                </div>

                <div className="w-6 h-6 rounded-full bg-transparent group-hover:bg-[#E3F4EC] text-[#0F8A5F] flex items-center justify-center transition-colors">
                  <Icon name="chevron-right" size={16} />
                </div>
              </button>
            ))}

            {/* Option to use another account */}
            {!isAddingCustom ? (
              <button
                type="button"
                onClick={() => setIsAddingCustom(true)}
                className="w-full p-3.5 flex items-center gap-3 text-left hover:bg-[#FAF7F0] transition-colors cursor-pointer text-[#0F8A5F] font-semibold text-[13px]"
              >
                <div className="w-10 h-10 rounded-full border border-dashed border-[#0F8A5F] flex items-center justify-center shrink-0">
                  <Icon name="plus" size={18} strokeWidth={2.5} />
                </div>
                <span>
                  {language === 'ha'
                    ? 'Yi amfani da wani asusun daban…'
                    : 'Use another Google / Gmail account…'}
                </span>
              </button>
            ) : (
              <form onSubmit={handleAddCustomSubmit} className="p-3.5 bg-[#FAF7F0] space-y-2.5">
                <span className="text-[12px] font-bold text-[#0B3D2E] block">
                  {language === 'ha' ? 'Shigar da wani Gmail' : 'Enter another Gmail address'}
                </span>
                <input
                  type="email"
                  required
                  placeholder="e.g. yourname@gmail.com"
                  value={customEmail}
                  onChange={(e) => setCustomEmail(e.target.value)}
                  className="w-full h-10 px-3 rounded-[10px] bg-white border border-[#E3DDCF] text-[13px] font-mono text-[#0B3D2E] focus:border-[#0F8A5F] focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="Your Full Name"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="w-full h-10 px-3 rounded-[10px] bg-white border border-[#E3DDCF] text-[13px] text-[#0B3D2E] focus:border-[#0F8A5F] focus:outline-none"
                />
                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setIsAddingCustom(false)}
                    className="flex-1 h-9 rounded-[8px] border border-[#E3DDCF] text-[12px] font-semibold text-[#4F5F57] hover:bg-white cursor-pointer"
                  >
                    {language === 'ha' ? 'Soke' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || !customEmail.includes('@')}
                    className="flex-1 h-9 rounded-[8px] bg-[#0F8A5F] text-white text-[12px] font-bold hover:brightness-105 cursor-pointer disabled:opacity-50"
                  >
                    {language === 'ha' ? 'Shiga da wannan' : 'Continue with this'}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Direct Google Popup Trigger Option */}
          <div className="pt-2">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={async () => {
                setIsSubmitting(true);
                try {
                  await onTriggerGooglePopup();
                  onClose();
                } finally {
                  setIsSubmitting(false);
                }
              }}
              className="w-full py-2.5 px-3 rounded-[12px] bg-[#FAF7F0] hover:bg-[#EFEAE0] border border-[#E3DDCF] text-[#4F5F57] text-[12px] font-medium flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <Icon name="globe" size={14} className="text-[#0F8A5F]" />
              <span>
                {language === 'ha'
                  ? 'Bude popup na Google Account Chooser'
                  : 'Open native Google Account Chooser popup'}
              </span>
            </button>
          </div>
        </div>

        {/* Footer Security Assurance */}
        <div className="p-3.5 bg-[#FAF7F0] border-t border-[#E3DDCF] text-center">
          <p className="text-[11px] text-[#4F5F57] flex items-center justify-center gap-1.5">
            <Icon name="shield" size={13} className="text-[#0F8A5F]" />
            <span>
              {language === 'ha'
                ? 'Tsarin shiga mai tsaro ta Google OAuth 2.0'
                : 'Secured via standard Google OAuth 2.0 authentication'}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};
