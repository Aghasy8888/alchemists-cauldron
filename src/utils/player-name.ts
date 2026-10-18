const PLAYER_NAME_MIN = 2;
const PLAYER_NAME_MAX = 15;
const PLAYER_NAME_PATTERN = /^[\p{L}\p{N} _-]+$/u;

/** True when name is 2–15 chars: letters, digits, space, `_`, `-`. */
export function isValidPlayerName(name: string): boolean {
  const trimmed = name.trim();
  if (trimmed.length < PLAYER_NAME_MIN || trimmed.length > PLAYER_NAME_MAX) {
    return false;
  }
  return PLAYER_NAME_PATTERN.test(trimmed);
}

/** Normalize a valid name for storage (trim). Returns null if invalid. */
export function normalizePlayerName(name: string): string | null {
  const trimmed = name.trim();
  if (!isValidPlayerName(trimmed)) {
    return null;
  }
  return trimmed;
}
