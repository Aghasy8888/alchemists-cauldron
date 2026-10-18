import { DIFFICULTY_CONFIG } from '../data/difficulty';
import { GAME_STATUS, type IGameState } from '../data/types';
import { calculateCauldron } from './calculate-cauldron';
import { expandRecipeRanges, isBrewSuccess } from './brew-check';
import { pickRandomRecipe } from './recipe-generator';

/** Canonical brew outcomes — compare / assign via `BREW_OUTCOME.*`, not string literals. */
export const BREW_OUTCOME = {
  success: 'success',
  failure: 'failure',
  ignored: 'ignored',
} as const;

export type BrewOutcome = (typeof BREW_OUTCOME)[keyof typeof BREW_OUTCOME];

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
  if (state.status !== GAME_STATUS.playing || state.activeRecipe === null) {
    return { state, outcome: BREW_OUTCOME.ignored };
  }

  if (state.cauldronIngredients.length < 1) {
    return { state, outcome: BREW_OUTCOME.ignored };
  }

  const config = DIFFICULTY_CONFIG[state.difficulty];
  const values = calculateCauldron(state.cauldronIngredients);
  const checked = expandRecipeRanges(state.activeRecipe, config.recipeTolerance);
  const success = isBrewSuccess(values, checked);

  const cleared: IGameState = {
    ...state,
    cauldronIngredients: [],
  };

  if (success) {
    return {
      outcome: BREW_OUTCOME.success,
      state: {
        ...cleared,
        score: cleared.score + config.scorePerBrew,
        timeLeft: Math.min(cleared.timeLeft + config.timeBonusPerBrew, config.startingTime),
        activeRecipe: pickRandomRecipe(cleared.difficulty),
      },
    };
  }

  return {
    outcome: BREW_OUTCOME.failure,
    state: {
      ...cleared,
      lives: Math.max(0, cleared.lives - 1),
    },
  };
}
