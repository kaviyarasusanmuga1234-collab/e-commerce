import test from 'node:test';
import assert from 'node:assert/strict';
import { getTrackingSteps, getTrackingProgressPercent } from './tracking.ts';
import type { OrderStatus } from './tracking.ts';

test('getTrackingProgressPercent computes exact progression', () => {
  assert.equal(getTrackingProgressPercent('ORDER_PLACED'), 15);
  assert.equal(getTrackingProgressPercent('PACKED'), 40);
  assert.equal(getTrackingProgressPercent('SHIPPED'), 65);
  assert.equal(getTrackingProgressPercent('OUT_FOR_DELIVERY'), 88);
  assert.equal(getTrackingProgressPercent('DELIVERED'), 100);
});

test('getTrackingSteps marks prior steps as completed', () => {
  const steps = getTrackingSteps('SHIPPED', new Date().toISOString());
  assert.equal(steps.length, 5);
  // ORDER_PLACED should be completed
  assert.equal(steps[0].completed, true);
  // PACKED should be completed
  assert.equal(steps[1].completed, true);
  // SHIPPED should be completed
  assert.equal(steps[2].completed, true);
  // OUT_FOR_DELIVERY should not be completed yet
  assert.equal(steps[3].completed, false);
  // DELIVERED should not be completed yet
  assert.equal(steps[4].completed, false);
});
