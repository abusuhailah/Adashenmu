// Adashenmu data model (TypeScript)
export type MoneyState = 'pending' | 'confirming' | 'inThePot' | 'released' | 'late' | 'failed' | 'refunded';
export type TurnStatus = 'collected' | 'next' | 'yourTurn' | 'upcoming' | 'pending_member_confirmation';
export type PayoutOrder = 'fixed' | 'draw' | 'vote';
export type Frequency = 'weekly' | 'monthly';
export type PaymentMethod = 'bankTransfer' | 'card' | 'ussd';
export type Language = 'en' | 'ha';

export interface BankAccountDetails {
  bankName: string;
  accountNumber: string;
  accountName: string;
  bankCode?: string;
}

export interface PaymentProof {
  attachedAt: string;
  receiptUrl?: string; // base64 or image url
  referenceNumber?: string;
  note?: string;
}

export interface Member {
  id: string;
  name: string;
  initials: string;
  avatarColor: 'green' | 'gold' | 'blue' | 'clay' | 'grey';
  isYou?: boolean;
  role: 'Organiser' | 'Member';
  ninVerified: boolean;
  payoutAccount?: BankAccountDetails;
}

export interface LateRule {
  graceDays: number;
  feeAmount: number;
  feeGoesTo: 'pot';
}

export interface GroupRules {
  amount: number;
  currency: 'NGN';
  frequency: Frequency;
  dueDay: string;
  size: number;
  payoutAmount: number;
  payoutOrder: PayoutOrder;
  orderDrawnOn?: string;
  lateRule: LateRule;
  startDate?: string;
  endDate?: string;
  changesNeedGroupVote: true;
}

export interface Contribution {
  id?: string;
  memberId: string;
  memberName?: string;
  amount: number;
  state: MoneyState;
  at: string | null;
  proof?: PaymentProof;
  confirmedByOrganiserAt?: string | null;
}

export interface Cycle {
  number: number;
  of: number;
  month: string;
  dueDate: string;
  payoutDate: string;
  payoutTo: string;
  payoutToMemberId?: string;
  inThePotCount?: number;
  confirmingCount?: number;
  pendingCount?: number;
  potTotal?: number;
  contributions: Contribution[];
  summary: {
    inThePot: number;
    confirming: number;
    pending: number;
    potTotal: number;
    target: number;
  };
}

export interface PayoutTurn {
  turn: number;
  memberId: string;
  memberName?: string;
  date: string;
  amount: number;
  status: TurnStatus;
  payoutProof?: PaymentProof;
  confirmedAt?: string;
}

export interface Group {
  id: string;
  name: string;
  organiserId: string;
  organiserName?: string;
  code?: string;
  status?: string;
  rules: GroupRules;
  wallet?: {
    heldBy: string;
    balanceThisCycle: number;
    bankName?: string;
    accountNumber?: string;
    totalPotSaved?: number;
  };
  organiserAccount?: BankAccountDetails;
  currentCycle?: Cycle;
  payoutCalendar?: PayoutTurn[];
  inviteLink?: string;
  members?: Member[];
  memberIds?: string[];
}

export interface ActivityItem {
  who: string;
  title: string;
  detail: string;
  amount: number;
  state: MoneyState;
  timestamp?: string;
}

export interface SystemNotification {
  id: string;
  groupId: string;
  groupName: string;
  title: string;
  message: string;
  detail?: string;
  time?: string;
  timestamp: string;
  type: 'payment_submitted' | 'payment_confirmed' | 'payout_sent' | 'payout_received' | 'member_joined' | 'payout' | 'confirmation' | 'late';
  read: boolean;
  actionRoute?: string;
  amount?: number;
  fromName?: string;
}

export interface InvitePreview {
  code: string;
  groupId: string;
  name: string;
  amount: number;
  currency: 'NGN';
  frequency: Frequency;
  dueDay: string;
  size: number;
  memberCount: number;
  organiserName: string;
  organiserId: string;
  status: string;
  createdAt: string;
  organiserAccount?: BankAccountDetails;
}

export interface UserPrivateDetails {
  nin?: string;
  ninVerified: boolean;
  ninVerifiedAt?: string | null;
  partnerBank?: {
    bankName: string;
    bankCode: string;
    accountNumber: string;
    accountName: string;
    isVerified: boolean;
    linkedAt: string;
  } | null;
  updatedAt?: string;
}

export const formatNaira = (n: number) => '₦' + (n || 0).toLocaleString('en-NG');
