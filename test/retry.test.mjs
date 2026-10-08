import test from 'node:test';
import assert from 'node:assert/strict';
import { retryDelayMs, retryLabel } from '../dist/retry.js';

test('grows exponentially and caps', () => {
  assert.deepEqual([0, 1, 2, 3, 4].map(retryDelayMs), [250, 500, 1000, 2000, 2000]);
});
test('huge attempts do not overflow', () => {
  // Cover Rust's u64 multiplication/power saturation and JavaScript's
  // finite-to-Infinity exponentiation boundary, as well as the u32 maximum.
  for (const attempt of [32, 56, 57, 63, 64, 1023, 1024, 0xffffffff]) {
    assert.equal(retryDelayMs(attempt), 2000, `attempt ${attempt}`);
  }
});
test('rejects invalid attempt indices', () => {
  for (const attempt of [-1, 1.5, NaN, Infinity, 0x100000000]) {
    assert.throws(() => retryDelayMs(attempt), RangeError);
  }
});
test('preserves the target-only label helper', () => {
  assert.equal(retryLabel(3), 'retry-3');
});
