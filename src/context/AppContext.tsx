import React, { createContext, useContext, useState, ReactNode } from 'react';
import initialMockData from '../data/mock-data.json';
import { Group, Member, ActivityItem, MoneyState, formatNaira } from '../data/types';

interface ToastMessage {
  id: string;
  text: string;
  type?: 'success' | 'info' | 'alert';
}

export type PaymentTimingStatus = 'before_due' | 'due' | 'late';
export type PaymentMode = 'full' | 'installment';

interface CreateGroupDraft {
  templateId: string;
  name: string;
  amount: number;
  frequency: 'weekly' | 'monthly';
  dueDay: string;
  size: number;
  lateGraceDays: number;
  lateFee: number;
  payoutOrder: 'fixed' | 'draw' | 'vote';
  startDate: string;
  endDate: string;
  agreedToRules: boolean;
}

interface AppContextType {
  // Navigation
  currentRoute: string;
  navigate: (route: string) => void;
  goBack: () => void;
  historyStack: string[];

  // Data & State
  currentUser: typeof initialMockData.currentUser;
  members: Member[];
  groups: Group[];
  activity: typeof initialMockData.activity;
  
  // Contribution Tracking & Installments
  totalCycleContribution: number;
  userPaidAmount: number;
  userRemainingBalance: number;
  hasPaidUserContribution: boolean;
  userContributionState: MoneyState;
  potTotal: number;
  potConfirmedCount: number;
  
  // Payment Rules & Timing (Feature: flexible installment before due date, full when due, full + fee when late)
  paymentTimingStatus: PaymentTimingStatus;
  setPaymentTimingStatus: (status: PaymentTimingStatus) => void;
  paymentMode: PaymentMode;
  setPaymentMode: (mode: PaymentMode) => void;
  customInstallmentAmount: number;
  setCustomInstallmentAmount: (amount: number) => void;
  currentPaymentAmount: number;
  // Group detail navigation tabs (Ledger, Calendar, Rules)
  groupActiveTab: 'ledger' | 'calendar' | 'rules';
  setGroupActiveTab: (tab: 'ledger' | 'calendar' | 'rules') => void;

  // Payment Methods
  selectedPaymentMethod: 'bankTransfer' | 'card' | 'ussd';
  setSelectedPaymentMethod: (m: 'bankTransfer' | 'card' | 'ussd') => void;
  selectedUssdBank: string;
  setSelectedUssdBank: (b: string) => void;
  startPaymentSimulation: (amountToPay?: number) => void;
  resetPaymentState: () => void;

  // Create Group Flow
  createGroupDraft: CreateGroupDraft;
  updateCreateGroupDraft: (patch: Partial<CreateGroupDraft>) => void;
  commitNewGroup: () => void;

  // Identity Verification
  isNinVerified: boolean;
  setNinVerified: (v: boolean) => void;

  // UI helpers
  toasts: ToastMessage[];
  showToast: (text: string, type?: 'success' | 'info' | 'alert') => void;
  removeToast: (id: string) => void;
  isDemoModalOpen: boolean;
  setDemoModalOpen: (open: boolean) => void;
  isStatesSheetOpen: boolean;
  setStatesSheetOpen: (open: boolean) => void;
  resetAllData: () => void;
}

const defaultCreateGroupDraft: CreateGroupDraft = {
  templateId: 'weekly-stall',
  name: 'Kasuwa Stall Weekly',
  amount: 5000,
  frequency: 'weekly',
  dueDay: 'Fri, 6 pm',
  size: 8,
  lateGraceDays: 1,
  lateFee: 500,
  payoutOrder: 'draw',
  startDate: 'Fri 6 Nov 2026',
  endDate: 'Fri 25 Dec 2026',
  agreedToRules: true,
};

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Route state
  const [currentRoute, setCurrentRoute] = useState<string>('/home');
  const [historyStack, setHistoryStack] = useState<string[]>(['/home']);

  // Core data states loaded from mock-data.json
  const [currentUser, setCurrentUser] = useState(initialMockData.currentUser);
  const [members, setMembers] = useState<Member[]>(initialMockData.members as Member[]);
  const [groups, setGroups] = useState<Group[]>(initialMockData.groups.slice(0, 1) as unknown as Group[]);
  const [activity, setActivity] = useState(initialMockData.activity);

  // Installment & Contribution tracking
  const totalCycleContribution = 20000;
  const lateFeeAmount = 1000;
  const [userPaidAmount, setUserPaidAmount] = useState<number>(0);
  const [userContributionState, setUserContributionState] = useState<MoneyState>('pending');
  const [hasPaidUserContribution, setHasPaidUserContribution] = useState(false);
  const [potTotal, setPotTotal] = useState(140000);
  const [potConfirmedCount, setPotConfirmedCount] = useState(7);

  // Timing status: 'before_due' | 'due' | 'late'
  const [paymentTimingStatus, setPaymentTimingStatus] = useState<PaymentTimingStatus>('before_due');
  const [paymentMode, setPaymentMode] = useState<PaymentMode>('full');
  const [customInstallmentAmount, setCustomInstallmentAmount] = useState<number>(5000);
  const [lastPaymentAmount, setLastPaymentAmount] = useState<number>(20000);

  // Payment details
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'bankTransfer' | 'card' | 'ussd'>('ussd');
  const [selectedUssdBank, setSelectedUssdBank] = useState<string>('GTBank');

  // Create group draft
  const [createGroupDraft, setCreateGroupDraft] = useState<CreateGroupDraft>(defaultCreateGroupDraft);

  // NIN verification state
  const [isNinVerified, setNinVerified] = useState(true);

  // Group detail active tab state
  const [groupActiveTab, setGroupActiveTab] = useState<'ledger' | 'calendar' | 'rules'>('ledger');

  // UI overlays
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isDemoModalOpen, setDemoModalOpen] = useState(false);
  const [isStatesSheetOpen, setStatesSheetOpen] = useState(false);

  const userRemainingBalance = Math.max(0, totalCycleContribution - userPaidAmount);

  // Calculate current effective payment amount based on timing status and chosen mode
  let currentPaymentAmount: number;
  if (paymentTimingStatus === 'late') {
    currentPaymentAmount = userRemainingBalance + lateFeeAmount;
  } else if (paymentTimingStatus === 'due') {
    currentPaymentAmount = userRemainingBalance;
  } else {
    // before_due
    if (paymentMode === 'installment') {
      currentPaymentAmount = Math.min(customInstallmentAmount, userRemainingBalance);
    } else {
      currentPaymentAmount = userRemainingBalance;
    }
  }

  const navigate = (route: string) => {
    setHistoryStack((prev) => [...prev, route]);
    setCurrentRoute(route);
    if (route.includes('/calendar')) {
      setGroupActiveTab('calendar');
    } else if (route.includes('/rules') && route.includes('/groups/g-')) {
      setGroupActiveTab('rules');
    } else if (route.includes('/ledger')) {
      setGroupActiveTab('ledger');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goBack = () => {
    if (historyStack.length > 1) {
      const newStack = [...historyStack];
      newStack.pop();
      const previousRoute = newStack[newStack.length - 1];
      setHistoryStack(newStack);
      setCurrentRoute(previousRoute);
    } else {
      setCurrentRoute('/home');
    }
  };

  const showToast = (text: string, type: 'success' | 'info' | 'alert' = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, text, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const updateCreateGroupDraft = (patch: Partial<CreateGroupDraft>) => {
    setCreateGroupDraft((prev) => {
      const updated = { ...prev, ...patch };
      if (patch.templateId && patch.templateId === 'monthly-market') {
        updated.name = 'Kaduna Fabric Sellers';
        updated.amount = 20000;
        updated.frequency = 'monthly';
        updated.dueDay = '28th of each month';
        updated.size = 10;
        updated.lateGraceDays = 2;
        updated.lateFee = 1000;
        updated.startDate = 'Sun 1 Nov 2026';
        updated.endDate = 'Mon 31 Aug 2027';
      } else if (patch.templateId && patch.templateId === 'weekly-stall') {
        updated.name = 'Kasuwa Stall Weekly';
        updated.amount = 5000;
        updated.frequency = 'weekly';
        updated.dueDay = 'Fri, 6 pm';
        updated.size = 8;
        updated.lateGraceDays = 1;
        updated.lateFee = 500;
        updated.startDate = 'Fri 6 Nov 2026';
        updated.endDate = 'Fri 25 Dec 2026';
      }
      return updated;
    });
  };

  const commitNewGroup = () => {
    const secondGroup = initialMockData.groups[1] as unknown as Group;
    setGroups((prev) => {
      if (prev.some((g) => g.id === secondGroup.id)) return prev;
      return [...prev, secondGroup];
    });
    showToast(`"${createGroupDraft.name}" created successfully!`, 'success');
  };

  // Payment simulation supporting installment, full, and late with fees
  const startPaymentSimulation = (amountOverride?: number) => {
    const amountToPay = amountOverride !== undefined ? amountOverride : currentPaymentAmount;
    setLastPaymentAmount(amountToPay);

    setUserContributionState('confirming');

    // Add activity row immediately as confirming
    setActivity((prev) => {
      const newActivity = [...prev];
      if (newActivity[0]) {
        newActivity[0] = {
          ...newActivity[0],
          items: [
            {
              who: 'm01',
              title:
                amountToPay < totalCycleContribution && userPaidAmount + amountToPay < totalCycleContribution
                  ? 'You paid instalment · Kasuwa Atamfa'
                  : 'You paid · Kasuwa Atamfa',
              detail: `USSD · 9:41 · ${selectedUssdBank}`,
              amount: amountToPay,
              state: 'confirming',
            },
            ...newActivity[0].items.filter((item) => item.who !== 'm01'),
          ],
        };
      }
      return newActivity;
    });

    // Bank confirmation simulation after ~3.2 seconds
    setTimeout(() => {
      const newPaidTotal = userPaidAmount + amountToPay;
      setUserPaidAmount(newPaidTotal);

      const isCompleted = newPaidTotal >= totalCycleContribution;
      if (isCompleted) {
        setUserContributionState('inThePot');
        setHasPaidUserContribution(true);
        setPotConfirmedCount(8);
      } else {
        // Still has remaining balance
        setUserContributionState('pending');
        setHasPaidUserContribution(false);
      }

      setPotTotal((prev) => prev + amountToPay);

      // Update ledger for Hauwa
      setGroups((prev) =>
        prev.map((group) => {
          if (group.id === 'g-kasuwa-atamfa' && group.currentCycle) {
            return {
              ...group,
              wallet: {
                ...group.wallet,
                balanceThisCycle: potTotal + amountToPay,
                heldBy: group.wallet?.heldBy || 'Licensed partner bank',
              },
              currentCycle: {
                ...group.currentCycle,
                contributions: group.currentCycle.contributions.map((c) =>
                  c.memberId === 'm01'
                    ? {
                        ...c,
                        state: isCompleted ? 'inThePot' : 'pending',
                        amount: newPaidTotal,
                        at: '2026-10-26T09:41',
                      }
                    : c
                ),
                summary: {
                  ...group.currentCycle.summary,
                  inThePot: isCompleted ? 8 : 7,
                  confirming: 0,
                  pending: isCompleted ? 1 : 2,
                  potTotal: potTotal + amountToPay,
                },
              },
            };
          }
          return group;
        })
      );

      // Update activity row to inThePot
      setActivity((prev) => {
        const next = [...prev];
        if (next[0]) {
          next[0] = {
            ...next[0],
            items: next[0].items.map((item) =>
              item.who === 'm01' ? { ...item, state: 'inThePot' } : item
            ),
          };
        }
        return next;
      });

      if (isCompleted) {
        showToast(`Full cycle contribution completed! ₦${amountToPay.toLocaleString()} confirmed in the pot.`, 'success');
      } else {
        const remaining = totalCycleContribution - newPaidTotal;
        showToast(`Instalment of ₦${amountToPay.toLocaleString()} confirmed! ₦${remaining.toLocaleString()} remaining for Cycle 4.`, 'info');
      }
    }, 3200);
  };

  const resetPaymentState = () => {
    setUserPaidAmount(0);
    setUserContributionState('pending');
    setHasPaidUserContribution(false);
    setPotTotal(140000);
    setPotConfirmedCount(7);
    setPaymentTimingStatus('before_due');
    setPaymentMode('full');
    setCustomInstallmentAmount(5000);
  };

  const resetAllData = () => {
    setCurrentUser(initialMockData.currentUser);
    setMembers(initialMockData.members as Member[]);
    setGroups(initialMockData.groups.slice(0, 1) as unknown as Group[]);
    setActivity(initialMockData.activity);
    resetPaymentState();
    setCreateGroupDraft(defaultCreateGroupDraft);
    setNinVerified(true);
    showToast('Mock data reset to original story state (Mon 26 Oct, 9:41)', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        currentRoute,
        navigate,
        goBack,
        historyStack,
        currentUser,
        members,
        groups,
        activity,
        totalCycleContribution,
        userPaidAmount,
        userRemainingBalance,
        hasPaidUserContribution,
        userContributionState,
        potTotal,
        potConfirmedCount,
        paymentTimingStatus,
        setPaymentTimingStatus,
        paymentMode,
        setPaymentMode,
        customInstallmentAmount,
        setCustomInstallmentAmount,
        currentPaymentAmount,
        lateFeeAmount,
        groupActiveTab,
        setGroupActiveTab,
        selectedPaymentMethod,
        setSelectedPaymentMethod,
        selectedUssdBank,
        setSelectedUssdBank,
        startPaymentSimulation,
        resetPaymentState,
        createGroupDraft,
        updateCreateGroupDraft,
        commitNewGroup,
        isNinVerified,
        setNinVerified,
        toasts,
        showToast,
        removeToast,
        isDemoModalOpen,
        setDemoModalOpen,
        isStatesSheetOpen,
        setStatesSheetOpen,
        resetAllData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
