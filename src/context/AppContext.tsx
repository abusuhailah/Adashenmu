import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import initialMockData from '../data/mock-data.json';
import { Group, Member, ActivityItem, MoneyState, formatNaira } from '../data/types';
import {
  auth,
  db,
  googleProvider,
  signInWithPopup,
  fbSignOut,
  onAuthStateChanged,
  getOrCreateUserProfile,
  updatePartnerBank,
  verifyUserNinDoc,
  createRealGroup,
  joinGroupReal,
  recordRealContribution,
  LiveUserProfile,
  LiveGroupData,
} from '../lib/firebase';
import { collection, onSnapshot, doc, getDoc, getDocs, query, orderBy } from 'firebase/firestore';

interface ToastMessage {
  id: string;
  text: string;
  type?: 'success' | 'info' | 'alert';
}

export type PaymentTimingStatus = 'before_due' | 'due' | 'late';
export type PaymentMode = 'full' | 'installment';

export interface CreateGroupDraft {
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
  partnerBankName?: string;
  agreedToRules: boolean;
}

export interface PartnerBankAccount {
  bankName: string;
  bankCode: string;
  accountNumber: string;
  accountName: string;
  isVerified: boolean;
}

interface AppContextType {
  // Navigation
  currentRoute: string;
  navigate: (route: string) => void;
  goBack: () => void;
  historyStack: string[];

  // User & Live Auth
  currentUser: {
    id: string;
    name: string;
    phone: string;
    initials: string;
    avatarColor: 'green' | 'gold' | 'blue' | 'clay' | 'grey';
    ninVerified: boolean;
    nin?: string;
    role: 'Organiser' | 'Member';
  };
  liveUserProfile: LiveUserProfile | null;
  signInWithGoogle: () => Promise<void>;
  signInWithPhoneDirect: (phone: string, name?: string) => Promise<void>;
  signOut: () => Promise<void>;

  // Data & Groups
  members: Member[];
  groups: Group[];
  activeGroup: Group | null;
  activity: typeof initialMockData.activity;

  // Contribution Tracking & Flexible Installments
  totalCycleContribution: number;
  userPaidAmount: number;
  userRemainingBalance: number;
  hasPaidUserContribution: boolean;
  userContributionState: MoneyState;
  potTotal: number;
  potConfirmedCount: number;

  // Timing & Modes
  paymentTimingStatus: PaymentTimingStatus;
  setPaymentTimingStatus: (status: PaymentTimingStatus) => void;
  paymentMode: PaymentMode;
  setPaymentMode: (mode: PaymentMode) => void;
  customInstallmentAmount: number;
  setCustomInstallmentAmount: (amount: number) => void;
  currentPaymentAmount: number;
  lateFeeAmount: number;

  // Group detail navigation tabs
  groupActiveTab: 'ledger' | 'calendar' | 'rules';
  setGroupActiveTab: (tab: 'ledger' | 'calendar' | 'rules') => void;

  // Payment Methods
  selectedPaymentMethod: 'bankTransfer' | 'card' | 'ussd';
  setSelectedPaymentMethod: (m: 'bankTransfer' | 'card' | 'ussd') => void;
  selectedUssdBank: string;
  setSelectedUssdBank: (b: string) => void;
  startPaymentSimulation: (amountToPay?: number) => void;
  resetPaymentState: () => void;

  // Real Group Actions
  createGroupDraft: CreateGroupDraft;
  updateCreateGroupDraft: (patch: Partial<CreateGroupDraft>) => void;
  commitNewGroup: () => Promise<void>;
  joinGroupByCodeOrId: (codeOrId: string) => Promise<Group>;

  // Partner Bank
  partnerBank: PartnerBankAccount | null;
  savePartnerBank: (bank: { bankName: string; bankCode: string; accountNumber: string; accountName: string }) => Promise<void>;
  isPartnerBankModalOpen: boolean;
  setPartnerBankModalOpen: (open: boolean) => void;

  // Join Group Modal
  isJoinModalOpen: boolean;
  setJoinModalOpen: (open: boolean) => void;

  // NIN Identity Verification
  isNinVerified: boolean;
  setNinVerified: (v: boolean) => void;
  verifyNin: (nin: string, fullName: string) => Promise<void>;

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
  partnerBankName: 'Access Bank (CBN Licensed)',
  agreedToRules: true,
};

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Navigation
  const [currentRoute, setCurrentRoute] = useState<string>('/home');
  const [historyStack, setHistoryStack] = useState<string[]>(['/home']);

  // Live Firebase User & Profile
  const [liveUserProfile, setLiveUserProfile] = useState<LiveUserProfile | null>(null);
  const [isNinVerified, setNinVerified] = useState<boolean>(true);
  const [partnerBank, setPartnerBank] = useState<PartnerBankAccount | null>({
    bankName: 'Guaranty Trust Bank (GTBank)',
    bankCode: '058',
    accountNumber: '0129482110',
    accountName: 'Hauwa Ibrahim',
    isVerified: true,
  });

  // Groups and members
  const [groups, setGroups] = useState<Group[]>(initialMockData.groups.slice(0, 1) as unknown as Group[]);
  const [members, setMembers] = useState<Member[]>(initialMockData.members as Member[]);
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

  // Payment details
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'bankTransfer' | 'card' | 'ussd'>('ussd');
  const [selectedUssdBank, setSelectedUssdBank] = useState<string>('GTBank');

  // Create group draft
  const [createGroupDraft, setCreateGroupDraft] = useState<CreateGroupDraft>(defaultCreateGroupDraft);

  // Active tab in group details
  const [groupActiveTab, setGroupActiveTab] = useState<'ledger' | 'calendar' | 'rules'>('ledger');

  // Modals & Sheets
  const [isPartnerBankModalOpen, setPartnerBankModalOpen] = useState(false);
  const [isJoinModalOpen, setJoinModalOpen] = useState(false);
  const [isDemoModalOpen, setDemoModalOpen] = useState(false);
  const [isStatesSheetOpen, setStatesSheetOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        try {
          const profile = await getOrCreateUserProfile(fbUser);
          setLiveUserProfile(profile);
          setNinVerified(profile.ninVerified);
          if (profile.partnerBank) {
            setPartnerBank(profile.partnerBank);
          }
        } catch (e) {
          console.error('Error fetching live profile:', e);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  // Real-time Firestore sync for groups
  useEffect(() => {
    try {
      const q = collection(db, 'groups');
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          if (!snapshot.empty) {
            const liveGroups: Group[] = [];
            snapshot.forEach((docSnap) => {
              const data = docSnap.data() as LiveGroupData;
              liveGroups.push({
                id: data.id,
                name: data.name,
                code: data.code,
                organiserId: data.organiserId,
                status: data.status,
                rules: data.rules as any,
                wallet: data.wallet as any,
                currentCycle: data.currentCycle as any,
                payoutCalendar: data.payoutCalendar as any,
                members: data.members as any,
                inviteLink: `adashenmu.app/join/${data.id}`,
              });
            });
            setGroups(liveGroups);
          }
        },
        (error) => {
          console.warn('Firestore live listener notice:', error.message);
        }
      );
      return () => unsubscribe();
    } catch (err) {
      console.warn('Firestore init note:', err);
    }
  }, []);

  // Compute active user details
  const currentUser = {
    id: liveUserProfile?.id || initialMockData.currentUser.id,
    name: liveUserProfile?.displayName || initialMockData.currentUser.name,
    phone: liveUserProfile?.phone || '+234 803 412 7765',
    initials: liveUserProfile?.initials || 'HI',
    avatarColor: (liveUserProfile?.avatarColor as any) || ('clay' as const),
    ninVerified: isNinVerified,
    nin: liveUserProfile?.nin,
    role: 'Organiser' as const,
  };

  const activeGroup = groups[0] || null;

  const userRemainingBalance = Math.max(0, totalCycleContribution - userPaidAmount);

  // Calculate current payment amount based on timing status
  let currentPaymentAmount: number;
  if (paymentTimingStatus === 'late') {
    currentPaymentAmount = userRemainingBalance + lateFeeAmount;
  } else if (paymentTimingStatus === 'due') {
    currentPaymentAmount = userRemainingBalance;
  } else {
    // before_due: allow installment or full
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
    } else if (route.includes('/rules')) {
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

  // Google Sign-in
  const signInWithGoogle = async () => {
    try {
      const res = await signInWithPopup(auth, googleProvider);
      const profile = await getOrCreateUserProfile(res.user);
      setLiveUserProfile(profile);
      setNinVerified(profile.ninVerified);
      showToast(`Welcome, ${profile.displayName}!`, 'success');
      navigate('/home');
    } catch (e: any) {
      console.error('Sign-in error:', e);
      showToast(e.message || 'Google Sign-in failed', 'alert');
    }
  };

  // Phone sign-in simulation/real
  const signInWithPhoneDirect = async (phone: string, name?: string) => {
    const dummyUser = {
      uid: 'user-' + phone.replace(/\D/g, '').slice(-6),
      displayName: name || 'Adashenmu Member',
      phoneNumber: phone,
    };
    const profile = await getOrCreateUserProfile(dummyUser as any, name, phone);
    setLiveUserProfile(profile);
    setNinVerified(profile.ninVerified);
    showToast(`Signed in as ${profile.displayName}`, 'success');
    navigate('/verify');
  };

  const signOut = async () => {
    try {
      await fbSignOut(auth);
    } catch {}
    setLiveUserProfile(null);
    showToast('Signed out of session', 'info');
    navigate('/welcome');
  };

  // Partner Bank Save
  const savePartnerBank = async (bank: {
    bankName: string;
    bankCode: string;
    accountNumber: string;
    accountName: string;
  }) => {
    const data: PartnerBankAccount = {
      ...bank,
      isVerified: true,
    };
    setPartnerBank(data);
    if (liveUserProfile?.id) {
      try {
        await updatePartnerBank(liveUserProfile.id, bank);
      } catch (e) {
        console.warn('Could not sync bank to firestore:', e);
      }
    }
  };

  // NIN Verification
  const verifyNin = async (nin: string, fullName: string) => {
    setNinVerified(true);
    if (liveUserProfile?.id) {
      try {
        await verifyUserNinDoc(liveUserProfile.id, nin, fullName);
        setLiveUserProfile((prev) =>
          prev
            ? {
                ...prev,
                ninVerified: true,
                displayName: fullName || prev.displayName,
                nin: nin.slice(0, 3) + '*****' + nin.slice(-3),
              }
            : null
        );
      } catch (e) {
        console.warn('Could not sync NIN to firestore:', e);
      }
    }
  };

  const updateCreateGroupDraft = (patch: Partial<CreateGroupDraft>) => {
    setCreateGroupDraft((prev) => ({ ...prev, ...patch }));
  };

  // Create real group & persist to Firestore
  const commitNewGroup = async () => {
    const organiserProfile: LiveUserProfile = liveUserProfile || {
      id: currentUser.id,
      displayName: currentUser.name,
      phone: currentUser.phone,
      initials: currentUser.initials,
      avatarColor: currentUser.avatarColor,
      ninVerified: isNinVerified,
      createdAt: new Date().toISOString(),
    };

    try {
      const created = await createRealGroup(organiserProfile, {
        name: createGroupDraft.name,
        amount: createGroupDraft.amount,
        frequency: createGroupDraft.frequency,
        dueDay: createGroupDraft.dueDay,
        size: createGroupDraft.size,
        lateGraceDays: createGroupDraft.lateGraceDays,
        lateFee: createGroupDraft.lateFee,
        payoutOrder: createGroupDraft.payoutOrder,
        startDate: createGroupDraft.startDate,
        endDate: createGroupDraft.endDate,
        partnerBankName: partnerBank?.bankName || createGroupDraft.partnerBankName,
      });

      const newGroup: Group = {
        id: created.id,
        name: created.name,
        code: created.code,
        organiserId: created.organiserId,
        rules: created.rules as any,
        wallet: created.wallet as any,
        currentCycle: created.currentCycle as any,
        payoutCalendar: created.payoutCalendar as any,
        members: created.members as any,
        inviteLink: `adashenmu.app/join/${created.id}`,
      };

      setGroups((prev) => [newGroup, ...prev.filter((g) => g.id !== newGroup.id)]);
      showToast(`Group "${created.name}" created! Join code: ${created.code}`, 'success');
    } catch (e: any) {
      console.error('Group creation error:', e);
      // Fallback local creation if offline
      const localId = 'group-' + Date.now();
      const code = createGroupDraft.name.slice(0, 4).toUpperCase() + '-8821';
      const localGroup: Group = {
        id: localId,
        name: createGroupDraft.name,
        code,
        organiserId: currentUser.id,
        rules: {
          amount: createGroupDraft.amount,
          currency: 'NGN',
          frequency: createGroupDraft.frequency,
          dueDay: createGroupDraft.dueDay,
          size: createGroupDraft.size,
          payoutAmount: createGroupDraft.amount * createGroupDraft.size,
          payoutOrder: createGroupDraft.payoutOrder,
          lateRule: {
            graceDays: createGroupDraft.lateGraceDays,
            feeAmount: createGroupDraft.lateFee,
            feeGoesTo: 'pot',
          },
          startDate: createGroupDraft.startDate,
          endDate: createGroupDraft.endDate,
          changesNeedGroupVote: true,
        },
        wallet: {
          heldBy: 'Licensed partner bank · NDIC Insured',
          bankName: partnerBank?.bankName || 'Access Bank',
          accountNumber: '0928192841',
          balanceThisCycle: 0,
        },
        members: [
          {
            id: currentUser.id,
            name: currentUser.name,
            initials: currentUser.initials,
            avatarColor: currentUser.avatarColor,
            isYou: true,
            role: 'Organiser',
            ninVerified: isNinVerified,
          },
        ],
        inviteLink: `adashenmu.app/join/${localId}`,
      };
      setGroups((prev) => [localGroup, ...prev]);
      showToast(`Group "${createGroupDraft.name}" created!`, 'success');
    }
  };

  // Join group by code or ID
  const joinGroupByCodeOrId = async (codeOrId: string): Promise<Group> => {
    const cleaned = codeOrId.trim().toUpperCase();
    // Check locally first
    let match = groups.find((g) => g.id === codeOrId || (g.code && g.code.toUpperCase() === cleaned));

    if (!match) {
      // Check in Firestore
      try {
        const querySnapshot = await getDocs(collection(db, 'groups'));
        querySnapshot.forEach((docSnap) => {
          const d = docSnap.data() as LiveGroupData;
          if (d.id === codeOrId || (d.code && d.code.toUpperCase() === cleaned)) {
            match = {
              id: d.id,
              name: d.name,
              code: d.code,
              organiserId: d.organiserId,
              rules: d.rules as any,
              wallet: d.wallet as any,
              currentCycle: d.currentCycle as any,
              payoutCalendar: d.payoutCalendar as any,
              members: d.members as any,
              inviteLink: `adashenmu.app/join/${d.id}`,
            };
          }
        });
      } catch (err) {
        console.warn('Firestore group lookup error:', err);
      }
    }

    if (!match) {
      throw new Error(`No group found with code "${codeOrId}".`);
    }

    // Join the group
    const userProfile: LiveUserProfile = liveUserProfile || {
      id: currentUser.id,
      displayName: currentUser.name,
      phone: currentUser.phone,
      initials: currentUser.initials,
      avatarColor: currentUser.avatarColor,
      ninVerified: isNinVerified,
      createdAt: new Date().toISOString(),
    };

    try {
      await joinGroupReal(match.id, userProfile);
    } catch (e: any) {
      console.warn('Real join notice:', e.message);
    }

    // Add to local state if not present
    setGroups((prev) => {
      if (prev.some((g) => g.id === match!.id)) return prev;
      return [match!, ...prev];
    });

    return match;
  };

  // Payment contribution simulation (supports installment and full)
  const startPaymentSimulation = (amountOverride?: number) => {
    const amountToPay = amountOverride !== undefined ? amountOverride : currentPaymentAmount;
    setUserContributionState('confirming');

    // Add activity record immediately
    setActivity((prev) => {
      const newActivity = [...prev];
      if (newActivity[0]) {
        newActivity[0] = {
          ...newActivity[0],
          items: [
            {
              who: currentUser.id,
              title:
                amountToPay < totalCycleContribution && userPaidAmount + amountToPay < totalCycleContribution
                  ? `You paid instalment · ${groups[0]?.name || 'Adashe'}`
                  : `You paid · ${groups[0]?.name || 'Adashe'}`,
              detail: `${selectedPaymentMethod.toUpperCase()} · ${selectedUssdBank}`,
              amount: amountToPay,
              state: 'confirming',
            },
            ...newActivity[0].items.filter((item) => item.who !== currentUser.id),
          ],
        };
      }
      return newActivity;
    });

    // Bank confirmation simulation after ~3 seconds
    setTimeout(async () => {
      const newPaidTotal = userPaidAmount + amountToPay;
      setUserPaidAmount(newPaidTotal);

      const isCompleted = newPaidTotal >= totalCycleContribution;
      if (isCompleted) {
        setUserContributionState('inThePot');
        setHasPaidUserContribution(true);
        setPotConfirmedCount((c) => Math.min(10, c + 1));
      } else {
        setUserContributionState('pending');
        setHasPaidUserContribution(false);
      }

      setPotTotal((prev) => prev + amountToPay);

      // Persist to Firestore if live group exists
      if (groups[0]?.id && liveUserProfile) {
        try {
          await recordRealContribution(
            groups[0].id,
            liveUserProfile,
            amountToPay,
            isCompleted,
            selectedPaymentMethod
          );
        } catch (e) {
          console.warn('Could not record contribution to Firestore:', e);
        }
      }

      // Update activity row
      setActivity((prev) => {
        const next = [...prev];
        if (next[0]) {
          next[0] = {
            ...next[0],
            items: next[0].items.map((item) =>
              item.who === currentUser.id ? { ...item, state: 'inThePot' } : item
            ),
          };
        }
        return next;
      });

      if (isCompleted) {
        showToast(
          `Full cycle contribution completed! ₦${amountToPay.toLocaleString('en-NG')} confirmed in group pot.`,
          'success'
        );
      } else {
        const remaining = totalCycleContribution - newPaidTotal;
        showToast(
          `Instalment of ₦${amountToPay.toLocaleString('en-NG')} confirmed! ₦${remaining.toLocaleString('en-NG')} remaining for this cycle.`,
          'info'
        );
      }
    }, 3000);
  };

  const resetPaymentState = () => {
    setUserPaidAmount(0);
    setUserContributionState('pending');
    setHasPaidUserContribution(false);
    setPaymentTimingStatus('before_due');
    setPaymentMode('full');
    setCustomInstallmentAmount(5000);
  };

  const resetAllData = () => {
    resetPaymentState();
    showToast('Session reset', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        currentRoute,
        navigate,
        goBack,
        historyStack,
        currentUser,
        liveUserProfile,
        signInWithGoogle,
        signInWithPhoneDirect,
        signOut,
        members,
        groups,
        activeGroup,
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
        joinGroupByCodeOrId,
        partnerBank,
        savePartnerBank,
        isPartnerBankModalOpen,
        setPartnerBankModalOpen,
        isJoinModalOpen,
        setJoinModalOpen,
        isNinVerified,
        setNinVerified,
        verifyNin,
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
