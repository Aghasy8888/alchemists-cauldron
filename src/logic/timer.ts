/** Build an absolute end timestamp from remaining whole seconds. */
export function createEndTime(timeLeftSec: number, now: number = Date.now()): number {
  return now + Math.max(0, timeLeftSec) * 1000;
}

/** Remaining whole seconds from an end timestamp (never negative). */
export function getTimeLeftSec(endTime: number, now: number = Date.now()): number {
  return Math.max(0, Math.ceil((endTime - now) / 1000));
}

export const LOW_TIME_THRESHOLD_SEC = 15;
