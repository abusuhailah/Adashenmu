import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as fbSignOut,
  onAuthStateChanged,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
  User as FirebaseUser,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { Group, Member, MoneyState } from '../data/types';

// Initialize Firebase App singleton
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Authentication instance
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export { signInWithPopup, fbSignOut, onAuthStateChanged, RecaptchaVerifier, signInWithPhoneNumber };

// Firestore with custom database ID from config
export const db = firebaseConfig.firestoreDatabaseId
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

export interface LiveUserProfile {
  id: string;
  phone: string;
  displayName: string;
  initials: string;
  avatarColor: 'green' | 'gold' | 'blue' | 'clay' | 'grey';
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
  createdAt: string;
}

export interface LiveGroupData {
  id: string;
  name: string;
  code: string;
  organiserId: string;
  organiserName: string;
  rules: {
    amount: number;
    currency: 'NGN';
    frequency: 'weekly' | 'monthly';
    dueDay: string;
    size: number;
    payoutAmount: number;
    payoutOrder: 'fixed' | 'draw' | 'vote';
    lateRule: {
      graceDays: number;
      feeAmount: number;
      feeGoesTo: 'pot';
    };
    startDate: string;
    endDate: string;
    changesNeedGroupVote: true;
  };
  wallet: {
    heldBy: string;
    bankName: string;
    accountNumber: string;
    balanceThisCycle: number;
    totalPotSaved: number;
  };
  currentCycle: {
    number: number;
    of: number;
    month: string;
    dueDate: string;
    payoutDate: string;
    payoutTo: string;
    payoutToMemberId: string;
    target: number;
    potTotal: number;
    inThePotCount: number;
    confirmingCount: number;
    pendingCount: number;
  };
  members: Member[];
  payoutCalendar: {
    turn: number;
    memberId: string;
    date: string;
    amount: number;
    status: 'collected' | 'next' | 'yourTurn' | 'upcoming';
  }[];
  status: 'active' | 'forming' | 'completed';
  createdAt: string;
}

export interface LiveContribution {
  id: string;
  groupId: string;
  memberId: string;
  memberName: string;
  cycleNumber: number;
  amount: number;
  paymentType: 'full' | 'installment';
  paymentMethod: 'ussd' | 'bankTransfer' | 'card';
  state: MoneyState;
  paidAt: string;
}

export interface LiveActivity {
  id: string;
  groupId: string;
  who: string;
  whoName: string;
  title: string;
  detail: string;
  amount: number;
  state: MoneyState;
  timestamp: string;
}

// User Profile helpers
export async function getOrCreateUserProfile(user: FirebaseUser, fallbackName?: string, phone?: string): Promise<LiveUserProfile> {
  const userRef = doc(db, 'users', user.uid);
  const snap = await getDoc(userRef);

  if (snap.exists()) {
    return snap.data() as LiveUserProfile;
  }

  const name = user.displayName || fallbackName || (phone ? `User ${phone.slice(-4)}` : 'Adashenmu Member');
  const initials = name
    .split(' ')
    .filter(Boolean)
    .map((w) => w[0].toUpperCase())
    .slice(0, 2)
    .join('');

  const colors: ('green' | 'gold' | 'blue' | 'clay' | 'grey')[] = ['green', 'gold', 'blue', 'clay'];
  const avatarColor = colors[Math.floor(Math.random() * colors.length)];

  const newProfile: LiveUserProfile = {
    id: user.uid,
    phone: user.phoneNumber || phone || '',
    displayName: name,
    initials: initials || 'ME',
    avatarColor,
    ninVerified: false,
    partnerBank: null,
    createdAt: new Date().toISOString(),
  };

  await setDoc(userRef, newProfile);
  return newProfile;
}

export async function updatePartnerBank(
  userId: string,
  bank: { bankName: string; bankCode: string; accountNumber: string; accountName: string }
) {
  const userRef = doc(db, 'users', userId);
  const partnerBankData = {
    ...bank,
    isVerified: true,
    linkedAt: new Date().toISOString(),
  };
  await updateDoc(userRef, { partnerBank: partnerBankData });
  return partnerBankData;
}

export async function verifyUserNinDoc(userId: string, nin: string, fullName: string) {
  const userRef = doc(db, 'users', userId);
  const patch = {
    nin: nin.slice(0, 3) + '*****' + nin.slice(-3),
    ninVerified: true,
    ninVerifiedAt: new Date().toISOString(),
    displayName: fullName,
  };
  await updateDoc(userRef, patch);
  return patch;
}

// Group helpers
export async function createRealGroup(
  organiser: LiveUserProfile,
  draft: {
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
  }
): Promise<LiveGroupData> {
  const groupId = 'group-' + Math.random().toString(36).substring(2, 8);
  const code = draft.name.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 4) + '-' + Math.floor(1000 + Math.random() * 9000);
  
  const totalPot = draft.amount * draft.size;
  const bankName = draft.partnerBankName || organiser.partnerBank?.bankName || 'Access Bank (CBN Licensed)';
  const accNum = '092' + Math.floor(1000000 + Math.random() * 9000000);

  const initialMember: Member = {
    id: organiser.id,
    name: organiser.displayName,
    initials: organiser.initials,
    avatarColor: organiser.avatarColor,
    isYou: true,
    role: 'Organiser',
    ninVerified: organiser.ninVerified,
  };

  const payoutCalendar = Array.from({ length: draft.size }).map((_, idx) => ({
    turn: idx + 1,
    memberId: idx === 0 ? organiser.id : `slot-${idx + 1}`,
    date: idx === 0 ? draft.startDate : `Cycle ${idx + 1}`,
    amount: totalPot,
    status: idx === 0 ? ('yourTurn' as const) : ('upcoming' as const),
  }));

  const groupData: LiveGroupData = {
    id: groupId,
    name: draft.name,
    code,
    organiserId: organiser.id,
    organiserName: organiser.displayName,
    rules: {
      amount: draft.amount,
      currency: 'NGN',
      frequency: draft.frequency,
      dueDay: draft.dueDay,
      size: draft.size,
      payoutAmount: totalPot,
      payoutOrder: draft.payoutOrder,
      lateRule: {
        graceDays: draft.lateGraceDays,
        feeAmount: draft.lateFee,
        feeGoesTo: 'pot',
      },
      startDate: draft.startDate,
      endDate: draft.endDate,
      changesNeedGroupVote: true,
    },
    wallet: {
      heldBy: 'Licensed partner bank · NDIC Insured',
      bankName,
      accountNumber: accNum,
      balanceThisCycle: 0,
      totalPotSaved: 0,
    },
    currentCycle: {
      number: 1,
      of: draft.size,
      month: 'Cycle 1',
      dueDate: draft.dueDay,
      payoutDate: draft.startDate,
      payoutTo: organiser.displayName,
      payoutToMemberId: organiser.id,
      target: totalPot,
      potTotal: 0,
      inThePotCount: 0,
      confirmingCount: 0,
      pendingCount: draft.size,
    },
    members: [initialMember],
    payoutCalendar,
    status: 'forming',
    createdAt: new Date().toISOString(),
  };

  await setDoc(doc(db, 'groups', groupId), groupData);

  // Add initial activity
  await addDoc(collection(db, 'groups', groupId, 'activities'), {
    groupId,
    who: organiser.id,
    whoName: organiser.displayName,
    title: `Group created: ${draft.name}`,
    detail: `Target: ₦${totalPot.toLocaleString('en-NG')} · ${draft.size} members`,
    amount: totalPot,
    state: 'pending',
    timestamp: new Date().toISOString(),
  });

  return groupData;
}

export async function joinGroupReal(groupId: string, user: LiveUserProfile): Promise<LiveGroupData> {
  const groupRef = doc(db, 'groups', groupId);
  const snap = await getDoc(groupRef);
  if (!snap.exists()) {
    throw new Error('Group not found');
  }

  const group = snap.data() as LiveGroupData;
  const existing = group.members.find((m) => m.id === user.id);
  if (existing) {
    return group; // already joined
  }

  if (group.members.length >= group.rules.size) {
    throw new Error('This group is already at full capacity');
  }

  const newMember: Member = {
    id: user.id,
    name: user.displayName,
    initials: user.initials,
    avatarColor: user.avatarColor,
    isYou: true,
    role: 'Member',
    ninVerified: user.ninVerified,
  };

  const updatedMembers = [...group.members, newMember];

  // Assign slot in payout calendar if available
  const slotIdx = group.payoutCalendar.findIndex((t) => t.memberId.startsWith('slot-'));
  const updatedCalendar = [...group.payoutCalendar];
  if (slotIdx !== -1) {
    updatedCalendar[slotIdx] = {
      ...updatedCalendar[slotIdx],
      memberId: user.id,
    };
  }

  const patch: Partial<LiveGroupData> = {
    members: updatedMembers,
    payoutCalendar: updatedCalendar,
  };

  await updateDoc(groupRef, patch);

  // Activity record
  await addDoc(collection(db, 'groups', groupId, 'activities'), {
    groupId,
    who: user.id,
    whoName: user.displayName,
    title: `${user.displayName} joined the group`,
    detail: `Member #${updatedMembers.length} of ${group.rules.size}`,
    amount: 0,
    state: 'inThePot',
    timestamp: new Date().toISOString(),
  });

  return { ...group, ...patch } as LiveGroupData;
}

export async function recordRealContribution(
  groupId: string,
  user: LiveUserProfile,
  amount: number,
  isFull: boolean,
  method: 'ussd' | 'bankTransfer' | 'card'
) {
  const groupRef = doc(db, 'groups', groupId);
  const groupSnap = await getDoc(groupRef);
  if (!groupSnap.exists()) return;

  const group = groupSnap.data() as LiveGroupData;
  const newBalance = (group.wallet?.balanceThisCycle || 0) + amount;
  const newPotTotal = (group.currentCycle?.potTotal || 0) + amount;

  // Add contribution record
  await addDoc(collection(db, 'groups', groupId, 'contributions'), {
    groupId,
    memberId: user.id,
    memberName: user.displayName,
    cycleNumber: group.currentCycle.number,
    amount,
    paymentType: isFull ? 'full' : 'installment',
    paymentMethod: method,
    state: 'inThePot',
    paidAt: new Date().toISOString(),
  });

  // Update group stats
  await updateDoc(groupRef, {
    'wallet.balanceThisCycle': newBalance,
    'currentCycle.potTotal': newPotTotal,
    'currentCycle.inThePotCount': Math.min(group.rules.size, (group.currentCycle.inThePotCount || 0) + 1),
    'currentCycle.pendingCount': Math.max(0, (group.currentCycle.pendingCount || 1) - 1),
  });

  // Log activity
  await addDoc(collection(db, 'groups', groupId, 'activities'), {
    groupId,
    who: user.id,
    whoName: user.displayName,
    title: isFull ? `${user.displayName} paid full contribution` : `${user.displayName} paid instalment`,
    detail: `${method.toUpperCase()} · ₦${amount.toLocaleString('en-NG')} confirmed in group wallet`,
    amount,
    state: 'inThePot',
    timestamp: new Date().toISOString(),
  });
}
