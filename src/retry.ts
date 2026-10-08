const BASE_DELAY_MS = 100;
const MAX_DELAY_MS = 1000;

export function retryDelayMs(attempt: number): number {
  if (!Number.isInteger(attempt) || attempt < 0 || attempt > 0xffffffff) {
    throw new RangeError('attempt must be an unsigned 32-bit integer');
  }
  return Math.min(BASE_DELAY_MS * 2 ** attempt, MAX_DELAY_MS);
}

// Target-only behavior that the sync must preserve.
export function retryLabel(attempt: number): string {
  return `retry-${attempt}`;
}
