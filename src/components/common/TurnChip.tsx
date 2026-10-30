import React from 'react';
import { TurnStatus } from '../../data/types';
import { Icon } from './Icon';
import { useLanguage } from '../../i18n/LanguageContext';

interface TurnChipProps {
  status: TurnStatus;
  className?: string;
}

export const TurnChip: React.FC<TurnChipProps> = ({ status, className = '' }) => {
  const { t } = useLanguage();

  switch (status) {
    case 'yourTurn':
      return (
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded-[8px] text-[12px] font-semibold bg-[#F2B33D] text-[#0B3D2E] select-none ${className}`}
        >
          {t('turnYourTurn')}
        </span>
      );
    case 'next':
      return (
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded-[8px] text-[12px] font-semibold bg-[#E3F4EC] text-[#0B6E4B] select-none ${className}`}
        >
          {t('turnNext')}
        </span>
      );
    case 'collected':
      return (
        <span
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-[8px] text-[12px] font-medium bg-[#EEF0EE] text-[#4F5F57] select-none ${className}`}
        >
          <Icon name="check" size={12} strokeWidth={2.5} />
          {t('turnCollected')}
        </span>
      );
    case 'upcoming':
    default:
      return (
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded-[8px] text-[12px] font-medium bg-white text-[#4F5F57] border border-[#E3DDCF] select-none ${className}`}
        >
          {t('turnUpcoming')}
        </span>
      );
  }
};
