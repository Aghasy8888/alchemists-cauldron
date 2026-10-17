import type { Difficulty, IDifficultyConfig } from './types';

/** Single source of numbers from the README difficulty table. */
export const DIFFICULTY_CONFIG: Record<Difficulty, IDifficultyConfig> = {
  easy: {
    shelfIngredientCount: 4,
    maxCauldronIngredients: 4,
    startingTime: 180,
    recipeTolerance: 12,
    lives: 5,
    scorePerBrew: 100,
    timeBonusPerBrew: 15,
    reactionCount: 0,
  },
  medium: {
    shelfIngredientCount: 6,
    maxCauldronIngredients: 4,
    startingTime: 150,
    recipeTolerance: 8,
    lives: 3,
    scorePerBrew: 200,
    timeBonusPerBrew: 10,
    reactionCount: 2,
  },
  hard: {
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

/** Level 1 always uses Medium. */
export const LEVEL_1_DIFFICULTY: Difficulty = 'medium';
