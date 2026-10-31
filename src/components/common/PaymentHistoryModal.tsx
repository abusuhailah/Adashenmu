import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { MoneyStateBadge } from './MoneyStateBadge';
import { Icon } from './Icon';
import { formatNaira, PaymentProof } from '../../data/types';

interface PaymentHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PaymentHistoryModal: React.FC<PaymentHistoryModalProps> = ({ isOpen, onClose }) => {
  const { memberPaymentHistory } = useApp();
  const { language } = useLanguage();
  const [selectedProof, setSelectedProof] = useState<PaymentProof | null>(null);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-200">
      <div
        className="w-full max-w-[460px] bg-white rounded-t-[28px] sm:rounded-[24px] p-6 shadow-2xl border border-[#E3DDCF] max-h-[88vh] overflow-y-auto space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#EFEAE0]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#E3F4EC] text-[#0F8A5F] flex items-center justify-center shrink-0">
              <Icon name="history" size={20} strokeWidth={2.2} />
            </div>
            <div>
              <h3 className="font-heading font-bold text-[18px] text-[#0B3D2E]">
                {language === 'ha' ? 'Tarihin Biyan Kuɗi & Shaida' : 'Payment History & Proofs'}
              </h3>
              <p className="text-[12px] text-[#4F5F57]">
                {language === 'ha'
                  ? 'Dukkan gudunmawarku tare da rasit na shaidar biya'
                  : 'All your past contributions with attached transfer receipts'}
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

        {/* Payment History List */}
        <div className="space-y-3 pt-1">
          {memberPaymentHistory.length === 0 ? (
            <div className="py-8 text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-[#FAF7F0] text-[#8A968F] flex items-center justify-center mx-auto mb-2 border border-[#E3DDCF]">
                <Icon name="wallet" size={22} strokeWidth={2} />
              </div>
              <p className="font-heading font-bold text-[15px] text-[#0B3D2E]">
                {language === 'ha' ? 'Babu tarihin biya tukuna' : 'No Payments Recorded Yet'}
              </p>
              <p className="text-[12px] text-[#4F5F57] max-w-[260px] mx-auto leading-relaxed">
                {language === 'ha'
                  ? 'Duk lokacin da kuka biya kuɗin adashe ta hanyar banki kuka ɗora shaidar biya, za a ajiye ta a nan.'
                  : 'Whenever you transfer a contribution and attach proof, your payment records and receipts will be archived here.'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-[#EFEAE0] bg-white rounded-[16px] border border-[#E3DDCF] overflow-hidden">
              {memberPaymentHistory.map((item) => (
                <div key={item.id} className="p-3.5 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-heading font-bold text-[15px] text-[#0B3D2E] block">
                        {item.groupName}
                      </span>
                      <span className="text-[12px] text-[#4F5F57] block">
                        {item.date}
                      </span>
                    </div>

                    <div className="text-right flex flex-col items-end gap-1">
                      <span className="font-heading font-extrabold text-[15px] text-[#0B3D2E]">
                        {formatNaira(item.amount)}
                      </span>
                      <MoneyStateBadge state={item.state} />
                    </div>
                  </div>

                  {/* Proof details row */}
                  {item.proof && (
                    <div className="p-2.5 rounded-[10px] bg-[#FAF7F0] border border-[#E3DDCF] flex items-center justify-between text-[12px]">
                      <div className="flex items-center gap-2 truncate">
                        <Icon name="document" size={15} className="text-[#0F8A5F] shrink-0" />
                        <span className="truncate font-mono text-[#0B3D2E]">
                          {item.proof.referenceNumber
                            ? `Ref: ${item.proof.referenceNumber}`
                            : 'Receipt Attached'}
                        </span>
                      </div>

                      {item.proof.receiptUrl ? (
                        <button
                          type="button"
                          onClick={() => setSelectedProof(item.proof!)}
                          className="text-[#0F8A5F] font-bold underline cursor-pointer shrink-0 ml-2"
                        >
                          {language === 'ha' ? 'Duba Rasit' : 'View Receipt'}
                        </button>
                      ) : (
                        <span className="text-[#8A968F] font-semibold">Bank Transfer</span>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="w-full h-11 rounded-[14px] bg-[#0F8A5F] text-white font-heading font-bold text-[14px] cursor-pointer hover:brightness-105 transition-all"
        >
          {language === 'ha' ? 'Rufe' : 'Close'}
        </button>
      </div>

      {/* Nested Receipt Viewer */}
      {selectedProof && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="bg-white rounded-[20px] p-5 max-w-[360px] w-full shadow-2xl space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#EFEAE0]">
              <h4 className="font-heading font-bold text-[15px] text-[#0B3D2E]">
                Transfer Receipt
              </h4>
              <button
                type="button"
                onClick={() => setSelectedProof(null)}
                className="text-[#8A968F] hover:text-[#0B3D2E] font-bold text-[18px]"
              >
                ✕
              </button>
            </div>

            {selectedProof.receiptUrl && (
              <img
                src={selectedProof.receiptUrl}
                alt="Receipt"
                className="w-full max-h-[320px] object-contain rounded-[12px] border border-[#E3DDCF]"
              />
            )}

            {selectedProof.referenceNumber && (
              <div className="p-2.5 rounded-[10px] bg-[#FAF7F0] border border-[#E3DDCF] text-[12px]">
                <span className="text-[#4F5F57] block">Transaction Reference:</span>
                <span className="font-mono font-bold text-[#0B3D2E]">{selectedProof.referenceNumber}</span>
              </div>
            )}

            <button
              type="button"
              onClick={() => setSelectedProof(null)}
              className="w-full h-10 rounded-[10px] bg-[#0F8A5F] text-white font-bold text-[13px]"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
