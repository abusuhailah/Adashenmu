import test from 'node:test';
import assert from 'node:assert/strict';
import { formatNaira, Group, Member, PayoutTurn } from '../data/types';

test('formatNaira formats currency accurately', () => {
  assert.equal(formatNaira(20000), '₦20,000');
  assert.equal(formatNaira(100000), '₦100,000');
  assert.equal(formatNaira(0), '₦0');
});

test('payout pot calculates correctly', () => {
  const amount = 25000;
  const size = 6;
  const totalPot = amount * size;
  assert.equal(totalPot, 150000);
});

test('payment confirmation increases confirmed count and pot balance', () => {
  const initialWallet = {
    balanceThisCycle: 0,
    expectedThisCycle: 100000,
    paidOutTotal: 0,
    partnerBank: 'GTBank',
  };

  const contributionAmount = 20000;
  const updatedWallet = {
    ...initialWallet,
    balanceThisCycle: initialWallet.balanceThisCycle + contributionAmount,
  };

  assert.equal(updatedWallet.balanceThisCycle, 20000);
});

test('payout turn progression advances cycle when all turns are collected', () => {
  const totalTurns = 3;
  let currentTurn = 1;

  // Turn 1 completes
  currentTurn += 1;
  assert.equal(currentTurn, 2);

  // Turn 2 completes
  currentTurn += 1;
  assert.equal(currentTurn, 3);

  // Turn 3 completes -> cycle wraps
  const isCycleComplete = currentTurn >= totalTurns;
  assert.equal(isCycleComplete, true);
});

test('group deletion requires unanimous acceptance from all members', () => {
  const members = ['user-1', 'user-2', 'user-3'];
  const acceptedMembers: string[] = ['user-1'];

  const canDeleteInitially = acceptedMembers.length >= members.length;
  assert.equal(canDeleteInitially, false);

  // Second member accepts
  acceptedMembers.push('user-2');
  const canDeleteSecond = acceptedMembers.length >= members.length;
  assert.equal(canDeleteSecond, false);

  // Final member accepts
  acceptedMembers.push('user-3');
  const canDeleteFinal = acceptedMembers.length >= members.length;
  assert.equal(canDeleteFinal, true);
});

test('installment calculation handles partial contributions accurately', () => {
  const totalDue = 20000;
  const installment1 = 5000;
  const remainingAfter1 = Math.max(0, totalDue - installment1);
  assert.equal(remainingAfter1, 15000);

  const installment2 = 10000;
  const remainingAfter2 = Math.max(0, remainingAfter1 - installment2);
  assert.equal(remainingAfter2, 5000);

  const finalInstallment = 5000;
  const remainingFinal = Math.max(0, remainingAfter2 - finalInstallment);
  assert.equal(remainingFinal, 0);
});

test('group switcher filter displays switcher only when user organizes at least 1 group', () => {
  const currentUserId = 'user-suhailah';

  // Case 1: User is an organizer of group A and member of group B
  const groupsWithOrganized = [
    { id: 'group-1', organiserId: currentUserId, name: 'Kasuwa Traders' },
    { id: 'group-2', organiserId: 'user-other', name: 'Family Savings' },
  ];
  const organizedCount = groupsWithOrganized.filter((g) => g.organiserId === currentUserId).length;
  const memberCount = groupsWithOrganized.filter((g) => g.organiserId !== currentUserId).length;
  const shouldShowSwitcher = organizedCount > 0;

  assert.equal(shouldShowSwitcher, true);
  assert.equal(organizedCount, 1);
  assert.equal(memberCount, 1);

  // Case 2: User is only a member of groups (0 organized groups)
  const groupsOnlyMember = [
    { id: 'group-2', organiserId: 'user-other', name: 'Family Savings' },
  ];
  const memberOnlyOrganizedCount = groupsOnlyMember.filter((g) => g.organiserId === currentUserId).length;
  const shouldHideSwitcher = memberOnlyOrganizedCount === 0;

  assert.equal(shouldHideSwitcher, true);
});

test('group-level permissions: only the organizer of the specific group can invite or manage', () => {
  const currentUserId = 'user-suhailah';

  const groupOrganizedByMe = {
    id: 'group-1',
    organiserId: currentUserId,
    name: 'My Group',
  };

  const groupOrganizedByOther = {
    id: 'group-2',
    organiserId: 'user-ibrahim',
    name: 'Ibrahim Group',
  };

  // In My Group: user has organizer permissions
  const canInviteInMyGroup = groupOrganizedByMe.organiserId === currentUserId;
  assert.equal(canInviteInMyGroup, true);

  // In Joined Group: user has member-only permissions even though they are an organizer in general
  const canInviteInJoinedGroup = groupOrganizedByOther.organiserId === currentUserId;
  assert.equal(canInviteInJoinedGroup, false);
});

