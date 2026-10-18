import { DIFFICULTY_CONFIG, LEVEL_1_DIFFICULTY } from '../data/difficulty';
import { getShelfIngredients } from '../data/ingredients';
import { pickRandomRecipe } from '../logic/recipe-generator';
import { createStock } from '../logic/stock';
import { createEndTime } from '../logic/timer';
import { GAME_STATUS, type IGameState } from '../data/types';

const { menu, playing } = GAME_STATUS;

export function createMenuState(): IGameState {
  return {
    status: menu,
    score: 0,
    timeLeft: 0,
    endTime: null,
    lives: 0,
    activeRecipe: null,
    cauldronIngredients: [],
    shelfStock: {},
    difficulty: LEVEL_1_DIFFICULTY,
    lastReactionId: null,
    gameOverReason: null,
  };
}

/** Starts a new Level 1 run: Medium rules, random stock, empty cauldron, random recipe. */
export function startNewGame(previous: IGameState = createMenuState()): IGameState {
  const difficulty = previous.difficulty;
  const config = DIFFICULTY_CONFIG[difficulty];
  const shelfIngredients = getShelfIngredients(config.shelfIngredientCount);
  const timeLeft = config.startingTime;

  return {
    ...previous,
    status: playing,
    score: 0,
    timeLeft,
    endTime: createEndTime(timeLeft),
    lives: config.lives,
    activeRecipe: pickRandomRecipe(difficulty),
    cauldronIngredients: [],
    shelfStock: createStock(shelfIngredients),
    difficulty,
    lastReactionId: null,
    gameOverReason: null,
  };
}
