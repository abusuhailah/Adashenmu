import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInAnonymously,
  signOut as fbSignOut,
  onAuthStateChanged,
  RecaptchaVerifier,
  signInWithPhoneNumber,
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
  arrayUnion,
  increment,
  deleteField,
  getDocs,
  deleteDoc,
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import {
  Group,
  Member,
  MoneyState,
  InvitePreview,
  UserPrivateDetails,
  BankAccountDetails,
  PaymentProof,
  PayoutTurn,
  TurnStatus,
  GroupDeletionRequest,
} from '../data/types';

// Initialize Firebase App singleton
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Authentication instance
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('email');
googleProvider.addScope('profile');
googleProvider.setCustomParameters({
  prompt: 'select_account',
});

export {
  signInWithPopup,
  signInAnonymously,
  fbSignOut,
  onAuthStateChanged,
  RecaptchaVerifier,
  signInWithPhoneNumber,
};

// Firestore with custom database ID from config
export const db = firebaseConfig.firestoreDatabaseId
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

export interface LiveUserProfile {
  id: string;
  email?: string;
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
  primaryRole?: 'organizer' | 'member';
}

export interface LiveGroupData {
  id: string;
  name: string;
  code: string;
  organiserId: string;
  organiserName: string;
  memberIds: string[];
  deletionRequest?: GroupDeletionRequest;
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
  organiserAccount?: BankAccountDetails;
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
  payoutCalendar: PayoutTurn[];
  status: 'active' | 'forming' | 'completed';
  createdAt: string;
}

export interface LiveContribution {
  id: string;
  groupId: string;
  memberId: string;
  userId: string;
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

/**
 * Loads or creates user profile.
 * Public fields stay in users/{uid}
 * Private fields (NIN, partnerBank) are stored in users/{uid}/private/details
 */
export async function getOrCreateUserProfile(
  user: FirebaseUser,
  fallbackName?: string,
  phone?: string
): Promise<LiveUserProfile> {
  const userRef = doc(db, 'users', user.uid);
  const privateRef = doc(db, 'users', user.uid, 'private', 'details');

  const snap = await getDoc(userRef);

  let publicData: any;
  if (snap.exists()) {
    publicData = snap.data();
  } else {
    const name =
      user.displayName || fallbackName || (phone ? `User ${phone.slice(-4)}` : 'Adashenmu Member');
    const initials = name
      .split(' ')
      .filter(Boolean)
      .map((w) => w[0].toUpperCase())
      .slice(0, 2)
      .join('');

    const colors: ('green' | 'gold' | 'blue' | 'clay' | 'grey')[] = ['green', 'gold', 'blue', 'clay'];
    const avatarColor = colors[Math.floor(Math.random() * colors.length)];

    // Public document ONLY
    publicData = {
      id: user.uid,
      email: user.email || '',
      phone: user.phoneNumber || phone || '',
      displayName: name,
      initials: initials || 'ME',
      avatarColor,
      createdAt: new Date().toISOString(),
    };

    await setDoc(userRef, publicData);
  }

  // Load private details from subcollection
  let privateData: UserPrivateDetails = {
    ninVerified: false,
    partnerBank: null,
  };

  try {
    const privateSnap = await getDoc(privateRef);
    if (privateSnap.exists()) {
      privateData = privateSnap.data() as UserPrivateDetails;
    } else {
      // Check if old public document had legacy private data to migrate
      if (publicData.nin || publicData.partnerBank || publicData.ninVerified) {
        privateData = {
          nin: publicData.nin || undefined,
          ninVerified: !!publicData.ninVerified,
          ninVerifiedAt: publicData.ninVerifiedAt || null,
          partnerBank: publicData.partnerBank || null,
          updatedAt: new Date().toISOString(),
        };
        await setDoc(privateRef, privateData);

        // Delete legacy fields from public document
        await updateDoc(userRef, {
          nin: deleteField(),
          ninVerified: deleteField(),
          ninVerifiedAt: deleteField(),
          partnerBank: deleteField(),
        });
      } else {
        await setDoc(privateRef, privateData);
      }
    }
  } catch (err) {
    console.warn('Private details fetch notice:', err);
  }

  return {
    id: user.uid,
    email: user.email || publicData?.email || '',
    phone: publicData.phone || user.phoneNumber || phone || '',
    displayName: publicData.displayName || user.displayName || 'Adashenmu Member',
    initials: publicData.initials || 'ME',
    avatarColor: publicData.avatarColor || 'clay',
    nin: privateData.nin,
    ninVerified: !!privateData.ninVerified,
    ninVerifiedAt: privateData.ninVerifiedAt,
    partnerBank: privateData.partnerBank || null,
    createdAt: publicData.createdAt || new Date().toISOString(),
  };
}

/**
 * Stores partner bank details exclusively in users/{userId}/private/details
 */
export async function updatePartnerBank(
  userId: string,
  bank: { bankName: string; bankCode: string; accountNumber: string; accountName: string }
) {
  const privateRef = doc(db, 'users', userId, 'private', 'details');
  const partnerBankData = {
    ...bank,
    isVerified: true,
    linkedAt: new Date().toISOString(),
  };

  await setDoc(
    privateRef,
    {
      partnerBank: partnerBankData,
      updatedAt: new Date().toISOString(),
    },
    { merge: true }
  );

  return partnerBankData;
}

/**
 * Updates displayName in users/{userId} and stores NIN in users/{userId}/private/details
 */
export async function verifyUserNinDoc(userId: string, nin: string, fullName: string) {
  const userRef = doc(db, 'users', userId);
  const privateRef = doc(db, 'users', userId, 'private', 'details');

  const maskedNin = nin.slice(0, 3) + '*****' + nin.slice(-3);
  const timestamp = new Date().toISOString();

  // Public doc: update display name only
  await updateDoc(userRef, {
    displayName: fullName,
  });

  // Private subcollection: store verified NIN
  await setDoc(
    privateRef,
    {
      nin: maskedNin,
      ninVerified: true,
      ninVerifiedAt: timestamp,
      updatedAt: timestamp,
    },
    { merge: true }
  );

  return {
    nin: maskedNin,
    ninVerified: true,
    ninVerifiedAt: timestamp,
    displayName: fullName,
  };
}

/**
 * Creates a real group with memberIds: [organiserId], and creates an invites/{code} preview document
 */
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
    organiserAccount?: BankAccountDetails;
  }
): Promise<LiveGroupData> {
  const groupId = 'group-' + Math.random().toString(36).substring(2, 8);
  const code =
    draft.name.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 4) +
    '-' +
    Math.floor(1000 + Math.random() * 9000);

  const totalPot = draft.amount * draft.size;
  const bankName =
    draft.organiserAccount?.bankName ||
    draft.partnerBankName ||
    organiser.partnerBank?.bankName ||
    'Organizer Bank Account';

  const accNum =
    draft.organiserAccount?.accountNumber ||
    organiser.partnerBank?.accountNumber ||
    '';

  const accName =
    draft.organiserAccount?.accountName ||
    organiser.partnerBank?.accountName ||
    organiser.displayName;

  const organiserAccount: BankAccountDetails = {
    bankName,
    accountNumber: accNum,
    accountName: accName,
  };

  const initialMember: Member = {
    id: organiser.id,
    name: organiser.displayName,
    initials: organiser.initials,
    avatarColor: organiser.avatarColor,
    isYou: true,
    role: 'Organiser',
    ninVerified: organiser.ninVerified,
    payoutAccount: organiserAccount,
  };

  const payoutCalendar: PayoutTurn[] = Array.from({ length: draft.size }).map((_, idx) => ({
    turn: idx + 1,
    memberId: idx === 0 ? organiser.id : `slot-${idx + 1}`,
    memberName: idx === 0 ? organiser.displayName : `Member Slot ${idx + 1}`,
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
    memberIds: [organiser.id],
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
      heldBy: `${bankName} · Organiser Account`,
      bankName,
      accountNumber: accNum,
      balanceThisCycle: 0,
      totalPotSaved: 0,
    },
    organiserAccount,
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

  // 1. Create full group document
  await setDoc(doc(db, 'groups', groupId), groupData);

  // 2. Create public invite preview documents (by code and by groupId)
  const invitePreview: InvitePreview = {
    code,
    groupId,
    name: draft.name,
    amount: draft.amount,
    currency: 'NGN',
    frequency: draft.frequency,
    dueDay: draft.dueDay,
    size: draft.size,
    memberCount: 1,
    organiserName: organiser.displayName,
    organiserId: organiser.id,
    status: 'forming',
    createdAt: new Date().toISOString(),
    organiserAccount,
  };

  await setDoc(doc(db, 'invites', code), invitePreview);
  if (code !== groupId) {
    await setDoc(doc(db, 'invites', groupId), invitePreview);
  }

  // 3. Add initial activity
  await addDoc(collection(db, 'groups', groupId, 'activities'), {
    groupId,
    who: organiser.id,
    whoName: organiser.displayName,
    title: `Group created: ${draft.name}`,
    detail: `Target: ₦${totalPot.toLocaleString('en-NG')} · ${draft.size} members · Receiving at ${bankName}`,
    amount: totalPot,
    state: 'pending',
    timestamp: new Date().toISOString(),
  });

  return groupData;
}

/**
 * Reads safe preview info from invites/{code}
 */
export async function fetchInvitePreview(codeOrId: string): Promise<InvitePreview | null> {
  const cleaned = codeOrId.trim().toUpperCase();

  // 1. Direct get from invites/{code}
  try {
    const snap = await getDoc(doc(db, 'invites', cleaned));
    if (snap.exists()) {
      return snap.data() as InvitePreview;
    }
  } catch {}

  // 2. Try raw code/id
  try {
    const snap = await getDoc(doc(db, 'invites', codeOrId.trim()));
    if (snap.exists()) {
      return snap.data() as InvitePreview;
    }
  } catch {}

  // 3. Query invites by code or groupId
  try {
    const q1 = query(collection(db, 'invites'), where('code', '==', cleaned));
    const s1 = await getDocs(q1);
    if (!s1.empty) {
      return s1.docs[0].data() as InvitePreview;
    }

    const q2 = query(collection(db, 'invites'), where('groupId', '==', codeOrId.trim()));
    const s2 = await getDocs(q2);
    if (!s2.empty) {
      return s2.docs[0].data() as InvitePreview;
    }
  } catch {}

  return null;
}

/**
 * Joins a group as non-member:
 * Updates groups/{groupId} adding user.id to memberIds and new Member to members with their payout bank details.
 * Keeps invites/{code} memberCount updated.
 */
export async function joinGroupReal(
  groupId: string,
  user: LiveUserProfile,
  knownGroupCode?: string,
  payoutAccount?: BankAccountDetails
): Promise<void> {
  const groupRef = doc(db, 'groups', groupId);
  const snap = await getDoc(groupRef);
  if (!snap.exists()) return;
  const gData = snap.data() as LiveGroupData;

  const newMember: Member = {
    id: user.id,
    name: user.displayName,
    initials: user.initials,
    avatarColor: user.avatarColor,
    isYou: true,
    role: 'Member',
    ninVerified: user.ninVerified,
    payoutAccount: payoutAccount || (user.partnerBank ? {
      bankName: user.partnerBank.bankName,
      accountNumber: user.partnerBank.accountNumber,
      accountName: user.partnerBank.accountName,
    } : undefined),
  };

  // Find next unassigned payout calendar slot
  const updatedCalendar = [...gData.payoutCalendar];
  const nextSlotIndex = updatedCalendar.findIndex((t) => !t.memberId || t.memberId.startsWith('slot-'));
  if (nextSlotIndex !== -1) {
    updatedCalendar[nextSlotIndex] = {
      ...updatedCalendar[nextSlotIndex],
      memberId: user.id,
      memberName: user.displayName,
    };
  }

  // Perform atomic join update
  await updateDoc(groupRef, {
    memberIds: arrayUnion(user.id),
    members: arrayUnion(newMember),
    payoutCalendar: updatedCalendar,
  });

  // Update invite previews
  const inviteCode = knownGroupCode || gData.code;
  if (inviteCode) {
    try {
      await updateDoc(doc(db, 'invites', inviteCode), {
        memberCount: gData.members.length + 1,
      });
    } catch {}
  }

  // Add activity entry
  try {
    await addDoc(collection(db, 'groups', groupId, 'activities'), {
      groupId,
      who: user.id,
      whoName: user.displayName,
      title: `${user.displayName} joined the group`,
      detail: `Member #${gData.members.length + 1} of ${gData.rules.size} · Payout Turn #${nextSlotIndex !== -1 ? nextSlotIndex + 1 : gData.members.length + 1}`,
      amount: 0,
      state: 'inThePot',
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.warn('Post-join activity notice:', err);
  }
}

/**
 * Records a real contribution:
 * Writes contribution to groups/{groupId}/contributions with state: 'confirming' and attached proof of payment
 * Adds activity to groups/{groupId}/activities
 */
export async function recordRealContribution(
  groupId: string,
  user: LiveUserProfile,
  amount: number,
  isFull: boolean,
  method: 'ussd' | 'bankTransfer' | 'card',
  proof?: PaymentProof
) {
  const groupRef = doc(db, 'groups', groupId);
  const groupSnap = await getDoc(groupRef);
  if (!groupSnap.exists()) return;

  const group = groupSnap.data() as LiveGroupData;

  // 1. Add contribution record with state: 'confirming'
  await addDoc(collection(db, 'groups', groupId, 'contributions'), {
    groupId,
    memberId: user.id,
    userId: user.id,
    memberName: user.displayName,
    cycleNumber: group.currentCycle.number,
    amount,
    paymentType: isFull ? 'full' : 'installment',
    paymentMethod: method,
    state: 'confirming',
    proof: proof || null,
    paidAt: new Date().toISOString(),
  });

  // 2. Update confirming count on group currentCycle
  const newConfirmingCount = (group.currentCycle?.confirmingCount || 0) + 1;
  const newPendingCount = Math.max(0, (group.currentCycle?.pendingCount || 1) - 1);

  await updateDoc(groupRef, {
    currentCycle: {
      ...group.currentCycle,
      confirmingCount: newConfirmingCount,
      pendingCount: newPendingCount,
    },
  });

  // 3. Log activity
  await addDoc(collection(db, 'groups', groupId, 'activities'), {
    groupId,
    who: user.id,
    whoName: user.displayName,
    title: `${user.displayName} submitted payment of ₦${amount.toLocaleString('en-NG')}`,
    detail: `Transfer to organiser account · Proof attached · Waiting for organiser confirmation`,
    amount,
    state: 'confirming',
    timestamp: new Date().toISOString(),
  });
}

/**
 * Organiser confirms member's payment:
 * Moves state to 'inThePot', increases wallet balance and pot total, logs verified activity
 */
export async function confirmPaymentReal(
  groupId: string,
  organiser: LiveUserProfile,
  memberId: string,
  memberName: string,
  amount: number
) {
  const groupRef = doc(db, 'groups', groupId);
  const groupSnap = await getDoc(groupRef);
  if (!groupSnap.exists()) return;

  const group = groupSnap.data() as LiveGroupData;
  const newBalance = (group.wallet?.balanceThisCycle || 0) + amount;
  const newPotTotal = (group.currentCycle?.potTotal || 0) + amount;
  const newInThePotCount = Math.min(group.rules.size, (group.currentCycle?.inThePotCount || 0) + 1);
  const newConfirmingCount = Math.max(0, (group.currentCycle?.confirmingCount || 1) - 1);

  await updateDoc(groupRef, {
    wallet: {
      ...group.wallet,
      balanceThisCycle: newBalance,
    },
    currentCycle: {
      ...group.currentCycle,
      potTotal: newPotTotal,
      inThePotCount: newInThePotCount,
      confirmingCount: newConfirmingCount,
    },
  });

  await addDoc(collection(db, 'groups', groupId, 'activities'), {
    groupId,
    who: organiser.id,
    whoName: organiser.displayName,
    title: `Payment Confirmed: ${memberName}'s ₦${amount.toLocaleString('en-NG')}`,
    detail: `Verified by organiser ${organiser.displayName} · Money secured in pot`,
    amount,
    state: 'inThePot',
    timestamp: new Date().toISOString(),
  });
}

/**
 * Organiser releases payout to the recipient member whose turn it is:
 * Attaches payout proof, marks turn status as 'pending_member_confirmation'
 */
export async function releasePayoutReal(
  groupId: string,
  organiser: LiveUserProfile,
  turnNumber: number,
  recipientMemberId: string,
  recipientName: string,
  amount: number,
  proof: PaymentProof
) {
  const groupRef = doc(db, 'groups', groupId);
  const groupSnap = await getDoc(groupRef);
  if (!groupSnap.exists()) return;

  const group = groupSnap.data() as LiveGroupData;
  const updatedCalendar = group.payoutCalendar.map((t) => {
    if (t.turn === turnNumber) {
      return {
        ...t,
        status: 'pending_member_confirmation' as TurnStatus,
        payoutProof: proof,
      };
    }
    return t;
  });

  await updateDoc(groupRef, {
    payoutCalendar: updatedCalendar,
  });

  await addDoc(collection(db, 'groups', groupId, 'activities'), {
    groupId,
    who: organiser.id,
    whoName: organiser.displayName,
    title: `Payout Released: ₦${amount.toLocaleString('en-NG')} sent to ${recipientName}`,
    detail: `Proof of payment attached · Waiting for ${recipientName} to confirm receipt`,
    amount,
    state: 'confirming',
    timestamp: new Date().toISOString(),
  });
}

/**
 * Recipient member confirms receiving payout:
 * Marks turn as 'collected', advances group to next cycle, and rotates next turn!
 */
export async function confirmPayoutReceivedReal(
  groupId: string,
  member: LiveUserProfile,
  turnNumber: number,
  amount: number
) {
  const groupRef = doc(db, 'groups', groupId);
  const groupSnap = await getDoc(groupRef);
  if (!groupSnap.exists()) return;

  const group = groupSnap.data() as LiveGroupData;
  const nextCycleNum = (group.currentCycle?.number || 1) + 1;

  const updatedCalendar = group.payoutCalendar.map((t) => {
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

  await updateDoc(groupRef, {
    payoutCalendar: updatedCalendar,
    wallet: {
      ...group.wallet,
      balanceThisCycle: 0,
      totalPotSaved: (group.wallet?.totalPotSaved || 0) + amount,
    },
    currentCycle: {
      ...group.currentCycle,
      number: nextCycleNum,
      month: `Cycle ${nextCycleNum}`,
      payoutTo: nextTurn?.memberName || `Turn #${turnNumber + 1}`,
      payoutToMemberId: nextTurn?.memberId || '',
      potTotal: 0,
      inThePotCount: 0,
      confirmingCount: 0,
      pendingCount: group.rules.size,
    },
  });

  await addDoc(collection(db, 'groups', groupId, 'activities'), {
    groupId,
    who: member.id,
    whoName: member.displayName,
    title: `Payout Completed: ${member.displayName} confirmed receipt`,
    detail: `₦${amount.toLocaleString('en-NG')} received in bank account · Cycle ${group.currentCycle?.number} completed!`,
    amount,
    state: 'released',
    timestamp: new Date().toISOString(),
  });
}

/**
 * Save user's primary chosen role ('organizer' | 'member')
 */
export async function saveUserPrimaryRole(userId: string, role: 'organizer' | 'member') {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, { primaryRole: role });
  } catch (err) {
    console.warn('Could not save primaryRole to firestore:', err);
  }
}

/**
 * Organiser requests to delete/close the group with member consent.
 */
export async function requestGroupDeletionReal(
  groupId: string,
  organiser: LiveUserProfile,
  totalMembersCount: number
) {
  const groupRef = doc(db, 'groups', groupId);
  const deletionRequest: GroupDeletionRequest = {
    requestedAt: new Date().toISOString(),
    requestedBy: organiser.id,
    status: 'pending',
    acceptedMemberIds: [organiser.id],
    totalMembersCount,
  };

  await updateDoc(groupRef, { deletionRequest });

  await addDoc(collection(db, 'groups', groupId, 'activities'), {
    groupId,
    who: organiser.id,
    whoName: organiser.displayName,
    title: 'Group Closure Requested',
    detail: `Organiser ${organiser.displayName} requested group deletion. All members must confirm approval.`,
    amount: 0,
    state: 'confirming',
    timestamp: new Date().toISOString(),
  });
}

/**
 * Group member approves deletion request
 */
export async function approveGroupDeletionReal(
  groupId: string,
  member: LiveUserProfile
) {
  const groupRef = doc(db, 'groups', groupId);
  const groupSnap = await getDoc(groupRef);
  if (!groupSnap.exists()) return;

  const data = groupSnap.data() as LiveGroupData;
  const currentReq = data.deletionRequest;
  if (!currentReq) return;

  const existingAccepted = currentReq.acceptedMemberIds || [];
  const updatedAccepted = existingAccepted.includes(member.id)
    ? existingAccepted
    : [...existingAccepted, member.id];

  const allAccepted = updatedAccepted.length >= (data.memberIds?.length || 1);

  const updatedReq: GroupDeletionRequest = {
    ...currentReq,
    acceptedMemberIds: updatedAccepted,
    status: allAccepted ? 'approved' : 'pending',
  };

  await updateDoc(groupRef, { deletionRequest: updatedReq });

  await addDoc(collection(db, 'groups', groupId, 'activities'), {
    groupId,
    who: member.id,
    whoName: member.displayName,
    title: 'Closure Consent Approved',
    detail: `${member.displayName} approved the group closure request (${updatedAccepted.length} of ${data.memberIds?.length || 1} confirmed).`,
    amount: 0,
    state: 'released',
    timestamp: new Date().toISOString(),
  });
}

/**
 * Organiser executes deletion once all members have approved
 */
export async function executeGroupDeletionReal(groupId: string, inviteCode?: string) {
  const groupRef = doc(db, 'groups', groupId);
  await deleteDoc(groupRef);

  if (inviteCode) {
    try {
      const inviteRef = doc(db, 'invites', inviteCode.toUpperCase());
      await deleteDoc(inviteRef);
    } catch {}
  }
}

