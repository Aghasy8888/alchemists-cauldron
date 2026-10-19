import { DIFFICULTY, type Difficulty } from '../data/types';
import { normalizePlayerName } from '../utils/player-name';

const { easy, medium, hard } = DIFFICULTY;

const LEGACY_LEADERBOARD_KEY = 'alchemists-cauldron:leaderboard';

export const LEADERBOARD_MAX_ENTRIES = 10;

const ALL_DIFFICULTIES: readonly Difficulty[] = [easy, medium, hard];

export interface ILeaderboardEntry {
  name: string;
  score: number;
  createdAt: number;
}

/** Entry with difficulty for the merged leaderboard table. */
export interface ILeaderboardRow extends ILeaderboardEntry {
  difficulty: Difficulty;
}

export function leaderboardStorageKey(difficulty: Difficulty): string {
  return `alchemists-cauldron:leaderboard:${difficulty}`;
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

function persistEntries(difficulty: Difficulty, entries: ILeaderboardEntry[]): void {
  try {
    localStorage.setItem(leaderboardStorageKey(difficulty), JSON.stringify(entries));
  } catch {
    // Storage full or blocked — keep UI running without crashing.
  }
}

function readEntriesFromKey(key: string): ILeaderboardEntry[] | null {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) {
      return null;
    }
    const data: unknown = JSON.parse(raw);
    if (!isLeaderboardArray(data)) {
      localStorage.removeItem(key);
      return [];
    }
    return sortLeaderboardEntries(data).slice(0, LEADERBOARD_MAX_ENTRIES);
  } catch {
    try {
      localStorage.removeItem(key);
    } catch {
      // ignore remove failures
    }
    return [];
  }
}

/** Migrate Level-1 single-key board into the Medium key once. */
function migrateLegacyLeaderboard(): void {
  try {
    const legacy = localStorage.getItem(LEGACY_LEADERBOARD_KEY);
    if (legacy === null) {
      return;
    }
    const mediumKey = leaderboardStorageKey(medium);
    const existingMedium = localStorage.getItem(mediumKey);
    if (existingMedium === null) {
      const parsed = readEntriesFromKey(LEGACY_LEADERBOARD_KEY);
      if (parsed !== null && parsed.length > 0) {
        persistEntries(medium, parsed);
      }
    }
    localStorage.removeItem(LEGACY_LEADERBOARD_KEY);
  } catch {
    try {
      localStorage.removeItem(LEGACY_LEADERBOARD_KEY);
    } catch {
      // ignore
    }
  }
}

/** Load Top-10 for one difficulty; broken / missing data yields `[]`. */
export function loadLeaderboard(difficulty: Difficulty): ILeaderboardEntry[] {
  migrateLegacyLeaderboard();
  const loaded = readEntriesFromKey(leaderboardStorageKey(difficulty));
  return loaded ?? [];
}

/** Merge all difficulty boards for the table (each row tagged with difficulty). */
export function loadAllLeaderboards(): ILeaderboardRow[] {
  migrateLegacyLeaderboard();
  const rows: ILeaderboardRow[] = [];
  for (const difficulty of ALL_DIFFICULTIES) {
    for (const entry of loadLeaderboard(difficulty)) {
      rows.push({ ...entry, difficulty });
    }
  }
  return [...rows].sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    return a.createdAt - b.createdAt;
  });
}

/** Clear all per-difficulty leaderboard keys. */
export function clearLeaderboard(): void {
  migrateLegacyLeaderboard();
  for (const difficulty of ALL_DIFFICULTIES) {
    try {
      localStorage.removeItem(leaderboardStorageKey(difficulty));
    } catch {
      // ignore
    }
  }
  try {
    localStorage.removeItem(LEGACY_LEADERBOARD_KEY);
  } catch {
    // ignore
  }
}

/**
 * Validate name, insert into the difficulty board, sort, trim to Top-10, save.
 * Returns the updated list for that difficulty, or null if the name is invalid.
 */
export function addLeaderboardEntry(
  name: string,
  score: number,
  difficulty: Difficulty,
  createdAt: number = Date.now(),
): ILeaderboardEntry[] | null {
  const normalized = normalizePlayerName(name);
  if (normalized === null) {
    return null;
  }

  const entries = loadLeaderboard(difficulty);
  entries.push({ name: normalized, score, createdAt });
  const next = sortLeaderboardEntries(entries).slice(0, LEADERBOARD_MAX_ENTRIES);
  persistEntries(difficulty, next);
  return next;
}
