import { DIFFICULTY_CONFIG } from '../data/difficulty';
import { BREW_OUTCOME, GAME_STATUS, type BrewOutcome, type IGameState } from '../data/types';
import { expandRecipeRanges, isBrewSuccess } from './brew-check';
import { clearCauldron } from './cauldron';
import { applyEndChecks } from './game-over';
import { pickRandomRecipe } from './recipe-generator';
import { resolveCauldronValues } from './resolve-cauldron';
import { createEndTime } from './timer';

export { BREW_OUTCOME, type BrewOutcome } from '../data/types';

const { success, failure, ignored } = BREW_OUTCOME;
const { playing } = GAME_STATUS;

export interface IBrewResult {
  state: IGameState;
  outcome: BrewOutcome;
}

export function brew(state: IGameState): IBrewResult {
  if (state.status !== playing || state.activeRecipe === null) {
    return { state, outcome: ignored };
  }

  if (state.cauldronIngredients.length < 1) {
    return { state, outcome: ignored };
  }

  const config = DIFFICULTY_CONFIG[state.difficulty];
  const values = resolveCauldronValues(state.cauldronIngredients, state.difficulty);
  const checked = expandRecipeRanges(state.activeRecipe, config.recipeTolerance);
  const brewSucceeded = isBrewSuccess(values, checked);

  const cleared = clearCauldron(state);

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
