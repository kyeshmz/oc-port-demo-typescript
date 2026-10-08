import test from 'node:test';
import assert from 'node:assert/strict';
import { retryDelayMs, retryLabel } from '../dist/retry.js';

test('grows exponentially and caps', () => {
  assert.deepEqual([0, 1, 2, 3, 4].map(retryDelayMs), [100, 200, 400, 800, 1000]);
});
test('huge attempts do not overflow', () => {
  assert.equal(retryDelayMs(32), 1000);
  assert.equal(retryDelayMs(0xffffffff), 1000);
});
test('rejects invalid attempt indices', () => {
  for (const attempt of [-1, 1.5, NaN, Infinity, 0x100000000]) {
    assert.throws(() => retryDelayMs(attempt), RangeError);
  }
});
test('preserves the target-only label helper', () => {
  assert.equal(retryLabel(3), 'retry-3');
});
