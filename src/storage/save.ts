import {
  DIFFICULTY,
  GAME_STATUS,
  type Difficulty,
  type IGameState,
  type IIngredient,
  type IngredientIconId,
  type IRecipe,
  type IRecipeRange,
} from '../data/types';
import { getTimeLeftSec } from '../logic/timer';

const { easy, medium, hard } = DIFFICULTY;
const { playing, paused } = GAME_STATUS;

export const SAVE_STORAGE_KEY = 'alchemists-cauldron:save';

const DIFFICULTIES: ReadonlySet<string> = new Set([easy, medium, hard]);
const CONTINUABLE_STATUSES: ReadonlySet<string> = new Set([playing, paused]);

const INGREDIENT_ICONS: ReadonlySet<string> = new Set([
  'dragon-tears',
  'fairy-dust',
  'frost-lotus',
  'mandrake-root',
  'caustic-acid',
  'essence-of-the-void',
  'phoenix-feather',
  'toad-slime',
]);

interface IPersistedSave {
  status: typeof playing | typeof paused;
  difficulty: Difficulty;
  score: number;
  timeLeft: number;
  lives: number;
  activeRecipe: IRecipe | null;
  cauldronIngredients: IIngredient[];
  shelfStock: Record<string, number>;
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

function isRecipeRange(value: unknown): value is IRecipeRange {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  const range = value as Record<string, unknown>;
  return isFiniteNumber(range.min) && isFiniteNumber(range.max);
}

function isDifficulty(value: unknown): value is Difficulty {
  return typeof value === 'string' && DIFFICULTIES.has(value);
}

function isIngredientIcon(value: unknown): value is IngredientIconId {
  return typeof value === 'string' && INGREDIENT_ICONS.has(value);
}

function isIngredient(value: unknown): value is IIngredient {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  const ingredient = value as Record<string, unknown>;
  return (
    typeof ingredient.id === 'string' &&
    typeof ingredient.name === 'string' &&
    isIngredientIcon(ingredient.icon) &&
    isFiniteNumber(ingredient.temperature) &&
    isFiniteNumber(ingredient.density) &&
    isFiniteNumber(ingredient.magicPower)
  );
}

function isRecipe(value: unknown): value is IRecipe {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  const recipe = value as Record<string, unknown>;
  return (
    typeof recipe.id === 'string' &&
    typeof recipe.name === 'string' &&
    isDifficulty(recipe.difficulty) &&
    isRecipeRange(recipe.temperature) &&
    isRecipeRange(recipe.density) &&
    isRecipeRange(recipe.magicPower)
  );
}

function isShelfStock(value: unknown): value is Record<string, number> {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return false;
  }
  return Object.values(value as Record<string, unknown>).every(
    (stock) => typeof stock === 'number' && Number.isFinite(stock) && stock >= 0,
  );
}

function isContinuableStatus(value: unknown): value is typeof playing | typeof paused {
  return typeof value === 'string' && CONTINUABLE_STATUSES.has(value);
}

/** Type guard for a continuable unfinished save payload. */
export function isValidSave(data: unknown): data is IPersistedSave {
  if (typeof data !== 'object' || data === null) {
    return false;
  }
  const save = data as Record<string, unknown>;
  if (!isContinuableStatus(save.status) || !isDifficulty(save.difficulty)) {
    return false;
  }
  if (
    !isFiniteNumber(save.score) ||
    !isFiniteNumber(save.timeLeft) ||
    !isFiniteNumber(save.lives) ||
    save.timeLeft < 0 ||
    save.lives < 0 ||
    save.score < 0
  ) {
    return false;
  }
  if (save.activeRecipe !== null && !isRecipe(save.activeRecipe)) {
    return false;
  }
  if (!Array.isArray(save.cauldronIngredients) || !save.cauldronIngredients.every(isIngredient)) {
    return false;
  }
  if (!isShelfStock(save.shelfStock)) {
    return false;
  }
  return true;
}

function toPersistedSave(state: IGameState, now: number = Date.now()): IPersistedSave | null {
  if (state.status !== playing && state.status !== paused) {
    return null;
  }

  let timeLeft = state.timeLeft;
  if (state.status === playing && state.endTime !== null) {
    timeLeft = getTimeLeftSec(state.endTime, now);
  }

  return {
    status: state.status,
    difficulty: state.difficulty,
    score: state.score,
    timeLeft,
    lives: state.lives,
    activeRecipe: state.activeRecipe,
    cauldronIngredients: state.cauldronIngredients,
    shelfStock: state.shelfStock,
  };
}

function toGameState(save: IPersistedSave): IGameState {
  return {
    status: save.status,
    score: save.score,
    timeLeft: save.timeLeft,
    endTime: null,
    lives: save.lives,
    activeRecipe: save.activeRecipe,
    cauldronIngredients: save.cauldronIngredients,
    shelfStock: save.shelfStock,
    difficulty: save.difficulty,
    lastReactionId: null,
    gameOverReason: null,
  };
}

/** Persist an unfinished run. No-op for menu / game-over. */
export function saveGame(state: IGameState, now: number = Date.now()): void {
  const payload = toPersistedSave(state, now);
  if (payload === null) {
    return;
  }
  try {
    localStorage.setItem(SAVE_STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // Storage full or blocked — keep UI running.
  }
}

/** Load a continuable save, or null if missing / invalid. */
export function loadGame(): IGameState | null {
  try {
    const raw = localStorage.getItem(SAVE_STORAGE_KEY);
    if (raw === null) {
      return null;
    }
    const data: unknown = JSON.parse(raw);
    if (!isValidSave(data)) {
      localStorage.removeItem(SAVE_STORAGE_KEY);
      return null;
    }
    return toGameState(data);
  } catch {
    try {
      localStorage.removeItem(SAVE_STORAGE_KEY);
    } catch {
      // ignore
    }
    return null;
  }
}

/** True when a valid unfinished save exists (for the Continue button). */
export function hasContinuableSave(): boolean {
  return loadGame() !== null;
}

/**
 * Restore a save for Continue Game: always opens paused with frozen timeLeft.
 * Returns null if no valid save.
 */
export function continueSavedGame(): IGameState | null {
  const loaded = loadGame();
  if (loaded === null) {
    return null;
  }
  return {
    ...loaded,
    status: paused,
    endTime: null,
  };
}

export function clearSave(): void {
  try {
    localStorage.removeItem(SAVE_STORAGE_KEY);
  } catch {
    // ignore
  }
}
