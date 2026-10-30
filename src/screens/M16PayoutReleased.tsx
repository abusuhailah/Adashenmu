import React from 'react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../i18n/LanguageContext';
import { StatusBar } from '../components/common/StatusBar';
import { MoneyStateBadge } from '../components/common/MoneyStateBadge';
import { Icon } from '../components/common/Icon';

export const M16PayoutReleased: React.FC = () => {
  const { navigate, showToast } = useApp();
  const { t } = useLanguage();

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${t('payoutOnItsWay')} · Adashenmu`,
        text: 'My ₦200,000 group savings payout from Kasuwa Atamfa Adashe has been released! 🏺✨',
      }).catch(() => {});
    } else {
      showToast('Payout news copied to share!', 'success');
    }
  };

  return (
    <div className="flex-1 bg-[#0B3D2E] text-white flex flex-col justify-between overflow-y-auto hide-scrollbar">
      <div>
        <StatusBar mode="dark" />

        <div className="px-5 pt-3 pb-6 flex flex-col items-center text-center">
          {/* Reversed Pot illustration */}
          <div className="w-[110px] h-[110px] my-2 flex items-center justify-center">
            <img
              src="/brand/adashenmu-mark-reversed.svg"
              alt="Adashenmu"
              className="w-full h-full object-contain drop-shadow-xl"
            />
          </div>

          <p className="text-[12px] font-bold uppercase tracking-wider text-[#2FBF85] mb-1.5">
            {t('cycle5Date')}
          </p>

          <h1 className="font-heading font-extrabold text-[26px] text-white leading-tight mb-1">
            {t('payoutOnItsWay')}
          </h1>

          {/* Accent Gold 44px Display Amount */}
          <span className="font-heading font-extrabold text-[44px] text-[#F2B33D] tracking-tight block my-1">
            ₦200,000
          </span>

          <div className="mb-6">
            <MoneyStateBadge state="released" />
          </div>

          {/* Details Card (forestDeep) */}
          <div className="w-full bg-[#072A20] rounded-[16px] p-4.5 border border-[#2FBF85]/20 text-[13px] text-left divide-y divide-white/10 mb-4">
            <div className="flex items-center justify-between py-2">
              <span className="text-white/70">{t('to')}</span>
              <span className="font-semibold text-white">GTBank •••• 4821</span>
            </div>

            <div className="flex items-center justify-between py-2">
              <span className="text-white/70">{t('accountName')}</span>
              <span className="font-semibold text-white">Hauwa Ibrahim</span>
            </div>

            <div className="flex items-center justify-between py-2">
              <span className="text-white/70">{t('from')}</span>
              <span className="font-semibold text-white">Kasuwa Atamfa group wallet</span>
            </div>

            <div className="flex items-center justify-between py-2">
              <span className="text-white/70">{t('released')}</span>
              <span className="font-semibold text-[#2FBF85]">{t('releasedTime')}</span>
            </div>
          </div>

          {/* Note with users icon */}
          <div className="w-full p-3.5 rounded-[14px] bg-white/5 border border-white/10 flex items-start gap-3 text-left">
            <Icon name="users" size={18} className="text-[#2FBF85] shrink-0 mt-0.5" />
            <p className="text-[12px] text-white/90 leading-relaxed">
              {t('allMembersPaidOnTime')}
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-5 pt-3 pb-8 bg-[#0B3D2E] border-t border-white/10 space-y-2">
        <button
          type="button"
          onClick={() => navigate('/groups/g-kasuwa-atamfa/ledger')}
          className="w-full h-[52px] rounded-[14px] bg-[#0F8A5F] active:bg-[#0B6E4B] text-white font-heading font-bold text-[16px] flex items-center justify-center cursor-pointer shadow-lg hover:brightness-105 transition-all"
        >
          {t('viewTheLedger')}
        </button>

        <button
          type="button"
          onClick={handleShare}
          className="w-full h-10 flex items-center justify-center gap-2 text-[14px] font-semibold text-[#2FBF85] hover:underline cursor-pointer"
        >
          <Icon name="share" size={16} />
          <span>{t('shareTheGoodNews')}</span>
        </button>
      </div>
    </div>
  );
};
