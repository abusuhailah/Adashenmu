import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteField,
  collection,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
import { db, LiveUserProfile, LiveGroupData } from './firebase';
import { InvitePreview } from '../data/types';

/**
 * One-time safe migration that:
 * 1. Copies NIN and partnerBank data from users/{uid} into private subcollection users/{uid}/private/details
 * 2. Deletes those sensitive fields from the public users/{uid} document
 * 3. Adds memberIds to existing groups from their members array
 * 4. Creates invites/{code} documents for existing groups
 */
export async function runSafeMigration(user: LiveUserProfile): Promise<void> {
  if (!user || !user.id) return;

  try {
    // 1. Migrate user's private data to users/{uid}/private/details
    const userRef = doc(db, 'users', user.id);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const userData = userSnap.data() as any;
      const hasPrivateFields =
        'nin' in userData ||
        'partnerBank' in userData ||
        'ninVerified' in userData ||
        'ninVerifiedAt' in userData;

      if (hasPrivateFields) {
        const privateRef = doc(db, 'users', user.id, 'private', 'details');
        const privateSnap = await getDoc(privateRef);

        const privatePayload: Record<string, any> = {
          updatedAt: new Date().toISOString(),
        };

        if (userData.nin !== undefined) privatePayload.nin = userData.nin;
        if (userData.ninVerified !== undefined) privatePayload.ninVerified = userData.ninVerified;
        if (userData.ninVerifiedAt !== undefined) privatePayload.ninVerifiedAt = userData.ninVerifiedAt;
        if (userData.partnerBank !== undefined) privatePayload.partnerBank = userData.partnerBank;

        // Save into private subcollection
        await setDoc(privateRef, privatePayload, { merge: true });

        // Remove from public document
        const cleanPatch: Record<string, any> = {};
        if ('nin' in userData) cleanPatch.nin = deleteField();
        if ('ninVerified' in userData) cleanPatch.ninVerified = deleteField();
        if ('ninVerifiedAt' in userData) cleanPatch.ninVerifiedAt = deleteField();
        if ('partnerBank' in userData) cleanPatch.partnerBank = deleteField();

        if (Object.keys(cleanPatch).length > 0) {
          await updateDoc(userRef, cleanPatch);
        }
      }
    }

    // 2. Migrate existing groups where this user is organiser or member
    // Find groups by organiserId or where user is member
    const groupsQuery = query(
      collection(db, 'groups'),
      where('organiserId', '==', user.id)
    );

    const groupSnaps = await getDocs(groupsQuery);
    for (const gDoc of groupSnaps.docs) {
      const gData = gDoc.data() as LiveGroupData;

      // Ensure memberIds array exists
      const existingMembers = gData.members || [];
      const derivedMemberIds = Array.from(
        new Set([gData.organiserId, ...existingMembers.map((m: any) => m.id)])
      );

      if (!gData.memberIds || gData.memberIds.length === 0) {
        await updateDoc(gDoc.ref, { memberIds: derivedMemberIds });
      }

      // Ensure invite document exists
      if (gData.code) {
        const inviteRef = doc(db, 'invites', gData.code);
        const inviteSnap = await getDoc(inviteRef);

        if (!inviteSnap.exists()) {
          const invitePreview: InvitePreview = {
            code: gData.code,
            groupId: gData.id,
            name: gData.name,
            amount: gData.rules?.amount || 5000,
            currency: 'NGN',
            frequency: gData.rules?.frequency || 'weekly',
            dueDay: gData.rules?.dueDay || 'Friday by 6 pm',
            size: gData.rules?.size || 8,
            memberCount: existingMembers.length || 1,
            organiserName: gData.organiserName || user.displayName,
            organiserId: gData.organiserId,
            status: gData.status || 'active',
            createdAt: gData.createdAt || new Date().toISOString(),
          };

          await setDoc(inviteRef, invitePreview);
        }
      }
    }
  } catch (error) {
    console.warn('Migration step notice:', error);
  }
}
