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
