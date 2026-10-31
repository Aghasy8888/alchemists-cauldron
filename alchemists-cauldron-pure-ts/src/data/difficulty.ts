import { DIFFICULTY, type Difficulty, type IDifficultyConfig } from './types';

const { easy, medium, hard } = DIFFICULTY;

/** Single source of numbers from the README difficulty table. */
export const DIFFICULTY_CONFIG: Record<Difficulty, IDifficultyConfig> = {
  [easy]: {
    shelfIngredientCount: 4,
    maxCauldronIngredients: 4,
    startingTime: 180,
    recipeTolerance: 12,
    lives: 5,
    scorePerBrew: 100,
    timeBonusPerBrew: 15,
    reactionCount: 0,
  },
  [medium]: {
    shelfIngredientCount: 6,
    maxCauldronIngredients: 4,
    startingTime: 150,
    recipeTolerance: 8,
    lives: 3,
    scorePerBrew: 200,
    timeBonusPerBrew: 10,
    reactionCount: 2,
  },
  [hard]: {
    shelfIngredientCount: 8,
    maxCauldronIngredients: 5,
    startingTime: 150,
    recipeTolerance: 5,
    lives: 3,
    scorePerBrew: 300,
    timeBonusPerBrew: 5,
    reactionCount: 3,
  },
};

/** Default / Level 1 difficulty (Medium). */
export const LEVEL_1_DIFFICULTY: Difficulty = medium;

const DIFFICULTY_LABEL: Record<Difficulty, string> = {
  [easy]: 'Easy',
  [medium]: 'Medium',
  [hard]: 'Hard',
};

/** Short display name for a difficulty. */
export function difficultyLabel(difficulty: Difficulty): string {
  return DIFFICULTY_LABEL[difficulty];
}

/** Settings button text built from `DIFFICULTY_CONFIG`. */
export function difficultyButtonLabel(difficulty: Difficulty): string {
  const config = DIFFICULTY_CONFIG[difficulty];
  return `${DIFFICULTY_LABEL[difficulty]} — ${config.startingTime}s · ${config.lives} lives`;
}
