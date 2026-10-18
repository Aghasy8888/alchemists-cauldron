import { DIFFICULTY_CONFIG } from '../data/difficulty';
import { GAME_STATUS, type IGameState } from '../data/types';
import { calculateCauldron } from './calculate-cauldron';
import { expandRecipeRanges, isBrewSuccess } from './brew-check';
import { applyEndChecks } from './game-over';
import { pickRandomRecipe } from './recipe-generator';
import { createEndTime } from './timer';

/** Canonical brew outcomes — destructure in consumers; use bare names. */
export const BREW_OUTCOME = {
  success: 'success',
  failure: 'failure',
  ignored: 'ignored',
} as const;

export type BrewOutcome = (typeof BREW_OUTCOME)[keyof typeof BREW_OUTCOME];

const { success, failure, ignored } = BREW_OUTCOME;
const { playing } = GAME_STATUS;

export interface IBrewResult {
  state: IGameState;
  outcome: BrewOutcome;
}

/**
 * Run a brew: check sums vs recipe ± tolerance, clear cauldron.
 * Success: score + time bonus (capped at start time) + new recipe.
 * Failure: lose 1 life. Stock is never restored.
 */
export function brew(state: IGameState): IBrewResult {
  if (state.status !== playing || state.activeRecipe === null) {
    return { state, outcome: ignored };
  }

  if (state.cauldronIngredients.length < 1) {
    return { state, outcome: ignored };
  }

  const config = DIFFICULTY_CONFIG[state.difficulty];
  const values = calculateCauldron(state.cauldronIngredients);
  const checked = expandRecipeRanges(state.activeRecipe, config.recipeTolerance);
  const brewSucceeded = isBrewSuccess(values, checked);

  const cleared: IGameState = {
    ...state,
    cauldronIngredients: [],
  };

  if (brewSucceeded) {
    const timeLeft = Math.min(cleared.timeLeft + config.timeBonusPerBrew, config.startingTime);
    const next: IGameState = {
      ...cleared,
      score: cleared.score + config.scorePerBrew,
      timeLeft,
      endTime: createEndTime(timeLeft),
      activeRecipe: pickRandomRecipe(cleared.difficulty),
    };
    return {
      outcome: success,
      state: applyEndChecks(next),
    };
  }

  const next: IGameState = {
    ...cleared,
    lives: Math.max(0, cleared.lives - 1),
  };

  return {
    outcome: failure,
    state: applyEndChecks(next),
  };
}
