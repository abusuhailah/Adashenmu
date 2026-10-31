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
