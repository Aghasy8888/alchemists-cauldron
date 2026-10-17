import { DIFFICULTY_CONFIG, LEVEL_1_DIFFICULTY } from '../data/difficulty';
import { getShelfIngredients } from '../data/ingredients';
import { pickRandomRecipe } from '../logic/recipe-generator';
import { createStock } from '../logic/stock';
import type { IGameState } from '../data/types';

export function createMenuState(): IGameState {
  return {
    status: 'menu',
    score: 0,
    timeLeft: 0,
    lives: 0,
    activeRecipe: null,
    cauldronIngredients: [],
    shelfStock: {},
    difficulty: LEVEL_1_DIFFICULTY,
    lastReactionId: null,
  };
}

/** Starts a new Level 1 run: Medium rules, random stock, empty cauldron, random recipe. */
export function startNewGame(previous: IGameState = createMenuState()): IGameState {
  const difficulty = previous.difficulty;
  const config = DIFFICULTY_CONFIG[difficulty];
  const shelfIngredients = getShelfIngredients(config.shelfIngredientCount);

  return {
    ...previous,
    status: 'playing',
    score: 0,
    timeLeft: config.startingTime,
    lives: config.lives,
    activeRecipe: pickRandomRecipe(difficulty),
    cauldronIngredients: [],
    shelfStock: createStock(shelfIngredients),
    difficulty,
    lastReactionId: null,
  };
}
