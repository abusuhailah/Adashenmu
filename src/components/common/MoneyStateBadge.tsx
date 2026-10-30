import React from 'react';
import { MoneyState } from '../../data/types';
import { Icon } from './Icon';
import { useLanguage, TranslationKey } from '../../i18n/LanguageContext';

interface MoneyStateBadgeProps {
  state: MoneyState;
  className?: string;
  onClick?: () => void;
}

export const moneyStateMeta: Record<
  MoneyState,
  { label: string; text: string; tint: string; icon: string; meaning: string }
> = {
  pending: {
    label: 'Pending',
    text: '#8A5A00',
    tint: '#FFF4DB',
    icon: 'clock',
    meaning: 'Due, not yet paid',
  },
  confirming: {
    label: 'Confirming',
    text: '#0B6E4B',
    tint: '#E3F4EC',
    icon: 'check',
    meaning: "Member has sent the money; bank confirming (renamed from 'Paid' after testing)",
  },
  inThePot: {
    label: 'In the pot',
    text: '#0B6E4B',
    tint: '#E3F4EC',
    icon: 'pot',
    meaning: 'Confirmed in the group wallet',
  },
  released: {
    label: 'Released',
    text: '#1D4ED8',
    tint: '#E6EEFF',
    icon: 'arrow-up-right',
    meaning: "Paid out to this turn's member",
  },
  late: {
    label: 'Late',
    text: '#B42318',
    tint: '#FDECEA',
    icon: 'alert',
    meaning: 'Grace period ended, still unpaid',
  },
  failed: {
    label: 'Failed',
    text: '#B42318',
    tint: '#FDECEA',
    icon: 'x',
    meaning: 'A payment attempt did not go through',
  },
  refunded: {
    label: 'Refunded',
    text: '#4F5F57',
    tint: '#EEF0EE',
    icon: 'undo',
    meaning: 'Money from a failed attempt returned',
  },
};

export const MoneyStateBadge: React.FC<MoneyStateBadgeProps> = ({
  state,
  className = '',
  onClick,
}) => {
  const { t } = useLanguage();
  const config = moneyStateMeta[state] || moneyStateMeta.pending;

  const stateKeyMap: Record<MoneyState, TranslationKey> = {
    pending: 'statePending',
    confirming: 'stateConfirming',
    inThePot: 'stateInThePot',
    released: 'stateReleased',
    late: 'stateLate',
    failed: 'stateFailed',
    refunded: 'stateRefunded',
  };

  const translatedLabel = t(stateKeyMap[state] || 'statePending');

  return (
    <span
      onClick={onClick}
      style={{
        backgroundColor: config.tint,
        color: config.text,
      }}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-semibold tracking-normal whitespace-nowrap select-none transition-colors duration-200 ${
        onClick ? 'cursor-pointer hover:opacity-90' : ''
      } ${className}`}
    >
      <Icon name={config.icon} size={14} strokeWidth={2.2} className="shrink-0" />
      <span>{translatedLabel}</span>
    </span>
  );
};
