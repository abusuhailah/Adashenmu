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
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { Group, Member, MoneyState, InvitePreview, UserPrivateDetails } from '../data/types';

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
}

export interface LiveGroupData {
  id: string;
  name: string;
  code: string;
  organiserId: string;
  organiserName: string;
  memberIds: string[];
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
  }
): Promise<LiveGroupData> {
  const groupId = 'group-' + Math.random().toString(36).substring(2, 8);
  const code =
    draft.name.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 4) +
    '-' +
    Math.floor(1000 + Math.random() * 9000);

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
    detail: `Target: ₦${totalPot.toLocaleString('en-NG')} · ${draft.size} members`,
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
 * Updates groups/{groupId} adding user.id to memberIds and new Member to members.
 * Keeps invites/{code} memberCount updated.
 */
export async function joinGroupReal(
  groupId: string,
  user: LiveUserProfile,
  knownGroupCode?: string
): Promise<void> {
  const groupRef = doc(db, 'groups', groupId);

  const newMember: Member = {
    id: user.id,
    name: user.displayName,
    initials: user.initials,
    avatarColor: user.avatarColor,
    isYou: true,
    role: 'Member',
    ninVerified: user.ninVerified,
  };

  // Perform atomic join update
  await updateDoc(groupRef, {
    memberIds: arrayUnion(user.id),
    members: arrayUnion(newMember),
  });

  // Now that user is in memberIds, read group details for activity logging
  try {
    const snap = await getDoc(groupRef);
    if (snap.exists()) {
      const gData = snap.data() as LiveGroupData;

      // Update invite previews
      const inviteCode = knownGroupCode || gData.code;
      if (inviteCode) {
        try {
          await updateDoc(doc(db, 'invites', inviteCode), {
            memberCount: gData.members.length,
          });
        } catch {}
      }

      // Add activity entry
      await addDoc(collection(db, 'groups', groupId, 'activities'), {
        groupId,
        who: user.id,
        whoName: user.displayName,
        title: `${user.displayName} joined the group`,
        detail: `Member #${gData.members.length} of ${gData.rules.size}`,
        amount: 0,
        state: 'inThePot',
        timestamp: new Date().toISOString(),
      });
    }
  } catch (err) {
    console.warn('Post-join step notice:', err);
  }
}

/**
 * Records a real contribution:
 * Writes contribution to groups/{groupId}/contributions
 * Updates wallet & currentCycle on groups/{groupId}
 * Adds activity to groups/{groupId}/activities
 */
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
  const newInThePotCount = Math.min(group.rules.size, (group.currentCycle?.inThePotCount || 0) + 1);
  const newPendingCount = Math.max(0, (group.currentCycle?.pendingCount || 1) - 1);

  // 1. Add contribution record (includes both memberId and userId for rule matching)
  await addDoc(collection(db, 'groups', groupId, 'contributions'), {
    groupId,
    memberId: user.id,
    userId: user.id,
    memberName: user.displayName,
    cycleNumber: group.currentCycle.number,
    amount,
    paymentType: isFull ? 'full' : 'installment',
    paymentMethod: method,
    state: 'inThePot',
    paidAt: new Date().toISOString(),
  });

  // 2. Update group wallet and currentCycle fields only
  await updateDoc(groupRef, {
    wallet: {
      ...group.wallet,
      balanceThisCycle: newBalance,
    },
    currentCycle: {
      ...group.currentCycle,
      potTotal: newPotTotal,
      inThePotCount: newInThePotCount,
      pendingCount: newPendingCount,
    },
  });

  // 3. Log activity
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
