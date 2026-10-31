import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../i18n/LanguageContext';
import { StatusBar } from '../components/common/StatusBar';
import { TopBar } from '../components/common/TopBar';
import { Avatar } from '../components/common/Avatar';
import { MoneyStateBadge } from '../components/common/MoneyStateBadge';
import { Icon } from '../components/common/Icon';
import { formatNaira, PaymentProof } from '../data/types';

export const M06GroupLedger: React.FC = () => {
  const {
    navigate,
    groups,
    activeGroup,
    currentUser,
    confirmMemberPayment,
    releaseMemberPayout,
    confirmPayoutReceived,
    requestGroupDeletion,
    approveGroupDeletion,
    executeGroupDeletion,
    groupActiveTab,
    setGroupActiveTab,
    showToast,
  } = useApp();
  const { language, t } = useLanguage();

  const [selectedProof, setSelectedProof] = useState<PaymentProof | null>(null);
  const [showPayoutModal, setShowPayoutModal] = useState(false);
  const [payoutReceiptImage, setPayoutReceiptImage] = useState<string | null>(null);
  const [payoutRef, setPayoutRef] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Identify group from route or activeGroup
  const targetGroup = activeGroup || groups[0] || null;

  if (!targetGroup) {
    return (
      <div className="flex-1 bg-[#FAF7F0] flex flex-col justify-between overflow-y-auto">
        <StatusBar mode="light" />
        <TopBar title={t('ledger')} onBack={() => navigate('/groups')} showBack={true} />
        <div className="p-6 text-center space-y-4 my-auto">
          <h3 className="font-heading font-bold text-[18px] text-[#0B3D2E]">
            {language === 'ha' ? 'Ba a sami ƙungiya ba' : 'No Group Selected'}
          </h3>
          <button
            type="button"
            onClick={() => navigate('/groups')}
            className="px-6 py-2.5 rounded-[12px] bg-[#0F8A5F] text-white font-bold text-[14px]"
          >
            {language === 'ha' ? 'Duba Ƙungiyoyi' : 'View My Groups'}
          </button>
        </div>
      </div>
    );
  }

  const isOrganiser = targetGroup.organiserId === currentUser.id;
  const members = targetGroup.members || [];
  const size = targetGroup.rules.size;
  const amount = targetGroup.rules.amount;
  const totalPayout = amount * size;
  const cycle = targetGroup.currentCycle || {
    number: 1,
    of: size,
    month: 'Cycle 1',
    dueDate: targetGroup.rules.dueDay,
    payoutDate: targetGroup.rules.startDate || '',
    payoutTo: targetGroup.members?.[0]?.name || 'Organiser',
    payoutToMemberId: targetGroup.members?.[0]?.id || targetGroup.organiserId,
    contributions: [],
    summary: { inThePot: 0, confirming: 0, pending: size, potTotal: 0, target: totalPayout },
  };

  const walletBalance = targetGroup.wallet?.balanceThisCycle || 0;
  const inPotPercent = Math.min(100, Math.round(((cycle.inThePotCount || 0) / size) * 100));

  // Pending payments awaiting organiser confirmation
  const pendingConfirmations = (cycle.contributions || []).filter((c) => c.state === 'confirming');

  // Find whose turn it is currently for payout
  const currentTurnNumber = cycle.number;
  const currentPayoutTurn = (targetGroup.payoutCalendar || []).find((t) => t.turn === currentTurnNumber);
  const recipientMember = members.find((m) => m.id === currentPayoutTurn?.memberId);
  const isTurnRecipient = currentPayoutTurn?.memberId === currentUser.id;
  const isPayoutPendingConfirmation = currentPayoutTurn?.status === 'pending_member_confirmation';

  const handleConfirmPayment = async (c: any) => {
    setIsProcessing(true);
    try {
      await confirmMemberPayment(targetGroup.id, c.memberId, c.memberName || 'Member', c.amount);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReleasePayoutSubmit = async () => {
    if (!recipientMember) return;
    setIsProcessing(true);
    try {
      const proof: PaymentProof = {
        attachedAt: new Date().toISOString(),
        receiptUrl: payoutReceiptImage || undefined,
        referenceNumber: payoutRef.trim() || undefined,
      };

      await releaseMemberPayout(
        targetGroup.id,
        currentTurnNumber,
        recipientMember.id,
        recipientMember.name,
        totalPayout,
        proof
      );

      setShowPayoutModal(false);
      setPayoutReceiptImage(null);
      setPayoutRef('');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirmPayoutReceivedSubmit = async () => {
    setIsProcessing(true);
    try {
      await confirmPayoutReceived(targetGroup.id, currentTurnNumber, totalPayout);
    } finally {
      setIsProcessing(false);
    }
  };

  const deletionReq = targetGroup.deletionRequest;
  const acceptedMemberIds = deletionReq?.acceptedMemberIds || [];
  const acceptedCount = acceptedMemberIds.length;
  const totalMembersRequired = deletionReq?.totalMembersCount || members.length || 1;
  const hasCurrentUserAccepted = !!(deletionReq && acceptedMemberIds.includes(currentUser.id));
  const isAllApproved = !!(deletionReq && acceptedCount >= totalMembersRequired);

  const handleRequestDeletion = async () => {
    const confirmMsg =
      language === 'ha'
        ? 'Kuna so ku tura buƙatar rufe ƙungiya da goge ta zuwa ga dukkan mambobi?'
        : 'Send group closure and deletion request to all members?';
    if (window.confirm(confirmMsg)) {
      setIsProcessing(true);
      try {
        await requestGroupDeletion(targetGroup.id);
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const handleApproveDeletion = async () => {
    setIsProcessing(true);
    try {
      await approveGroupDeletion(targetGroup.id);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleExecuteDeletion = async () => {
    const confirmMsg =
      language === 'ha'
        ? 'Dukkan mambobi sun amince. Kuna tabbatar da goge wannan ƙungiya kwata-kwata?'
        : 'All members have approved! Are you sure you want to permanently delete this group?';
    if (window.confirm(confirmMsg)) {
      setIsProcessing(true);
      try {
        await executeGroupDeletion(targetGroup.id);
      } finally {
        setIsProcessing(false);
      }
    }
  };

  return (
    <div className="flex-1 bg-[#FAF7F0] flex flex-col justify-between overflow-hidden">
      <div className="flex-1 overflow-y-auto hide-scrollbar">
        <StatusBar mode="light" />
        <TopBar
          title={targetGroup.name}
          onBack={() => navigate('/groups')}
          showBack={true}
        />

        {/* GROUP DELETION CONSENT BANNER */}
        {deletionReq && (
          <div className="mx-5 my-2 p-4 rounded-[16px] bg-[#FEF3F2] border-2 border-[#D92D20] shadow-sm space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#D92D20]">
                <Icon name="alert" size={18} strokeWidth={2.4} />
                <span className="font-heading font-bold text-[14px]">
                  {language === 'ha' ? 'Buƙatar Goge Ƙungiya' : 'Group Deletion Requested'}
                </span>
              </div>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#FEE4E2] text-[#B42318]">
                {acceptedCount} / {totalMembersRequired} Accepted
              </span>
            </div>

            <p className="text-[12px] text-[#4F5F57] leading-relaxed">
              {language === 'ha'
                ? 'Mai shirya ya nemi a rufe wannan ƙungiya domin an kammala zangunan adashe. Dukkan mambobi dole su amince kafin a goge ƙungiyar.'
                : 'The organizer has requested group closure. Unanimous consent required: all members must accept before this group can be deleted.'}
            </p>

            {/* Member View: Approve button */}
            {!isOrganiser && (
              <div>
                {hasCurrentUserAccepted ? (
                  <div className="flex items-center gap-2 text-[12px] font-bold text-[#0F8A5F] bg-[#E3F4EC] p-2.5 rounded-[10px]">
                    <Icon name="check" size={15} strokeWidth={2.5} />
                    <span>
                      {language === 'ha'
                        ? 'Kun riga kun amince da goge ƙungiya. Ana jiran sauran mambobi.'
                        : 'You have approved group deletion. Waiting for remaining members.'}
                    </span>
                  </div>
                ) : (
                  <button
                    type="button"
                    disabled={isProcessing}
                    onClick={handleApproveDeletion}
                    className="w-full h-10 rounded-[10px] bg-[#D92D20] text-white font-bold text-[13px] shadow-sm hover:brightness-105 cursor-pointer disabled:opacity-50"
                  >
                    {isProcessing
                      ? 'Approving…'
                      : language === 'ha'
                      ? 'Na Amince da Rufe / Goge Ƙungiyar'
                      : 'I Confirm & Accept Group Deletion'}
                  </button>
                )}
              </div>
            )}

            {/* Organizer View: Progress & Delete Button */}
            {isOrganiser && (
              <div className="space-y-2 pt-1">
                {isAllApproved ? (
                  <div className="space-y-2">
                    <p className="text-[12px] font-bold text-[#0B6E4B] flex items-center gap-1.5">
                      <Icon name="check" size={14} strokeWidth={2.5} />
                      {language === 'ha'
                        ? 'Dukkan mambobi sun amince! Maɓallin gogewa yanzu yana aiki.'
                        : 'All members have approved! You can now permanently delete this group.'}
                    </p>
                    <button
                      type="button"
                      disabled={isProcessing}
                      onClick={handleExecuteDeletion}
                      className="w-full h-11 rounded-[12px] bg-[#D92D20] hover:bg-[#B42318] text-white font-bold text-[14px] shadow-md cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      <Icon name="trash" size={16} strokeWidth={2.5} />
                      <span>{isProcessing ? 'Deleting Group…' : 'Permanently Delete Group'}</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    <div className="w-full h-2 rounded-full bg-[#FEE4E2] overflow-hidden">
                      <div
                        style={{ width: `${Math.round((acceptedCount / totalMembersRequired) * 100)}%` }}
                        className="h-full bg-[#D92D20] rounded-full transition-all duration-300"
                      />
                    </div>
                    <button
                      type="button"
                      disabled={true}
                      className="w-full h-10 rounded-[10px] bg-[#F2F4F7] text-[#98A2B3] font-bold text-[13px] border border-[#EAECF0] cursor-not-allowed"
                    >
                      {language === 'ha'
                        ? `Ana Jiran Mambobi (${acceptedCount}/${totalMembersRequired})`
                        : `Awaiting Member Consent (${acceptedCount}/${totalMembersRequired})`}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Segmented control tabs */}
        <div className="px-5 py-2">
          <div className="h-10 p-1 rounded-full bg-[#EFEAE0] flex items-center justify-between text-[13px] font-semibold text-[#4F5F57]">
            <button
              type="button"
              onClick={() => {
                setGroupActiveTab('ledger');
                navigate(`/groups/${targetGroup.id}/ledger`);
              }}
              className={`flex-1 h-full rounded-full transition-all cursor-pointer ${
                groupActiveTab === 'ledger'
                  ? 'bg-white text-[#0B3D2E] shadow-sm font-bold'
                  : 'hover:text-[#0B3D2E]'
              }`}
            >
              {t('ledger')}
            </button>
            <button
              type="button"
              onClick={() => {
                setGroupActiveTab('calendar');
                navigate(`/groups/${targetGroup.id}/calendar`);
              }}
              className={`flex-1 h-full rounded-full transition-all cursor-pointer ${
                groupActiveTab === 'calendar'
                  ? 'bg-white text-[#0B3D2E] shadow-sm font-bold'
                  : 'hover:text-[#0B3D2E]'
              }`}
            >
              {t('payoutCalendar')}
            </button>
            <button
              type="button"
              onClick={() => {
                setGroupActiveTab('rules');
                navigate(`/groups/${targetGroup.id}/rules`);
              }}
              className={`flex-1 h-full rounded-full transition-all cursor-pointer ${
                groupActiveTab === 'rules'
                  ? 'bg-white text-[#0B3D2E] shadow-sm font-bold'
                  : 'hover:text-[#0B3D2E]'
              }`}
            >
              {t('rules')}
            </button>
          </div>
        </div>

        {/* TAB 1: RULES VIEW */}
        {groupActiveTab === 'rules' && (
          <div className="px-5 py-3 space-y-4">
            <div className="bg-white rounded-[16px] p-5 border border-[#E3DDCF] shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-[#EFEAE0]">
                <h3 className="font-heading font-bold text-[18px] text-[#0B3D2E]">
                  {t('agreedRulesTitle')}
                </h3>
                <span
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                    isOrganiser ? 'bg-[#E3F4EC] text-[#0B6E4B]' : 'bg-[#EBF3FB] text-[#1E5D88]'
                  }`}
                >
                  {isOrganiser ? 'You are Organiser' : 'You are Member'}
                </span>
              </div>

              {!isOrganiser && (
                <div className="p-3 rounded-[12px] bg-[#EBF3FB] text-[#1E5D88] text-[12px] flex items-start gap-2">
                  <Icon name="info" size={15} className="shrink-0 mt-0.5" />
                  <span>
                    {language === 'ha'
                      ? 'Kuna matsayin mamba. Dokokin ƙungiya da asusun karɓar kuɗi suna hannun mai shirya ƙungiya.'
                      : 'You joined as a member. Group rules and payment receiving account details are managed solely by the organiser.'}
                  </span>
                </div>
              )}

              <div className="space-y-3 text-[14px]">
                <div className="flex justify-between py-1.5 border-b border-[#EFEAE0]">
                  <span className="text-[#4F5F57]">{t('ruleContribution')}</span>
                  <span className="font-semibold text-[#0B3D2E]">{formatNaira(amount)} {targetGroup.rules.frequency}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-[#EFEAE0]">
                  <span className="text-[#4F5F57]">{t('ruleDueDay')}</span>
                  <span className="font-semibold text-[#0B3D2E]">{targetGroup.rules.dueDay}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-[#EFEAE0]">
                  <span className="text-[#4F5F57]">{t('ruleGroupSize')}</span>
                  <span className="font-semibold text-[#0B3D2E]">{size} members</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-[#EFEAE0]">
                  <span className="text-[#4F5F57]">{t('ruleTotalPayout')}</span>
                  <span className="font-semibold text-[#0F8A5F]">{formatNaira(totalPayout)}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-[#EFEAE0]">
                  <span className="text-[#4F5F57]">{language === 'ha' ? 'Asusun Mai Shirya' : 'Organiser Account'}</span>
                  <span className="font-semibold text-[#0B3D2E]">
                    {targetGroup.organiserAccount?.bankName} ({targetGroup.organiserAccount?.accountNumber})
                  </span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-[#EFEAE0]">
                  <span className="text-[#4F5F57]">{t('ruleLatePayment')}</span>
                  <span className="font-semibold text-[#B42318]">
                    {targetGroup.rules.lateRule.graceDays} days grace, then {formatNaira(targetGroup.rules.lateRule.feeAmount)} fee
                  </span>
                </div>
              </div>
            </div>

            {/* Organiser Group Lifecycle Management */}
            {isOrganiser && (
              <div className="bg-white rounded-[16px] p-5 border border-[#E3DDCF] shadow-sm space-y-3">
                <div className="flex items-center gap-2">
                  <Icon name="shield" size={18} className="text-[#0B3D2E]" />
                  <h4 className="font-heading font-bold text-[15px] text-[#0B3D2E]">
                    {language === 'ha' ? 'Rufe da Goge Ƙungiya' : 'Group Closure & Deletion'}
                  </h4>
                </div>

                <p className="text-[12px] text-[#4F5F57] leading-relaxed">
                  {language === 'ha'
                    ? 'Bayan an kammala dukkan zangunan adashe ko lokacin rufe ƙungiya, za ku iya aike da buƙatar gogewa. Dukkan mambobi dole su amince kafin maɓallin gogewa ya kunna.'
                    : 'After all rotation cycles are completed or when closing this group, you can initiate a deletion request. All members must approve before the group can be permanently removed.'}
                </p>

                {!deletionReq ? (
                  <button
                    type="button"
                    disabled={isProcessing}
                    onClick={handleRequestDeletion}
                    className="w-full h-11 rounded-[12px] bg-[#FEF3F2] border border-[#FECDCA] text-[#D92D20] font-bold text-[13px] hover:bg-[#D92D20] hover:text-white transition-colors cursor-pointer"
                  >
                    {language === 'ha' ? 'Aika Buƙatar Goge Ƙungiya' : 'Request Group Closure & Deletion'}
                  </button>
                ) : (
                  <div className="p-3 rounded-[12px] bg-[#FAF7F0] border border-[#E3DDCF] text-[12px] space-y-2">
                    <div className="flex justify-between font-semibold">
                      <span>Approval Progress:</span>
                      <span className="text-[#D92D20]">{acceptedCount} of {totalMembersRequired} members</span>
                    </div>
                    {isAllApproved ? (
                      <button
                        type="button"
                        disabled={isProcessing}
                        onClick={handleExecuteDeletion}
                        className="w-full h-11 rounded-[12px] bg-[#D92D20] text-white font-bold text-[13px] cursor-pointer shadow-sm hover:brightness-105"
                      >
                        {isProcessing ? 'Deleting…' : 'Permanently Delete Group'}
                      </button>
                    ) : (
                      <span className="text-[#4F5F57] block italic">
                        {language === 'ha'
                          ? 'Ana jiran sauran mambobi su amince kafin a goge.'
                          : 'Waiting for all members to approve before deletion button activates.'}
                      </span>
                    )}
                  </div>
                )}
              </div>
            )}

            <button
              type="button"
              onClick={() => {
                setGroupActiveTab('ledger');
                navigate(`/groups/${targetGroup.id}/ledger`);
              }}
              className="w-full h-[48px] rounded-[14px] bg-white border border-[#E3DDCF] font-semibold text-[#0B3D2E] text-[14px] cursor-pointer"
            >
              {t('backToLedger')}
            </button>
          </div>
        )}

        {/* TAB 2: LEDGER VIEW */}
        {groupActiveTab === 'ledger' && (
          <div className="px-5 space-y-4 pb-6 pt-1">
            {/* ACTION BANNER 1: PENDING PAYMENTS FOR ORGANISER TO CONFIRM */}
            {isOrganiser && pendingConfirmations.length > 0 && (
              <div className="p-4 rounded-[16px] bg-[#FFF4DB] border border-[#F2B33D] shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[#8A5A00]">
                    <Icon name="clock" size={18} strokeWidth={2.4} />
                    <span className="font-heading font-bold text-[14px]">
                      {language === 'ha'
                        ? `Biyan Kuɗi ${pendingConfirmations.length} Na Neman Tabbatarwa`
                        : `${pendingConfirmations.length} Payment(s) Awaiting Your Confirmation`}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold bg-[#8A5A00] text-white px-2 py-0.5 rounded-full">
                    Action Required
                  </span>
                </div>

                <div className="space-y-2">
                  {pendingConfirmations.map((c, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-[12px] bg-white border border-[#F2B33D]/40 flex items-center justify-between gap-3 shadow-xs"
                    >
                      <div>
                        <span className="font-bold text-[14px] text-[#0B3D2E] block">
                          {c.memberName || 'Member'}
                        </span>
                        <div className="flex items-center gap-2 text-[12px] text-[#4F5F57] mt-0.5">
                          <span className="font-semibold text-[#0B6E4B]">{formatNaira(c.amount)}</span>
                          <span>·</span>
                          {c.proof?.receiptUrl ? (
                            <button
                              type="button"
                              onClick={() => setSelectedProof(c.proof!)}
                              className="text-[#0F8A5F] underline font-bold cursor-pointer"
                            >
                              View Receipt
                            </button>
                          ) : c.proof?.referenceNumber ? (
                            <span className="font-mono text-[11px]">Ref: {c.proof.referenceNumber}</span>
                          ) : (
                            <span>Bank Transfer</span>
                          )}
                        </div>
                      </div>

                      <button
                        type="button"
                        disabled={isProcessing}
                        onClick={() => handleConfirmPayment(c)}
                        className="px-3 py-1.5 rounded-[9px] bg-[#0F8A5F] active:bg-[#0B6E4B] text-white font-bold text-[12px] shadow-sm hover:brightness-105 cursor-pointer disabled:opacity-50"
                      >
                        {language === 'ha' ? 'Tabbatar da Biya' : 'Confirm & Mark Paid'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ACTION BANNER 2: PAYOUT RELEASED -> WAITING FOR RECIPIENT MEMBER CONFIRMATION */}
            {isTurnRecipient && isPayoutPendingConfirmation && (
              <div className="p-4.5 rounded-[16px] bg-[#E3F4EC] border-2 border-[#0F8A5F] shadow-md space-y-3">
                <div className="flex items-center gap-2.5 text-[#0F8A5F]">
                  <Icon name="check" size={20} strokeWidth={2.5} />
                  <span className="font-heading font-extrabold text-[16px] text-[#0B3D2E]">
                    🎉 {language === 'ha' ? 'An Tura Muku Kuɗin Rabo!' : 'Your Payout Has Been Transferred!'}
                  </span>
                </div>
                <p className="text-[13px] text-[#4F5F57] leading-relaxed">
                  {language === 'ha'
                    ? `Mai shirya ya tura ${formatNaira(totalPayout)} zuwa asusun bankinku. Da fatan za a duba asusun ku kuma ku danna domin tabbatar da karɓa.`
                    : `The organiser transferred your ${formatNaira(totalPayout)} pot to your bank account. Please check your bank and confirm receipt.`}
                </p>

                {currentPayoutTurn?.payoutProof?.receiptUrl && (
                  <button
                    type="button"
                    onClick={() => setSelectedProof(currentPayoutTurn.payoutProof!)}
                    className="text-[12px] font-bold text-[#0F8A5F] underline block"
                  >
                    View Organiser Transfer Receipt
                  </button>
                )}

                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={handleConfirmPayoutReceivedSubmit}
                  className="w-full h-11 rounded-[12px] bg-[#0F8A5F] active:bg-[#0B6E4B] text-white font-bold text-[14px] cursor-pointer shadow-sm hover:brightness-105 transition-all"
                >
                  {language === 'ha' ? 'Na Karɓi Kuɗin Rabona (Confirm Received)' : 'I Have Received My Payout'}
                </button>
              </div>
            )}

            {/* ACTION BANNER 3: ORGANISER READY TO PAY OUT CURRENT TURN */}
            {isOrganiser && !isPayoutPendingConfirmation && currentPayoutTurn?.status !== 'collected' && (
              <div className="p-4 rounded-[16px] bg-white border border-[#E3DDCF] shadow-sm flex items-center justify-between gap-3">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#4F5F57] block">
                    Next Payout in Rotation
                  </span>
                  <span className="font-heading font-bold text-[16px] text-[#0B3D2E] block mt-0.5">
                    {recipientMember?.name || cycle.payoutTo} · {formatNaira(totalPayout)}
                  </span>
                  <span className="text-[12px] text-[#4F5F57] block mt-0.5">
                    {recipientMember?.payoutAccount
                      ? `${recipientMember.payoutAccount.bankName} (${recipientMember.payoutAccount.accountNumber})`
                      : 'Payout account added on join'}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setShowPayoutModal(true)}
                  className="px-3.5 py-2 rounded-[10px] bg-[#0F8A5F] text-white font-bold text-[13px] shadow-sm hover:brightness-105 cursor-pointer whitespace-nowrap"
                >
                  {language === 'ha' ? 'Yi Rabo' : 'Make Payout'}
                </button>
              </div>
            )}

            {/* Main Pot Overview Card */}
            <div className="bg-[#0B3D2E] text-white rounded-[16px] p-5 shadow-md">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#2FBF85]">
                  {language === 'ha' ? 'Zango' : 'Cycle'} {cycle.number} {language === 'ha' ? 'cikin' : 'of'} {size}
                </span>
                <span className="text-[10px] font-mono bg-[#072A20] px-2 py-0.5 rounded text-[#2FBF85] border border-[#2FBF85]/30">
                  {targetGroup.code || 'ADASHE'}
                </span>
              </div>

              <div className="flex items-baseline gap-2 mb-3">
                <span className="font-heading font-extrabold text-[32px] text-white">
                  {formatNaira(walletBalance)}
                </span>
                <span className="text-[15px] font-semibold text-[#2FBF85]">
                  of {formatNaira(totalPayout)}
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2 rounded-full bg-[#072A20] overflow-hidden mb-3">
                <div
                  style={{ width: `${inPotPercent}%` }}
                  className="h-full bg-[#2FBF85] rounded-full transition-all duration-500"
                />
              </div>

              <div className="flex items-center justify-between text-[12px] text-white/80 pt-1 border-t border-white/10">
                <span>{cycle.inThePotCount || 0} of {size} confirmed paid</span>
                <span>Due: {targetGroup.rules.dueDay}</span>
              </div>
            </div>

            {/* Members & Contributions List */}
            <div className="bg-white rounded-[16px] border border-[#E3DDCF] shadow-sm overflow-hidden">
              <div className="px-4 py-3 bg-[#FAF7F0] border-b border-[#E3DDCF] flex items-center justify-between text-[13px]">
                <span className="font-bold text-[#0B3D2E]">
                  {language === 'ha' ? 'Mambobin Ƙungiya' : 'Group Members & Payment Status'}
                </span>
                <span className="font-semibold text-[#0F8A5F]">
                  {members.length} / {size}
                </span>
              </div>

              <div className="divide-y divide-[#EFEAE0]">
                {members.map((m, idx) => {
                  const mContrib = (cycle.contributions || []).find((c) => c.memberId === m.id);
                  const isPaid = mContrib?.state === 'inThePot';
                  const isConfirming = mContrib?.state === 'confirming';

                  return (
                    <div key={m.id || idx} className="p-3.5 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar initials={m.initials} color={m.avatarColor} size={38} />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-heading font-bold text-[14px] text-[#0B3D2E]">
                              {m.name}
                            </span>
                            {m.role === 'Organiser' && (
                              <span className="text-[9px] font-bold bg-[#E3F4EC] text-[#0B6E4B] px-1.5 py-0.2 rounded">
                                Organiser
                              </span>
                            )}
                          </div>
                          <span className="text-[12px] text-[#4F5F57] block mt-0.5">
                            {m.payoutAccount
                              ? `${m.payoutAccount.bankName} (${m.payoutAccount.accountNumber.slice(-4)})`
                              : `${formatNaira(amount)} per cycle`}
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        {isPaid ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#0B6E4B] bg-[#E3F4EC] px-2.5 py-1 rounded-full">
                            <Icon name="check" size={12} strokeWidth={2.5} />
                            Paid
                          </span>
                        ) : isConfirming ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#8A5A00] bg-[#FFF4DB] px-2.5 py-1 rounded-full">
                            <Icon name="clock" size={12} strokeWidth={2.2} />
                            Confirming
                          </span>
                        ) : (
                          <span className="inline-flex items-center text-[11px] font-medium text-[#8A968F] bg-[#FAF7F0] border border-[#E3DDCF] px-2.5 py-1 rounded-full">
                            Pending
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Share Invite Banner */}
            <div className="p-4 rounded-[16px] bg-white border border-[#E3DDCF] shadow-sm flex items-center justify-between">
              <div>
                <h4 className="font-heading font-bold text-[14px] text-[#0B3D2E]">
                  {language === 'ha' ? 'Gayyaci ƙarin mambobi' : 'Invite more members'}
                </h4>
                <p className="text-[12px] text-[#4F5F57] mt-0.5">
                  Code: <strong className="font-mono text-[#0B3D2E]">{targetGroup.code}</strong>
                </p>
              </div>
              <button
                type="button"
                onClick={() => navigate('/groups/invite')}
                className="px-3.5 py-2 rounded-[10px] bg-[#E3F4EC] text-[#0F8A5F] font-bold text-[13px] hover:bg-[#0F8A5F] hover:text-white transition-colors cursor-pointer"
              >
                {language === 'ha' ? 'Duba Mahada' : 'Share Link'}
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: CALENDAR VIEW */}
        {groupActiveTab === 'calendar' && (
          <div className="px-5 space-y-3.5 pb-6 pt-1">
            <div className="p-3.5 rounded-[14px] bg-white border border-[#E3DDCF] flex items-start gap-2.5 shadow-sm">
              <Icon name="calendar" size={18} className="text-[#0F8A5F] mt-0.5 shrink-0" />
              <p className="text-[13px] text-[#0B3D2E] leading-snug">
                {language === 'ha'
                  ? 'Kowanne mamba yana da juyinsa a kalandar rabo. Mai shirya zai tura rabo sannan mamba ya tabbatar.'
                  : 'Transparent rotation schedule. The organiser releases the payout on the turn date, and the recipient confirms receipt.'}
              </p>
            </div>

            {/* Turns list */}
            <div className="bg-white rounded-[16px] border border-[#E3DDCF] shadow-sm overflow-hidden divide-y divide-[#EFEAE0]">
              {(targetGroup.payoutCalendar || []).map((tRow) => {
                const isCurrentTurn = tRow.turn === cycle.number;
                const isCollected = tRow.status === 'collected';
                const isPendingConf = tRow.status === 'pending_member_confirmation';

                return (
                  <div key={tRow.turn} className="p-3.5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-mono font-bold text-[13px] ${
                          isCollected
                            ? 'bg-[#E3F4EC] text-[#0F8A5F]'
                            : isCurrentTurn
                            ? 'bg-[#0F8A5F] text-white shadow-sm'
                            : 'bg-[#FAF7F0] text-[#4F5F57] border border-[#E3DDCF]'
                        }`}
                      >
                        {tRow.turn}
                      </div>

                      <div>
                        <span className="font-heading font-bold text-[14px] text-[#0B3D2E] block">
                          {tRow.memberName || `Turn #${tRow.turn}`}
                        </span>
                        <span className="text-[12px] text-[#4F5F57] block mt-0.5">
                          {tRow.date} · {formatNaira(tRow.amount)}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      {isCollected ? (
                        <span className="text-[11px] font-bold text-[#0B6E4B] bg-[#E3F4EC] px-2 py-0.5 rounded-full">
                          Collected
                        </span>
                      ) : isPendingConf ? (
                        <span className="text-[11px] font-bold text-[#8A5A00] bg-[#FFF4DB] px-2 py-0.5 rounded-full">
                          Awaiting Member Conf.
                        </span>
                      ) : isCurrentTurn ? (
                        <span className="text-[11px] font-bold text-white bg-[#0F8A5F] px-2.5 py-0.5 rounded-full shadow-xs">
                          Current Turn
                        </span>
                      ) : (
                        <span className="text-[11px] font-medium text-[#8A968F]">
                          Upcoming
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* VIEW PROOF MODAL */}
      {selectedProof && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-[20px] p-5 max-w-[360px] w-full shadow-2xl border border-[#E3DDCF] space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#EFEAE0]">
              <h3 className="font-heading font-bold text-[16px] text-[#0B3D2E]">
                Proof of Payment
              </h3>
              <button
                type="button"
                onClick={() => setSelectedProof(null)}
                className="text-[#8A968F] hover:text-[#0B3D2E] font-bold text-[18px]"
              >
                ✕
              </button>
            </div>

            {selectedProof.receiptUrl ? (
              <img
                src={selectedProof.receiptUrl}
                alt="Receipt Proof"
                className="w-full max-h-[300px] object-contain rounded-[12px] border border-[#E3DDCF]"
              />
            ) : null}

            {selectedProof.referenceNumber && (
              <div className="p-3 rounded-[10px] bg-[#FAF7F0] border border-[#E3DDCF] text-[13px]">
                <span className="text-[#4F5F57] block">Transaction Reference:</span>
                <span className="font-mono font-bold text-[#0B3D2E]">{selectedProof.referenceNumber}</span>
              </div>
            )}

            <button
              type="button"
              onClick={() => setSelectedProof(null)}
              className="w-full h-11 rounded-[12px] bg-[#0F8A5F] text-white font-bold text-[14px]"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* ORGANISER MAKE PAYOUT MODAL */}
      {showPayoutModal && recipientMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-[20px] p-5 max-w-[380px] w-full shadow-2xl border border-[#E3DDCF] space-y-3.5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-[#EFEAE0]">
              <h3 className="font-heading font-bold text-[17px] text-[#0B3D2E]">
                Release Turn Payout
              </h3>
              <button
                type="button"
                onClick={() => setShowPayoutModal(false)}
                className="text-[#8A968F] hover:text-[#0B3D2E] font-bold text-[18px]"
              >
                ✕
              </button>
            </div>

            {/* Recipient Account Details */}
            <div className="p-3.5 rounded-[14px] bg-[#0B3D2E] text-white space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#2FBF85] block">
                Transfer To Member Account
              </span>
              <div className="space-y-1 text-[13px]">
                <div className="flex justify-between">
                  <span className="text-white/70">Recipient:</span>
                  <span className="font-bold">{recipientMember.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Bank:</span>
                  <span className="font-bold">{recipientMember.payoutAccount?.bankName || 'GTBank'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Account Number:</span>
                  <span className="font-mono font-bold text-[#2FBF85]">{recipientMember.payoutAccount?.accountNumber || '0129482110'}</span>
                </div>
                <div className="flex justify-between border-t border-white/10 pt-1">
                  <span className="text-white/70">Amount:</span>
                  <span className="font-heading font-extrabold text-[16px] text-white">{formatNaira(totalPayout)}</span>
                </div>
              </div>
            </div>

            {/* Attach Proof of Payout */}
            <div className="space-y-2">
              <label className="block text-[12px] font-bold text-[#0B3D2E]">
                Attach Proof of Transfer (Screenshot)
              </label>
              {payoutReceiptImage ? (
                <div className="relative rounded-[10px] overflow-hidden border border-[#0F8A5F] p-2 flex items-center justify-between">
                  <span className="text-[12px] font-bold text-[#0F8A5F]">Receipt attached</span>
                  <button
                    type="button"
                    onClick={() => setPayoutReceiptImage(null)}
                    className="text-[12px] text-[#B42318] font-bold"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <label className="border-2 border-dashed border-[#E3DDCF] rounded-[10px] p-3 flex flex-col items-center justify-center text-center cursor-pointer hover:border-[#0F8A5F]">
                  <Icon name="wallet" size={20} className="text-[#0F8A5F] mb-1" />
                  <span className="text-[12px] font-bold text-[#0B3D2E]">Upload Transfer Receipt</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const r = new FileReader();
                        r.onload = () => setPayoutReceiptImage(r.result as string);
                        r.readAsDataURL(file);
                      }
                    }}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            <div>
              <label className="block text-[12px] font-bold text-[#0B3D2E] mb-1">
                Transaction Reference / Note
              </label>
              <input
                type="text"
                value={payoutRef}
                onChange={(e) => setPayoutRef(e.target.value)}
                placeholder="e.g. GTB/TRX/998201 or Reference"
                className="w-full h-10 px-3 rounded-[10px] bg-[#FAF7F0] border border-[#E3DDCF] text-[13px] font-mono"
              />
            </div>

            <div className="pt-2 flex gap-2">
              <button
                type="button"
                onClick={() => setShowPayoutModal(false)}
                className="flex-1 h-11 rounded-[12px] border border-[#E3DDCF] text-[#4F5F57] font-semibold text-[13px]"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isProcessing}
                onClick={handleReleasePayoutSubmit}
                className="flex-1 h-11 rounded-[12px] bg-[#0F8A5F] text-white font-bold text-[13px] shadow-sm hover:brightness-105"
              >
                {isProcessing ? 'Releasing…' : 'Confirm Payout Sent'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
