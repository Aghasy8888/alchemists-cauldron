/** Canonical difficulty values — destructure in consumers; use bare names (see domain-constants). */
export const DIFFICULTY = {
  easy: 'easy',
  medium: 'medium',
  hard: 'hard',
} as const;

export type Difficulty = (typeof DIFFICULTY)[keyof typeof DIFFICULTY];

/** Canonical game statuses — destructure in consumers; use bare names (see domain-constants). */
export const GAME_STATUS = {
  menu: 'menu',
  playing: 'playing',
  paused: 'paused',
  gameOver: 'game-over',
} as const;

export type GameStatus = (typeof GAME_STATUS)[keyof typeof GAME_STATUS];

export type IngredientIconId =
  | 'dragon-tears'
  | 'fairy-dust'
  | 'frost-lotus'
  | 'mandrake-root'
  | 'caustic-acid'
  | 'essence-of-the-void'
  | 'phoenix-feather'
  | 'toad-slime';

export interface IIngredient {
  id: string;
  name: string;
  icon: IngredientIconId;
  temperature: number;
  density: number;
  magicPower: number;
}

export interface IRecipeRange {
  min: number;
  max: number;
}

export interface IRecipe {
  id: string;
  name: string;
  difficulty: Difficulty;
  temperature: IRecipeRange;
  density: IRecipeRange;
  magicPower: IRecipeRange;
}

export interface IGameState {
  status: GameStatus;
  score: number;
  timeLeft: number;
  /** Absolute timestamp when the run timer hits 0; null when not timing. */
  endTime: number | null;
  lives: number;
  activeRecipe: IRecipe | null;
  cauldronIngredients: IIngredient[];
  shelfStock: Record<string, number>;
  difficulty: Difficulty;
  lastReactionId?: string | null;
  /** Set when status is game-over; cleared on a new run. */
  gameOverReason: string | null;
}

export interface IDifficultyConfig {
  shelfIngredientCount: number;
  maxCauldronIngredients: number;
  startingTime: number;
  recipeTolerance: number;
  lives: number;
  scorePerBrew: number;
  timeBonusPerBrew: number;
  reactionCount: number;
}

export interface ICauldronValues {
  temperature: number;
  density: number;
  magicPower: number;
}

/** Reaction catalog entry — Easy uses none; Medium/Hard enable a subset via reactionCount. */
export interface IReaction {
  id: string;
  name: string;
  difficulty: Exclude<Difficulty, 'easy'>;
  isActive: (ingredients: readonly IIngredient[]) => boolean;
  apply: (values: ICauldronValues) => ICauldronValues;
}
