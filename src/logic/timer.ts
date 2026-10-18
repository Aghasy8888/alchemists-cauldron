/** Build an absolute end timestamp from remaining whole seconds. */
export function createEndTime(timeLeftSec: number, now: number = Date.now()): number {
  return now + Math.max(0, timeLeftSec) * 1000;
}

/** Remaining whole seconds from an end timestamp (never negative). */
export function getTimeLeftSec(endTime: number, now: number = Date.now()): number {
  return Math.max(0, Math.ceil((endTime - now) / 1000));
}

/** Format whole seconds as MM:SS. */
export function formatTime(timeLeftSec: number): string {
  const total = Math.max(0, Math.floor(timeLeftSec));
  const minutes = Math.floor(total / 60);
  const seconds = total % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

export const LOW_TIME_THRESHOLD_SEC = 15;
