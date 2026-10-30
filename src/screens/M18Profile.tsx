import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../i18n/LanguageContext';
import { StatusBar } from '../components/common/StatusBar';
import { TopBar } from '../components/common/TopBar';
import { BottomTabBar } from '../components/common/BottomTabBar';
import { Avatar } from '../components/common/Avatar';
import { Icon } from '../components/common/Icon';

export const M18Profile: React.FC = () => {
  const { navigate, setDemoModalOpen, showToast } = useApp();
  const { language, setLanguage, t } = useLanguage();
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showWalletHelp, setShowWalletHelp] = useState(false);

  const handleLogout = () => {
    showToast('Logged out of Adashenmu session', 'info');
    navigate('/welcome');
  };

  const getLanguageLabel = () => {
    if (language === 'ha') return 'Hausa (active)';
    if (language === 'ar') return 'العربية (active)';
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
            <Avatar initials="HI" color="clay" size={56} />
            <div>
              <h2 className="font-heading font-bold text-[18px] text-[#0B3D2E] leading-tight">
                Hauwa Ibrahim
              </h2>
              <span className="text-[13px] text-[#4F5F57] block mt-0.5">
                +234 803 412 7765
              </span>
              <div className="flex items-center gap-1.5 text-[12px] font-semibold text-[#0F8A5F] mt-1">
                <Icon name="shield" size={13} strokeWidth={2.4} />
                <span>{t('idVerifiedNIN')}</span>
              </div>
            </div>
          </div>

          {/* Record card (primarySoft) */}
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
            {/* Payout account */}
            <div
              onClick={() => showToast('Payout account: GTBank •••• 4821 verified', 'info')}
              className="p-3.5 flex items-center justify-between hover:bg-[#FAF7F0] cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-[10px] bg-[#FAF7F0] text-[#0B3D2E] flex items-center justify-center shrink-0">
                  <Icon name="bank" size={18} />
                </div>
                <div>
                  <span className="text-[14px] font-semibold text-[#0B3D2E] block">
                    {t('payoutAccount')}
                  </span>
                  <span className="text-[12px] text-[#4F5F57] block mt-0.5">
                    GTBank •••• 4821
                  </span>
                </div>
              </div>
              <Icon name="chevron-right" size={18} className="text-[#8A968F]" />
            </div>

            {/* Identity */}
            <div
              onClick={() => showToast('NIN confirmed with NIMC on 28 Jun 2026', 'success')}
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
                    NIN · verified 28 Jun 2026
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
              onClick={() => showToast('Reminders enabled: Push and SMS, 2 days before', 'info')}
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

            {/* Help and safety */}
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

            {/* Prototype Navigator menu item */}
            <div
              onClick={() => setDemoModalOpen(true)}
              className="p-3.5 flex items-center justify-between hover:bg-[#FAF7F0] cursor-pointer transition-colors bg-[#FFF4DB]/30"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-[10px] bg-[#FFF4DB] text-[#8A5A00] flex items-center justify-center shrink-0">
                  <Icon name="list" size={18} />
                </div>
                <div>
                  <span className="text-[14px] font-bold text-[#8A5A00] block">
                    {t('prototypeNavigator')}
                  </span>
                  <span className="text-[12px] text-[#4F5F57] block mt-0.5">
                    {t('prototypeNavigatorDesc')}
                  </span>
                </div>
              </div>
              <Icon name="chevron-right" size={18} className="text-[#8A968F]" />
            </div>

            {/* Log out (red) */}
            <div
              onClick={handleLogout}
              className="p-3.5 flex items-center justify-between hover:bg-[#FDECEA] cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-[10px] bg-[#FDECEA] text-[#B42318] flex items-center justify-center shrink-0">
                  <Icon name="logout" size={18} />
                </div>
                <span className="text-[14px] font-semibold text-[#B42318]">
                  {t('logOut')}
                </span>
              </div>
              <Icon name="chevron-right" size={18} className="text-[#B42318]/50" />
            </div>
          </div>
        </div>
      </div>

      {/* Language Switch Modal: English, Hausa, Arabic */}
      {showLanguageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-5 bg-black/50 backdrop-blur-[2px]">
          <div className="bg-white rounded-[20px] p-5 max-w-[340px] w-full shadow-2xl border border-[#E3DDCF]">
            <h3 className="font-heading font-bold text-[18px] text-[#0B3D2E] mb-2">
              {t('selectLanguage')}
            </h3>
            <p className="text-[13px] text-[#4F5F57] mb-4">
              {t('chooseLanguageDesc')}
            </p>
            <div className="space-y-2 mb-4">
              <button
                type="button"
                onClick={() => {
                  setLanguage('en');
                  setShowLanguageModal(false);
                  showToast('Language switched to English', 'info');
                }}
                className={`w-full p-3 rounded-[12px] border text-left flex items-center justify-between text-[14px] font-semibold cursor-pointer ${
                  language === 'en'
                    ? 'border-[#0F8A5F] bg-[#E3F4EC] text-[#0B6E4B]'
                    : 'border-[#E3DDCF] bg-white text-[#0B3D2E]'
                }`}
              >
                <span>English</span>
                {language === 'en' && <Icon name="check" size={16} strokeWidth={2.5} />}
              </button>
              <button
                type="button"
                onClick={() => {
                  setLanguage('ha');
                  setShowLanguageModal(false);
                  showToast('An canza harshe zuwa Hausa', 'info');
                }}
                className={`w-full p-3 rounded-[12px] border text-left flex items-center justify-between text-[14px] font-semibold cursor-pointer ${
                  language === 'ha'
                    ? 'border-[#0F8A5F] bg-[#E3F4EC] text-[#0B6E4B]'
                    : 'border-[#E3DDCF] bg-white text-[#0B3D2E]'
                }`}
              >
                <span>Hausa</span>
                {language === 'ha' && <Icon name="check" size={16} strokeWidth={2.5} />}
              </button>
              <button
                type="button"
                onClick={() => {
                  setLanguage('ar');
                  setShowLanguageModal(false);
                  showToast('تم تغيير اللغة إلى العربية', 'info');
                }}
                className={`w-full p-3 rounded-[12px] border text-left flex items-center justify-between text-[14px] font-semibold cursor-pointer ${
                  language === 'ar'
                    ? 'border-[#0F8A5F] bg-[#E3F4EC] text-[#0B6E4B]'
                    : 'border-[#E3DDCF] bg-white text-[#0B3D2E]'
                }`}
              >
                <span>العربية</span>
                {language === 'ar' && <Icon name="check" size={16} strokeWidth={2.5} />}
              </button>
            </div>
            <button
              type="button"
              onClick={() => setShowLanguageModal(false)}
              className="w-full h-11 rounded-[12px] bg-[#FAF7F0] text-[#0B3D2E] font-semibold text-[14px] cursor-pointer"
            >
              {t('done')}
            </button>
          </div>
        </div>
      )}

      {/* Wallet Help Modal */}
      {showWalletHelp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-5 bg-black/50 backdrop-blur-[2px]">
          <div className="bg-white rounded-[20px] p-5 max-w-[340px] w-full shadow-2xl border border-[#E3DDCF]">
            <div className="w-10 h-10 rounded-full bg-[#E3F4EC] text-[#0F8A5F] flex items-center justify-center mb-3">
              <Icon name="bank" size={20} strokeWidth={2.2} />
            </div>
            <h3 className="font-heading font-bold text-[18px] text-[#0B3D2E] mb-2">
              {t('walletWorks')}
            </h3>
            <p className="text-[13px] text-[#4F5F57] leading-relaxed mb-4">
              {t('walletHelpDesc')}
            </p>
            <button
              type="button"
              onClick={() => setShowWalletHelp(false)}
              className="w-full h-11 rounded-[12px] bg-[#0F8A5F] text-white font-semibold text-[14px] cursor-pointer"
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
          else if (tab === 'groups') navigate('/groups');
          else if (tab === 'pay') navigate('/pay');
          else if (tab === 'activity') navigate('/activity');
        }}
      />
    </div>
  );
};
