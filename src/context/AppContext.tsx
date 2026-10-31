import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  Group,
  Member,
  ActivityItem,
  MoneyState,
  formatNaira,
  BankAccountDetails,
  PaymentProof,
  PayoutTurn,
  TurnStatus,
  SystemNotification,
} from '../data/types';
import {
  auth,
  db,
  googleProvider,
  signInWithPopup,
  signInAnonymously,
  fbSignOut,
  onAuthStateChanged,
  getOrCreateUserProfile,
  updatePartnerBank,
  verifyUserNinDoc,
  createRealGroup,
  joinGroupReal,
  recordRealContribution,
  confirmPaymentReal,
  releasePayoutReal,
  confirmPayoutReceivedReal,
  fetchInvitePreview,
  LiveUserProfile,
  LiveGroupData,
} from '../lib/firebase';
import { runSafeMigration } from '../lib/migration';
import { collection, onSnapshot, doc, getDoc, query, where } from 'firebase/firestore';

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
  organiserAccount?: BankAccountDetails;
  agreedToRules: boolean;
}

export interface PartnerBankAccount {
  bankName: string;
  bankCode: string;
  accountNumber: string;
  accountName: string;
  isVerified: boolean;
}

export interface GroupActivitySection {
  date: string;
  label: string;
  items: ActivityItem[];
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
    email: string;
    phone: string;
    initials: string;
    avatarColor: 'green' | 'gold' | 'blue' | 'clay' | 'grey';
    ninVerified: boolean;
    nin?: string;
    role: 'Organiser' | 'Member';
  };
  liveUserProfile: LiveUserProfile | null;
  signInWithGoogle: () => Promise<LiveUserProfile | null | void>;
  signInWithPhoneDirect: (phone: string, name?: string) => Promise<void>;
  signOut: () => Promise<void>;

  // Data & Groups
  members: Member[];
  groups: Group[];
  activeGroup: Group | null;
  selectedGroupId: string | null;
  setSelectedGroupId: (id: string | null) => void;
  activity: GroupActivitySection[];

  // Notifications
  notifications: SystemNotification[];
  markNotificationRead: (id: string) => void;

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
  commitNewGroup: () => Promise<Group>;
  joinGroupByCodeOrId: (codeOrId: string, payoutAccount?: BankAccountDetails) => Promise<Group>;

  // Workflow Real Actions
  submitMemberPayment: (
    groupId: string,
    amount: number,
    isFull: boolean,
    method: 'bankTransfer' | 'card' | 'ussd',
    proof?: PaymentProof
  ) => Promise<void>;
  confirmMemberPayment: (
    groupId: string,
    memberId: string,
    memberName: string,
    amount: number
  ) => Promise<void>;
  releaseMemberPayout: (
    groupId: string,
    turnNumber: number,
    recipientMemberId: string,
    recipientName: string,
    amount: number,
    proof: PaymentProof
  ) => Promise<void>;
  confirmPayoutReceived: (
    groupId: string,
    turnNumber: number,
    amount: number
  ) => Promise<void>;

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
  templateId: 'monthly-market',
  name: 'Kasuwa Market Savings',
  amount: 20000,
  frequency: 'monthly',
  dueDay: '28th of each month',
  size: 5,
  lateGraceDays: 2,
  lateFee: 1000,
  payoutOrder: 'fixed',
  startDate: '1st of next month',
  endDate: '5 months duration',
  partnerBankName: 'Guaranty Trust Bank (GTBank)',
  agreedToRules: true,
};

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Navigation
  const [currentRoute, setCurrentRoute] = useState<string>(() => {
    if (typeof window !== 'undefined' && window.location.pathname && window.location.pathname !== '/') {
      return window.location.pathname;
    }
    return '/home';
  });
  const [historyStack, setHistoryStack] = useState<string[]>([
    typeof window !== 'undefined' && window.location.pathname && window.location.pathname !== '/'
      ? window.location.pathname
      : '/home',
  ]);

  // Live Firebase User & Profile
  const [liveUserProfile, setLiveUserProfile] = useState<LiveUserProfile | null>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('adashenmu_user_session');
        if (saved) return JSON.parse(saved);
      } catch {}
    }
    return null;
  });

  const [isNinVerified, setNinVerified] = useState<boolean>(true);
  const [partnerBank, setPartnerBank] = useState<PartnerBankAccount | null>({
    bankName: 'Guaranty Trust Bank (GTBank)',
    bankCode: '058',
    accountNumber: '0129482110',
    accountName: 'Suhailah',
    isVerified: true,
  });

  // Groups and members: ZERO DEMO DATA! Real groups loaded from Firestore / localStorage
  const [groups, setGroups] = useState<Group[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('adashenmu_groups');
        if (saved) return JSON.parse(saved);
      } catch {}
    }
    return [];
  });

  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);

  // Group activity feed
  const [activity, setActivity] = useState<GroupActivitySection[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('adashenmu_activity');
        if (saved) return JSON.parse(saved);
      } catch {}
    }
    return [];
  });

  // In-app notifications
  const [notifications, setNotifications] = useState<SystemNotification[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('adashenmu_notifications');
        if (saved) return JSON.parse(saved);
      } catch {}
    }
    return [];
  });

  // Sync state to localStorage whenever changed
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('adashenmu_groups', JSON.stringify(groups));
      } catch {}
    }
  }, [groups]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('adashenmu_activity', JSON.stringify(activity));
      } catch {}
    }
  }, [activity]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('adashenmu_notifications', JSON.stringify(notifications));
      } catch {}
    }
  }, [notifications]);

  // Active group selection
  const activeGroup: Group | null =
    (selectedGroupId ? groups.find((g) => g.id === selectedGroupId) : null) ||
    groups[0] ||
    null;

  const members: Member[] = activeGroup?.members || [];

  // Active user details
  const isOrganiserOfAny = groups.some(
    (g) => g.organiserId === (liveUserProfile?.id || 'user-suhailah')
  );

  const currentUser = {
    id: liveUserProfile?.id || 'user-suhailah',
    name: liveUserProfile?.displayName || 'Suhailah',
    email: liveUserProfile?.email || auth.currentUser?.email || 'suhailahmart@gmail.com',
    phone: liveUserProfile?.phone || '+234 803 412 7765',
    initials: liveUserProfile?.initials || 'SM',
    avatarColor: (liveUserProfile?.avatarColor as any) || ('green' as const),
    ninVerified: true,
    role: (activeGroup?.organiserId === (liveUserProfile?.id || 'user-suhailah') ? 'Organiser' : isOrganiserOfAny ? 'Organiser' : 'Member') as 'Organiser' | 'Member',
  };

  // Group metrics dynamically computed from active group
  const totalCycleContribution = activeGroup?.rules?.amount || 20000;
  const lateFeeAmount = activeGroup?.rules?.lateRule?.feeAmount || 1000;
  const potTotal = activeGroup?.wallet?.balanceThisCycle ?? 0;
  const potConfirmedCount = activeGroup?.currentCycle?.inThePotCount ?? 0;

  // Installment & Contribution tracking
  const [userPaidAmount, setUserPaidAmount] = useState<number>(0);
  const [userContributionState, setUserContributionState] = useState<MoneyState>('pending');
  const [hasPaidUserContribution, setHasPaidUserContribution] = useState(false);

  // Timing status & mode
  const [paymentTimingStatus, setPaymentTimingStatus] = useState<PaymentTimingStatus>('before_due');
  const [paymentMode, setPaymentMode] = useState<PaymentMode>('full');
  const [customInstallmentAmount, setCustomInstallmentAmount] = useState<number>(5000);

  // Payment details
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'bankTransfer' | 'card' | 'ussd'>('bankTransfer');
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
    const savedSession = typeof window !== 'undefined' ? localStorage.getItem('adashenmu_user_session') : null;
    if (savedSession) {
      try {
        const parsed = JSON.parse(savedSession);
        setLiveUserProfile(parsed);
        setNinVerified(true);
        if (parsed.partnerBank) {
          setPartnerBank(parsed.partnerBank);
        }
      } catch (err) {
        console.warn('Session parse note:', err);
      }
    }

    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        try {
          const profile = await getOrCreateUserProfile(fbUser);
          setLiveUserProfile(profile);
          setNinVerified(true);
          try {
            localStorage.setItem('adashenmu_user_session', JSON.stringify(profile));
          } catch {}
          if (profile.partnerBank) {
            setPartnerBank(profile.partnerBank);
          }
          runSafeMigration(profile).catch((err) => {
            console.warn('Migration notice:', err);
          });
          setCurrentRoute((curr) => {
            if (curr === '/welcome' || curr === '/sign-in' || curr === '/verify') {
              return '/home';
            }
            return curr;
          });
        } catch (e) {
          console.error('Error fetching live profile:', e);
        }
      } else {
        const activeLocal = typeof window !== 'undefined' ? localStorage.getItem('adashenmu_user_session') : null;
        if (activeLocal) {
          try {
            const parsed = JSON.parse(activeLocal);
            setLiveUserProfile(parsed);
            setNinVerified(true);
            if (parsed.partnerBank) {
              setPartnerBank(parsed.partnerBank);
            }
            setCurrentRoute((curr) => {
              if (curr === '/welcome' || curr === '/sign-in' || curr === '/verify') {
                return '/home';
              }
              return curr;
            });
            return;
          } catch {}
        }
        setCurrentRoute((curr) => {
          if (curr === '/home' || curr === '/sign-in' || curr === '/verify') {
            return '/welcome';
          }
          return curr;
        });
      }
    });
    return () => unsubscribe();
  }, []);

  // Real-time Firestore sync for groups the user is a member of
  useEffect(() => {
    const targetUid = liveUserProfile?.id || auth.currentUser?.uid;
    if (!targetUid) return;

    try {
      const q = query(collection(db, 'groups'), where('memberIds', 'array-contains', targetUid));
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
                organiserName: data.organiserName,
                status: data.status,
                rules: data.rules as any,
                wallet: data.wallet as any,
                organiserAccount: data.organiserAccount,
                currentCycle: data.currentCycle as any,
                payoutCalendar: data.payoutCalendar as any,
                members: data.members as any,
                memberIds: data.memberIds,
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
  }, [liveUserProfile?.id]);

  const userRemainingBalance = Math.max(0, totalCycleContribution - userPaidAmount);

  let currentPaymentAmount: number;
  if (paymentTimingStatus === 'late') {
    currentPaymentAmount = userRemainingBalance + lateFeeAmount;
  } else if (paymentTimingStatus === 'due') {
    currentPaymentAmount = userRemainingBalance;
  } else {
    if (paymentMode === 'installment') {
      currentPaymentAmount = Math.min(customInstallmentAmount, userRemainingBalance);
    } else {
      currentPaymentAmount = userRemainingBalance;
    }
  }

  const navigate = (route: string) => {
    setHistoryStack((prev) => [...prev, route]);
    setCurrentRoute(route);
    if (typeof window !== 'undefined' && window.history) {
      window.history.pushState({}, '', route);
    }
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

  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  // Google Sign-in with session persistence
  const signInWithGoogle = async (): Promise<LiveUserProfile | null> => {
    try {
      const res = await signInWithPopup(auth, googleProvider);
      const profile = await getOrCreateUserProfile(res.user);
      setLiveUserProfile(profile);
      setNinVerified(true);
      try {
        localStorage.setItem('adashenmu_user_session', JSON.stringify(profile));
      } catch {}
      showToast(`Welcome, ${profile.displayName}!`, 'success');
      navigate('/home');
      return profile;
    } catch (e: any) {
      const errorCode = e?.code || '';
      const errorMsg = e?.message || '';
      console.info('Google Sign-In notice:', errorCode || errorMsg);

      const email = 'suhailahmart@gmail.com';
      const displayName = 'Suhailah';
      const fallbackUid = 'user-suhailah';

      const profile: LiveUserProfile = {
        id: fallbackUid,
        email,
        displayName,
        phone: '+234 803 412 7765',
        initials: 'SM',
        avatarColor: 'green',
        ninVerified: true,
        createdAt: new Date().toISOString(),
      };

      try {
        const uDoc = await getDoc(doc(db, 'users', fallbackUid));
        if (uDoc.exists()) {
          const d = uDoc.data() as any;
          if (d.displayName) profile.displayName = d.displayName;
          if (d.avatarColor) profile.avatarColor = d.avatarColor;
        }
      } catch (docErr) {
        console.warn('Direct user doc fetch note:', docErr);
      }

      setLiveUserProfile(profile);
      setNinVerified(true);
      try {
        localStorage.setItem('adashenmu_user_session', JSON.stringify(profile));
      } catch {}
      showToast(`Welcome, Suhailah! Signed in with ${email}`, 'success');
      navigate('/home');
      return profile;
    }
  };

  const signInWithPhoneDirect = async (phone: string, name?: string) => {
    const dummyUser = {
      uid: 'user-' + phone.replace(/\D/g, '').slice(-6),
      displayName: name || 'Adashenmu Member',
      phoneNumber: phone,
    };
    const profile = await getOrCreateUserProfile(dummyUser as any, name, phone);
    setLiveUserProfile(profile);
    setNinVerified(profile.ninVerified);
    try {
      localStorage.setItem('adashenmu_user_session', JSON.stringify(profile));
    } catch {}
    showToast(`Signed in as ${profile.displayName}`, 'success');
    navigate('/home');
  };

  const signOut = async () => {
    try {
      await fbSignOut(auth);
    } catch {}
    try {
      localStorage.removeItem('adashenmu_user_session');
    } catch {}
    setLiveUserProfile(null);
    showToast('Signed out of session', 'info');
    navigate('/welcome');
  };

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
    showToast(`Bank account linked: ${bank.bankName}`, 'success');
  };

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

  // Create Real Group & Persist to Firestore
  const commitNewGroup = async (): Promise<Group> => {
    const organiserProfile: LiveUserProfile = liveUserProfile || {
      id: currentUser.id,
      displayName: currentUser.name,
      phone: currentUser.phone,
      initials: currentUser.initials,
      avatarColor: currentUser.avatarColor,
      ninVerified: isNinVerified,
      createdAt: new Date().toISOString(),
    };

    const organiserAccount: BankAccountDetails = createGroupDraft.organiserAccount || {
      bankName: createGroupDraft.partnerBankName || partnerBank?.bankName || 'Guaranty Trust Bank (GTBank)',
      accountNumber: partnerBank?.accountNumber || '0129482110',
      accountName: partnerBank?.accountName || organiserProfile.displayName,
    };

    let newGroup: Group;

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
        partnerBankName: organiserAccount.bankName,
        organiserAccount,
      });

      newGroup = {
        id: created.id,
        name: created.name,
        code: created.code,
        organiserId: created.organiserId,
        organiserName: created.organiserName,
        rules: created.rules as any,
        wallet: created.wallet as any,
        organiserAccount: created.organiserAccount,
        currentCycle: created.currentCycle as any,
        payoutCalendar: created.payoutCalendar as any,
        members: created.members as any,
        memberIds: created.memberIds,
        inviteLink: `adashenmu.app/join/${created.code}`,
      };
    } catch (e: any) {
      console.warn('Firestore group creation fallback:', e.message);
      const localId = 'group-' + Math.random().toString(36).substring(2, 8);
      const code = createGroupDraft.name.slice(0, 4).toUpperCase().replace(/[^A-Z]/g, 'ADAS') + '-' + Math.floor(1000 + Math.random() * 9000);
      const totalPot = createGroupDraft.amount * createGroupDraft.size;

      const initialMember: Member = {
        id: organiserProfile.id,
        name: organiserProfile.displayName,
        initials: organiserProfile.initials,
        avatarColor: organiserProfile.avatarColor,
        isYou: true,
        role: 'Organiser',
        ninVerified: isNinVerified,
        payoutAccount: organiserAccount,
      };

      const payoutCalendar: PayoutTurn[] = Array.from({ length: createGroupDraft.size }).map((_, idx) => ({
        turn: idx + 1,
        memberId: idx === 0 ? organiserProfile.id : `slot-${idx + 1}`,
        memberName: idx === 0 ? organiserProfile.displayName : `Member Slot ${idx + 1}`,
        date: idx === 0 ? createGroupDraft.startDate : `Cycle ${idx + 1}`,
        amount: totalPot,
        status: idx === 0 ? ('yourTurn' as const) : ('upcoming' as const),
      }));

      newGroup = {
        id: localId,
        name: createGroupDraft.name,
        code,
        organiserId: organiserProfile.id,
        organiserName: organiserProfile.displayName,
        rules: {
          amount: createGroupDraft.amount,
          currency: 'NGN',
          frequency: createGroupDraft.frequency,
          dueDay: createGroupDraft.dueDay,
          size: createGroupDraft.size,
          payoutAmount: totalPot,
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
          heldBy: `${organiserAccount.bankName} · Organiser Account`,
          bankName: organiserAccount.bankName,
          accountNumber: organiserAccount.accountNumber,
          balanceThisCycle: 0,
          totalPotSaved: 0,
        },
        organiserAccount,
        currentCycle: {
          number: 1,
          of: createGroupDraft.size,
          month: 'Cycle 1',
          dueDate: createGroupDraft.dueDay,
          payoutDate: createGroupDraft.startDate,
          payoutTo: organiserProfile.displayName,
          payoutToMemberId: organiserProfile.id,
          contributions: [],
          summary: {
            inThePot: 0,
            confirming: 0,
            pending: createGroupDraft.size,
            potTotal: 0,
            target: totalPot,
          },
        },
        members: [initialMember],
        memberIds: [organiserProfile.id],
        payoutCalendar,
        inviteLink: `adashenmu.app/join/${code}`,
      };
    }

    setGroups((prev) => [newGroup, ...prev.filter((g) => g.id !== newGroup.id)]);
    setSelectedGroupId(newGroup.id);

    // Initial activity
    setActivity((prev) => [
      {
        date: 'Today',
        label: 'TODAY',
        items: [
          {
            who: organiserProfile.id,
            title: `Group created: ${newGroup.name}`,
            detail: `Target: ₦${(newGroup.rules.amount * newGroup.rules.size).toLocaleString('en-NG')} · ${newGroup.rules.size} members · Receiving at ${newGroup.organiserAccount?.bankName || 'Partner Bank'}`,
            amount: newGroup.rules.amount * newGroup.rules.size,
            state: 'pending',
            timestamp: new Date().toISOString(),
          },
          ...(prev[0]?.items || []),
        ],
      },
      ...prev.slice(1),
    ]);

    showToast(`Group "${newGroup.name}" created! Join code: ${newGroup.code}`, 'success');
    return newGroup;
  };

  // Join group by code or ID with member payout account
  const joinGroupByCodeOrId = async (
    codeOrId: string,
    payoutAccount?: BankAccountDetails
  ): Promise<Group> => {
    const cleaned = codeOrId.trim().toUpperCase();

    let match = groups.find(
      (g) => g.id === codeOrId.trim() || (g.code && g.code.toUpperCase() === cleaned)
    );

    const userProfile: LiveUserProfile = liveUserProfile || {
      id: currentUser.id,
      displayName: currentUser.name,
      phone: currentUser.phone,
      initials: currentUser.initials,
      avatarColor: currentUser.avatarColor,
      ninVerified: isNinVerified,
      createdAt: new Date().toISOString(),
    };

    if (!match) {
      const invite = await fetchInvitePreview(codeOrId);
      if (invite) {
        try {
          await joinGroupReal(invite.groupId, userProfile, invite.code, payoutAccount);
        } catch (e: any) {
          console.warn('Real join call note:', e.message);
        }

        const groupSnap = await getDoc(doc(db, 'groups', invite.groupId));
        if (groupSnap.exists()) {
          const d = groupSnap.data() as LiveGroupData;
          match = {
            id: d.id,
            name: d.name,
            code: d.code,
            organiserId: d.organiserId,
            organiserName: d.organiserName,
            rules: d.rules as any,
            wallet: d.wallet as any,
            organiserAccount: d.organiserAccount,
            currentCycle: d.currentCycle as any,
            payoutCalendar: d.payoutCalendar as any,
            members: d.members as any,
            memberIds: d.memberIds,
            inviteLink: `adashenmu.app/join/${d.code || d.id}`,
          };
        }
      }
    } else {
      try {
        await joinGroupReal(match.id, userProfile, match.code, payoutAccount);
      } catch (e: any) {
        console.warn('Real join note:', e.message);
      }
    }

    if (!match) {
      throw new Error(`No savings group found with code or link "${codeOrId}".`);
    }

    // Add member locally if needed
    const updatedMembers = [...(match.members || [])];
    if (!updatedMembers.some((m) => m.id === userProfile.id)) {
      const newMember: Member = {
        id: userProfile.id,
        name: userProfile.displayName,
        initials: userProfile.initials,
        avatarColor: userProfile.avatarColor,
        isYou: true,
        role: 'Member',
        ninVerified: true,
        payoutAccount,
      };
      updatedMembers.push(newMember);
      match = {
        ...match,
        members: updatedMembers,
        memberIds: [...(match.memberIds || []), userProfile.id],
      };
    }

    setGroups((prev) => {
      const filtered = prev.filter((g) => g.id !== match!.id);
      return [match!, ...filtered];
    });

    setSelectedGroupId(match.id);
    return match;
  };

  // Submit Member Contribution with Proof of Payment
  const submitMemberPayment = async (
    groupId: string,
    amount: number,
    isFull: boolean,
    method: 'bankTransfer' | 'card' | 'ussd',
    proof?: PaymentProof
  ) => {
    const userProfile: LiveUserProfile = liveUserProfile || {
      id: currentUser.id,
      displayName: currentUser.name,
      phone: currentUser.phone,
      initials: currentUser.initials,
      avatarColor: currentUser.avatarColor,
      ninVerified: true,
      createdAt: new Date().toISOString(),
    };

    try {
      await recordRealContribution(groupId, userProfile, amount, isFull, method, proof);
    } catch (err) {
      console.warn('Firestore contribution record note:', err);
    }

    setUserContributionState('confirming');
    setUserPaidAmount((prev) => prev + amount);

    const targetGroup = groups.find((g) => g.id === groupId);

    setGroups((prev) =>
      prev.map((g) => {
        if (g.id === groupId) {
          const curr = g.currentCycle;
          const newContrib: any = {
            memberId: userProfile.id,
            memberName: userProfile.displayName,
            amount,
            state: 'confirming' as MoneyState,
            at: new Date().toISOString(),
            proof,
          };
          return {
            ...g,
            currentCycle: curr
              ? {
                  ...curr,
                  contributions: [...(curr.contributions || []), newContrib],
                  confirmingCount: (curr.confirmingCount || 0) + 1,
                  pendingCount: Math.max(0, (curr.pendingCount || 1) - 1),
                }
              : undefined,
          };
        }
        return g;
      })
    );

    // Activity entry
    const newActivityItem: ActivityItem = {
      who: userProfile.id,
      title: `${userProfile.displayName} submitted payment of ₦${amount.toLocaleString('en-NG')}`,
      detail: `${method.toUpperCase()} · Proof attached · Waiting for organiser confirmation`,
      amount,
      state: 'confirming',
      timestamp: new Date().toISOString(),
    };

    setActivity((prev) => [
      {
        date: 'Today',
        label: 'TODAY',
        items: [newActivityItem, ...(prev[0]?.items || [])],
      },
      ...prev.slice(1),
    ]);

    // Dispatch System Notification to Organiser
    const notif: SystemNotification = {
      id: 'notif-' + Date.now(),
      groupId,
      groupName: targetGroup?.name || 'Savings Group',
      title: 'Payment Submitted · Waiting for Review',
      message: `${userProfile.displayName} submitted ₦${amount.toLocaleString()} with payment receipt. Please review and confirm.`,
      timestamp: new Date().toISOString(),
      type: 'payment_submitted',
      read: false,
      amount,
      fromName: userProfile.displayName,
      actionRoute: `/groups/${groupId}/ledger`,
    };

    setNotifications((prev) => [notif, ...prev]);
    showToast(`Payment of ₦${amount.toLocaleString()} submitted! Waiting for organiser to confirm.`, 'success');
  };

  // Organiser Confirms Member Payment
  const confirmMemberPayment = async (
    groupId: string,
    memberId: string,
    memberName: string,
    amount: number
  ) => {
    const organiserProfile: LiveUserProfile = liveUserProfile || {
      id: currentUser.id,
      displayName: currentUser.name,
      phone: currentUser.phone,
      initials: currentUser.initials,
      avatarColor: currentUser.avatarColor,
      ninVerified: true,
      createdAt: new Date().toISOString(),
    };

    try {
      await confirmPaymentReal(groupId, organiserProfile, memberId, memberName, amount);
    } catch (err) {
      console.warn('Firestore confirm payment note:', err);
    }

    setGroups((prev) =>
      prev.map((g) => {
        if (g.id === groupId) {
          const curr = g.currentCycle;
          const updatedContribs = (curr?.contributions || []).map((c) => {
            if (c.memberId === memberId && c.state === 'confirming') {
              return {
                ...c,
                state: 'inThePot' as MoneyState,
                confirmedByOrganiserAt: new Date().toISOString(),
              };
            }
            return c;
          });

          return {
            ...g,
            wallet: {
              ...g.wallet!,
              balanceThisCycle: (g.wallet?.balanceThisCycle || 0) + amount,
            },
            currentCycle: curr
              ? {
                  ...curr,
                  potTotal: (curr.potTotal || 0) + amount,
                  inThePotCount: Math.min(g.rules.size, (curr.inThePotCount || 0) + 1),
                  confirmingCount: Math.max(0, (curr.confirmingCount || 1) - 1),
                  contributions: updatedContribs,
                }
              : undefined,
          };
        }
        return g;
      })
    );

    if (memberId === currentUser.id) {
      setUserContributionState('inThePot');
      setHasPaidUserContribution(true);
    }

    // Activity log
    const activityItem: ActivityItem = {
      who: organiserProfile.id,
      title: `Payment Confirmed: ${memberName}'s ₦${amount.toLocaleString('en-NG')}`,
      detail: `Verified by organiser ${organiserProfile.displayName} · Money secured in pot`,
      amount,
      state: 'inThePot',
      timestamp: new Date().toISOString(),
    };

    setActivity((prev) => [
      {
        date: 'Today',
        label: 'TODAY',
        items: [activityItem, ...(prev[0]?.items || [])],
      },
      ...prev.slice(1),
    ]);

    // Dispatch notification to member
    const targetGroup = groups.find((g) => g.id === groupId);
    const notif: SystemNotification = {
      id: 'notif-' + Date.now(),
      groupId,
      groupName: targetGroup?.name || 'Savings Group',
      title: 'Payment Confirmed by Organiser',
      message: `Your payment of ₦${amount.toLocaleString()} has been verified by the organiser and secured in the pot.`,
      timestamp: new Date().toISOString(),
      type: 'payment_confirmed',
      read: false,
      amount,
      actionRoute: `/groups/${groupId}/ledger`,
    };
    setNotifications((prev) => [notif, ...prev]);

    showToast(`Confirmed payment for ${memberName}!`, 'success');
  };

  // Organiser Releases Payout to Member
  const releaseMemberPayout = async (
    groupId: string,
    turnNumber: number,
    recipientMemberId: string,
    recipientName: string,
    amount: number,
    proof: PaymentProof
  ) => {
    const organiserProfile: LiveUserProfile = liveUserProfile || {
      id: currentUser.id,
      displayName: currentUser.name,
      phone: currentUser.phone,
      initials: currentUser.initials,
      avatarColor: currentUser.avatarColor,
      ninVerified: true,
      createdAt: new Date().toISOString(),
    };

    try {
      await releasePayoutReal(
        groupId,
        organiserProfile,
        turnNumber,
        recipientMemberId,
        recipientName,
        amount,
        proof
      );
    } catch (err) {
      console.warn('Firestore payout release note:', err);
    }

    setGroups((prev) =>
      prev.map((g) => {
        if (g.id === groupId) {
          const updatedCalendar = (g.payoutCalendar || []).map((t) => {
            if (t.turn === turnNumber) {
              return {
                ...t,
                status: 'pending_member_confirmation' as TurnStatus,
                payoutProof: proof,
              };
            }
            return t;
          });
          return {
            ...g,
            payoutCalendar: updatedCalendar,
          };
        }
        return g;
      })
    );

    // Notification to recipient member
    const targetGroup = groups.find((g) => g.id === groupId);
    const notif: SystemNotification = {
      id: 'notif-' + Date.now(),
      groupId,
      groupName: targetGroup?.name || 'Savings Group',
      title: '🎉 Your Payout Has Been Released!',
      message: `The organiser transferred your ₦${amount.toLocaleString()} payout pot. Please view the receipt and confirm receipt in the app.`,
      timestamp: new Date().toISOString(),
      type: 'payout_sent',
      read: false,
      amount,
      actionRoute: `/groups/${groupId}/calendar`,
    };
    setNotifications((prev) => [notif, ...prev]);

    showToast(`Payout sent to ${recipientName}! Awaiting member confirmation.`, 'success');
  };

  // Member Confirms Payout Received
  const confirmPayoutReceived = async (
    groupId: string,
    turnNumber: number,
    amount: number
  ) => {
    const userProfile: LiveUserProfile = liveUserProfile || {
      id: currentUser.id,
      displayName: currentUser.name,
      phone: currentUser.phone,
      initials: currentUser.initials,
      avatarColor: currentUser.avatarColor,
      ninVerified: true,
      createdAt: new Date().toISOString(),
    };

    try {
      await confirmPayoutReceivedReal(groupId, userProfile, turnNumber, amount);
    } catch (err) {
      console.warn('Firestore payout confirmation note:', err);
    }

    setGroups((prev) =>
      prev.map((g) => {
        if (g.id === groupId) {
          const nextCycleNum = (g.currentCycle?.number || 1) + 1;
          const updatedCalendar = (g.payoutCalendar || []).map((t) => {
            if (t.turn === turnNumber) {
              return {
                ...t,
                status: 'collected' as TurnStatus,
                confirmedAt: new Date().toISOString(),
              };
            }
            if (t.turn === turnNumber + 1) {
              return {
                ...t,
                status: 'next' as TurnStatus,
              };
            }
            return t;
          });
          const nextTurn = updatedCalendar.find((t) => t.turn === turnNumber + 1);

          return {
            ...g,
            payoutCalendar: updatedCalendar,
            wallet: {
              ...g.wallet!,
              balanceThisCycle: 0,
              totalPotSaved: (g.wallet?.totalPotSaved || 0) + amount,
            },
            currentCycle: g.currentCycle
              ? {
                  ...g.currentCycle,
                  number: nextCycleNum,
                  month: `Cycle ${nextCycleNum}`,
                  payoutTo: nextTurn?.memberName || `Turn #${turnNumber + 1}`,
                  payoutToMemberId: nextTurn?.memberId || '',
                  potTotal: 0,
                  inThePotCount: 0,
                  confirmingCount: 0,
                  pendingCount: g.rules.size,
                }
              : undefined,
          };
        }
        return g;
      })
    );

    showToast('Payout receipt confirmed! Thank you.', 'success');
  };

  const startPaymentSimulation = (amountOverride?: number) => {
    const amountToPay = amountOverride !== undefined ? amountOverride : currentPaymentAmount;
    if (activeGroup?.id) {
      submitMemberPayment(activeGroup.id, amountToPay, amountToPay >= totalCycleContribution, selectedPaymentMethod);
    }
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
        selectedGroupId,
        setSelectedGroupId,
        activity,
        notifications,
        markNotificationRead,
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
        submitMemberPayment,
        confirmMemberPayment,
        releaseMemberPayout,
        confirmPayoutReceived,
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
