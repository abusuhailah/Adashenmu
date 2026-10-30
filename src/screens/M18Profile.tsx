import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../i18n/LanguageContext';
import { StatusBar } from '../components/common/StatusBar';
import { TopBar } from '../components/common/TopBar';
import { BottomTabBar } from '../components/common/BottomTabBar';
import { Avatar } from '../components/common/Avatar';
import { Icon } from '../components/common/Icon';

export const M18Profile: React.FC = () => {
  const {
    navigate,
    currentUser,
    isNinVerified,
    partnerBank,
    setPartnerBankModalOpen,
    signOut,
    showToast,
  } = useApp();
  const { language, setLanguage, t } = useLanguage();
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showWalletHelp, setShowWalletHelp] = useState(false);

  const handleLogout = async () => {
    await signOut();
  };

  const getLanguageLabel = () => {
    if (language === 'ha') return 'Hausa (aiki)';
    return 'English (active)';
  };

  return (
    <div className="flex-1 bg-[#FAF7F0] flex flex-col justify-between overflow-hidden">
      <div className="flex-1 overflow-y-auto hide-scrollbar">
        <StatusBar mode="light" />
        <TopBar title={t('profile')} showBack={false} />

        <div className="px-5 space-y-4 pb-6 pt-1">
          {/* Header Card */}
          <div className="bg-white rounded-[16px] p-4.5 border border-[#E3DDCF] shadow-sm flex items-center gap-4">
            <Avatar initials={currentUser.initials} color={currentUser.avatarColor} size={56} />
            <div className="min-w-0 flex-1">
              <h2 className="font-heading font-bold text-[18px] text-[#0B3D2E] leading-tight truncate">
                {currentUser.name}
              </h2>
              <span className="text-[13px] text-[#4F5F57] block mt-0.5 font-mono">
                {currentUser.phone || '+234 803 412 7765'}
              </span>
              <div className="flex items-center gap-1.5 text-[12px] font-semibold text-[#0F8A5F] mt-1">
                <Icon name="shield" size={13} strokeWidth={2.4} />
                <span>
                  {isNinVerified
                    ? t('idVerifiedNIN')
                    : language === 'ha' ? 'Ba a tantance NIN ba' : 'NIN unverified'}
                </span>
              </div>
            </div>
          </div>

          {/* Record card */}
          <div className="p-4 rounded-[16px] bg-[#E3F4EC] border border-[#0F8A5F]/20 flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-[#0F8A5F] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
              <Icon name="check" size={16} strokeWidth={2.5} />
            </div>
            <div>
              <p className="font-heading font-bold text-[14px] text-[#0B3D2E]">
                {t('paidOnTimeRecord')}
              </p>
              <p className="text-[12px] text-[#0B6E4B] mt-0.5 font-medium">
                {t('paymentRecordInGroup')}
              </p>
            </div>
          </div>

          {/* Settings list */}
          <div className="bg-white rounded-[16px] border border-[#E3DDCF] shadow-sm divide-y divide-[#EFEAE0] overflow-hidden">
            {/* Payout account / Partner Bank */}
            <div
              onClick={() => setPartnerBankModalOpen(true)}
              className="p-3.5 flex items-center justify-between hover:bg-[#FAF7F0] cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-[10px] bg-[#FAF7F0] text-[#0B3D2E] flex items-center justify-center shrink-0">
                  <Icon name="bank" size={18} />
                </div>
                <div>
                  <span className="text-[14px] font-semibold text-[#0B3D2E] block">
                    {t('partnerBankSetup')}
                  </span>
                  <span className="text-[12px] text-[#4F5F57] block mt-0.5">
                    {partnerBank
                      ? `${partnerBank.bankName} •••• ${partnerBank.accountNumber.slice(-4)}`
                      : 'Access Bank (CBN Licensed)'}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-bold text-[#0F8A5F] bg-[#E3F4EC] px-2 py-0.5 rounded-full">
                  {partnerBank?.isVerified ? 'VERIFIED' : 'SETUP'}
                </span>
                <Icon name="chevron-right" size={18} className="text-[#8A968F]" />
              </div>
            </div>

            {/* Identity */}
            <div
              onClick={() => navigate('/verify')}
              className="p-3.5 flex items-center justify-between hover:bg-[#FAF7F0] cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-[10px] bg-[#FAF7F0] text-[#0B3D2E] flex items-center justify-center shrink-0">
                  <Icon name="shield" size={18} />
                </div>
                <div>
                  <span className="text-[14px] font-semibold text-[#0B3D2E] block">
                    {t('identity')}
                  </span>
                  <span className="text-[12px] text-[#4F5F57] block mt-0.5">
                    {isNinVerified
                      ? language === 'ha' ? 'An tantance NIN da NIMC' : 'NIN verified with NIMC'
                      : language === 'ha' ? 'Danna nan don tantance NIN' : 'Tap to verify NIN with NIMC'}
                  </span>
                </div>
              </div>
              <Icon name="chevron-right" size={18} className="text-[#8A968F]" />
            </div>

            {/* Language */}
            <div
              onClick={() => setShowLanguageModal(true)}
              className="p-3.5 flex items-center justify-between hover:bg-[#FAF7F0] cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-[10px] bg-[#FAF7F0] text-[#0B3D2E] flex items-center justify-center shrink-0">
                  <Icon name="globe" size={18} />
                </div>
                <div>
                  <span className="text-[14px] font-semibold text-[#0B3D2E] block">
                    {t('language')}
                  </span>
                  <span className="text-[12px] text-[#4F5F57] block mt-0.5">
                    {getLanguageLabel()}
                  </span>
                </div>
              </div>
              <Icon name="chevron-right" size={18} className="text-[#8A968F]" />
            </div>

            {/* Reminders */}
            <div
              onClick={() => showToast('SMS reminders enabled (2 days prior to cycle)', 'info')}
              className="p-3.5 flex items-center justify-between hover:bg-[#FAF7F0] cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-[10px] bg-[#FAF7F0] text-[#0B3D2E] flex items-center justify-center shrink-0">
                  <Icon name="bell" size={18} />
                </div>
                <div>
                  <span className="text-[14px] font-semibold text-[#0B3D2E] block">
                    {t('reminders')}
                  </span>
                  <span className="text-[12px] text-[#4F5F57] block mt-0.5">
                    {t('pushAndSms')}
                  </span>
                </div>
              </div>
              <Icon name="chevron-right" size={18} className="text-[#8A968F]" />
            </div>

            {/* How Wallet Works */}
            <div
              onClick={() => setShowWalletHelp(true)}
              className="p-3.5 flex items-center justify-between hover:bg-[#FAF7F0] cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-[10px] bg-[#FAF7F0] text-[#0B3D2E] flex items-center justify-center shrink-0">
                  <Icon name="help" size={18} />
                </div>
                <div>
                  <span className="text-[14px] font-semibold text-[#0B3D2E] block">
                    {t('helpAndSafety')}
                  </span>
                  <span className="text-[12px] text-[#4F5F57] block mt-0.5">
                    {t('walletWorks')}
                  </span>
                </div>
              </div>
              <Icon name="chevron-right" size={18} className="text-[#8A968F]" />
            </div>
          </div>

          {/* Log out */}
          <button
            type="button"
            onClick={handleLogout}
            className="w-full h-[50px] rounded-[14px] bg-white border border-[#E3DDCF] text-[#B42318] hover:bg-[#FAF7F0] font-heading font-bold text-[14px] flex items-center justify-center gap-2 cursor-pointer shadow-xs transition-colors"
          >
            <Icon name="logout" size={18} strokeWidth={2.2} />
            <span>{t('logOut')}</span>
          </button>
        </div>
      </div>

      {/* Language Modal */}
      {showLanguageModal && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/60 backdrop-blur-xs p-0 md:p-4">
          <div
            className="w-full max-w-[390px] bg-white rounded-t-[28px] md:rounded-[28px] p-6 shadow-2xl border border-[#E3DDCF] animate-in slide-in-from-bottom-6 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-[#EFEAE0]">
              <div className="flex items-center gap-2.5">
                <Icon name="globe" size={20} className="text-[#0F8A5F]" />
                <h3 className="font-heading font-bold text-[18px] text-[#0B3D2E]">
                  {t('selectLanguage')}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowLanguageModal(false)}
                className="w-8 h-8 rounded-full bg-[#FAF7F0] text-[#4F5F57] hover:text-[#0B3D2E] flex items-center justify-center cursor-pointer"
              >
                <Icon name="close" size={18} />
              </button>
            </div>

            <p className="text-[13px] text-[#4F5F57] mt-3 mb-4 leading-relaxed">
              {t('chooseLanguageDesc')}
            </p>

            <div className="space-y-2.5">
              <button
                type="button"
                onClick={() => {
                  setLanguage('en');
                  setShowLanguageModal(false);
                  showToast('Language set to English', 'success');
                }}
                className={`w-full p-4 rounded-[14px] border text-left flex items-center justify-between cursor-pointer transition-all ${
                  language === 'en'
                    ? 'border-[#0F8A5F] bg-[#E3F4EC] shadow-sm'
                    : 'border-[#E3DDCF] bg-white hover:bg-[#FAF7F0]'
                }`}
              >
                <div>
                  <span className="font-heading font-bold text-[15px] text-[#0B3D2E] block">
                    English
                  </span>
                  <span className="text-[12px] text-[#4F5F57]">Official English interface</span>
                </div>
                {language === 'en' && (
                  <div className="w-6 h-6 rounded-full bg-[#0F8A5F] text-white flex items-center justify-center shrink-0">
                    <Icon name="check" size={14} strokeWidth={2.6} />
                  </div>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setLanguage('ha');
                  setShowLanguageModal(false);
                  showToast('An canza harshe zuwa Hausa', 'success');
                }}
                className={`w-full p-4 rounded-[14px] border text-left flex items-center justify-between cursor-pointer transition-all ${
                  language === 'ha'
                    ? 'border-[#0F8A5F] bg-[#E3F4EC] shadow-sm'
                    : 'border-[#E3DDCF] bg-white hover:bg-[#FAF7F0]'
                }`}
              >
                <div>
                  <span className="font-heading font-bold text-[15px] text-[#0B3D2E] block">
                    Hausa
                  </span>
                  <span className="text-[12px] text-[#4F5F57]">Cikakken tsarin Hausa</span>
                </div>
                {language === 'ha' && (
                  <div className="w-6 h-6 rounded-full bg-[#0F8A5F] text-white flex items-center justify-center shrink-0">
                    <Icon name="check" size={14} strokeWidth={2.6} />
                  </div>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Wallet Help Modal */}
      {showWalletHelp && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/60 backdrop-blur-xs p-0 md:p-4">
          <div
            className="w-full max-w-[390px] bg-white rounded-t-[28px] md:rounded-[28px] p-6 shadow-2xl border border-[#E3DDCF] animate-in slide-in-from-bottom-6 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#EFEAE0]">
              <div className="flex items-center gap-2">
                <Icon name="bank" size={20} className="text-[#0F8A5F]" />
                <h3 className="font-heading font-bold text-[17px] text-[#0B3D2E]">
                  {t('walletWorks')}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowWalletHelp(false)}
                className="w-8 h-8 rounded-full bg-[#FAF7F0] text-[#4F5F57] hover:text-[#0B3D2E] flex items-center justify-center cursor-pointer"
              >
                <Icon name="close" size={18} />
              </button>
            </div>

            <div className="py-4 space-y-3 text-[13px] text-[#4F5F57] leading-relaxed">
              <p>{t('walletHelpDesc')}</p>
              <div className="p-3 rounded-[12px] bg-[#E3F4EC] border border-[#0F8A5F]/20 text-[#0B3D2E] font-medium text-[12px]">
                {language === 'ha'
                  ? 'Kowace gudunmawa tana da lambar tabbatarwa ta NIBSS da inshorar NDIC.'
                  : 'Every contribution is tracked transparently with licensed CBN settlement & NDIC protection.'}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowWalletHelp(false)}
              className="w-full h-[48px] rounded-[14px] bg-[#0F8A5F] active:bg-[#0B6E4B] text-white font-heading font-bold text-[15px] flex items-center justify-center cursor-pointer shadow-sm hover:brightness-105"
            >
              {t('understood')}
            </button>
          </div>
        </div>
      )}

      {/* Bottom Bar */}
      <BottomTabBar
        activeTab="profile"
        onTabChange={(tab) => {
          if (tab === 'home') navigate('/home');
          else if (tab === 'pay') navigate('/pay');
          else if (tab === 'groups') navigate('/groups');
          else if (tab === 'activity') navigate('/activity');
        }}
      />
    </div>
  );
};
