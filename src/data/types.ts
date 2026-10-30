// Adashenmu data model (TypeScript). Matches data/mock-data.json.
export type MoneyState = 'pending' | 'confirming' | 'inThePot' | 'released' | 'late' | 'failed' | 'refunded';
export type TurnStatus = 'collected' | 'next' | 'yourTurn' | 'upcoming';
export type PayoutOrder = 'fixed' | 'draw' | 'vote';
export type Frequency = 'weekly' | 'monthly';
export type PaymentMethod = 'bankTransfer' | 'card' | 'ussd';
export type Language = 'en' | 'ha';

export interface Member { id: string; name: string; initials: string; avatarColor: 'green'|'gold'|'blue'|'clay'|'grey'; isYou?: boolean; role: 'Organiser'|'Member'; ninVerified: boolean; }
export interface LateRule { graceDays: number; feeAmount: number; feeGoesTo: 'pot'; }
export interface GroupRules { amount: number; currency: 'NGN'; frequency: Frequency; dueDay: string; size: number; payoutAmount: number; payoutOrder: PayoutOrder; orderDrawnOn?: string; lateRule: LateRule; startDate?: string; endDate?: string; changesNeedGroupVote: true; }
export interface Contribution { memberId: string; amount: number; state: MoneyState; at: string | null; }
export interface Cycle { number: number; of: number; month: string; dueDate: string; payoutDate: string; payoutTo: string; contributions: Contribution[]; summary: { inThePot: number; confirming: number; pending: number; potTotal: number; target: number }; }
export interface PayoutTurn { turn: number; memberId: string; date: string; amount: number; status: TurnStatus; }
export interface Group { id: string; name: string; organiserId: string; code?: string; status?: string; rules: GroupRules; wallet?: { heldBy: string; balanceThisCycle: number; bankName?: string; accountNumber?: string; totalPotSaved?: number }; currentCycle?: Cycle; payoutCalendar?: PayoutTurn[]; inviteLink?: string; members?: Member[]; }
export interface ActivityItem { who: string; title: string; detail: string; amount: number; state: MoneyState; }

// Money-state transitions (see BUILD-SPEC section 6)
// pending -> confirming (member pays) -> inThePot (bank confirms) -> released (payout date, for the pot)
// pending -> late (grace period ends unpaid) -> confirming (pays late, amount + fee)
// a single payment attempt: confirming -> failed -> refunded
export const formatNaira = (n: number) => '₦' + n.toLocaleString('en-NG');
