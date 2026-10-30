import React from 'react';
import { MoneyState } from '../../data/types';
import { MoneyStateBadge, moneyStateMeta } from './MoneyStateBadge';
import { Icon } from './Icon';

interface MoneyStatesSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

const statesList: MoneyState[] = [
  'pending',
  'confirming',
  'inThePot',
  'released',
  'late',
  'failed',
  'refunded',
];

export const MoneyStatesSheet: React.FC<MoneyStatesSheetProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-[2px] transition-opacity">
      {/* Backdrop tap to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Sheet panel */}
      <div className="relative w-full max-w-[390px] bg-white rounded-t-[20px] p-6 shadow-2xl z-10 max-h-[85vh] overflow-y-auto hide-scrollbar animate-in slide-in-from-bottom duration-200">
        <div className="w-12 h-1.5 bg-[#E3DDCF] rounded-full mx-auto mb-5" />

        <div className="flex items-center justify-between mb-4">
          <h3 className="font-heading font-bold text-[18px] text-[#0B3D2E]">
            What do these states mean?
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="w-8 h-8 rounded-full bg-[#FAF7F0] flex items-center justify-center text-[#4F5F57] hover:bg-[#EFEAE0]"
          >
            <Icon name="x" size={18} />
          </button>
        </div>

        <p className="text-[14px] text-[#4F5F57] mb-5 leading-relaxed">
          Every amount in Adashenmu is in one clear, named state with a badge and an icon—never colour alone.
        </p>

        <div className="space-y-4">
          {statesList.map((state) => {
            const meta = moneyStateMeta[state];
            return (
              <div
                key={state}
                className="p-3.5 rounded-[12px] border border-[#E3DDCF] bg-[#FAF7F0]/60 flex flex-col gap-1.5"
              >
                <div className="flex items-center justify-between">
                  <MoneyStateBadge state={state} />
                </div>
                <p className="text-[13px] text-[#4F5F57] leading-snug pt-0.5">
                  {meta.meaning}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-6 pt-3 border-t border-[#E3DDCF]">
          <button
            type="button"
            onClick={onClose}
            className="w-full h-[48px] rounded-[14px] bg-[#0F8A5F] active:bg-[#0B6E4B] text-white font-semibold text-[15px] cursor-pointer"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
