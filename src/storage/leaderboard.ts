import { normalizePlayerName } from '../utils/player-name';

export const LEADERBOARD_STORAGE_KEY = 'alchemists-cauldron:leaderboard';

export const LEADERBOARD_MAX_ENTRIES = 10;

export interface ILeaderboardEntry {
  name: string;
  score: number;
  createdAt: number;
}

function isLeaderboardEntry(value: unknown): value is ILeaderboardEntry {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  const entry = value as Record<string, unknown>;
  return (
    typeof entry.name === 'string' &&
    typeof entry.score === 'number' &&
    Number.isFinite(entry.score) &&
    typeof entry.createdAt === 'number' &&
    Number.isFinite(entry.createdAt)
  );
}

function isLeaderboardArray(value: unknown): value is ILeaderboardEntry[] {
  return Array.isArray(value) && value.every(isLeaderboardEntry);
}

/** Sort: higher score first; equal scores keep the earlier result higher. */
export function sortLeaderboardEntries(entries: ILeaderboardEntry[]): ILeaderboardEntry[] {
  return [...entries].sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    return a.createdAt - b.createdAt;
  });
}

export function qualifiesForLeaderboard(
  score: number,
  entries: readonly ILeaderboardEntry[],
): boolean {
  const ranked = sortLeaderboardEntries([...entries]).slice(0, LEADERBOARD_MAX_ENTRIES);
  if (ranked.length < LEADERBOARD_MAX_ENTRIES) {
    return true;
  }
  const lowest = ranked[LEADERBOARD_MAX_ENTRIES - 1];
  if (lowest === undefined) {
    return true;
  }
  return score > lowest.score;
}

function persistEntries(entries: ILeaderboardEntry[]): void {
  try {
    localStorage.setItem(LEADERBOARD_STORAGE_KEY, JSON.stringify(entries));
  } catch {
    // Storage full or blocked — keep UI running without crashing.
  }
}

/** Load Top-10; broken / missing data yields `[]` and clears the bad key. */
export function loadLeaderboard(): ILeaderboardEntry[] {
  try {
    const raw = localStorage.getItem(LEADERBOARD_STORAGE_KEY);
    if (raw === null) {
      return [];
    }
    const data: unknown = JSON.parse(raw);
    if (!isLeaderboardArray(data)) {
      localStorage.removeItem(LEADERBOARD_STORAGE_KEY);
      return [];
    }
    return sortLeaderboardEntries(data).slice(0, LEADERBOARD_MAX_ENTRIES);
  } catch {
    try {
      localStorage.removeItem(LEADERBOARD_STORAGE_KEY);
    } catch {
      // ignore remove failures
    }
    return [];
  }
}

export function clearLeaderboard(): void {
  try {
    localStorage.removeItem(LEADERBOARD_STORAGE_KEY);
  } catch {
    // ignore
  }
}

/**
 * Validate name, insert score, sort, trim to Top-10, save.
 * Returns the updated list, or null if the name is invalid.
 */
export function addLeaderboardEntry(
  name: string,
  score: number,
  createdAt: number = Date.now(),
): ILeaderboardEntry[] | null {
  const normalized = normalizePlayerName(name);
  if (normalized === null) {
    return null;
  }

  const entries = loadLeaderboard();
  entries.push({ name: normalized, score, createdAt });
  const next = sortLeaderboardEntries(entries).slice(0, LEADERBOARD_MAX_ENTRIES);
  persistEntries(next);
  return next;
}
