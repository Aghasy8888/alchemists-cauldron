import { GAME_STATUS, type IGameState } from '../data/types';
import { clearCauldron } from './cauldron';
import { applyEndChecks } from './game-over';
import { subtractTimeLeft } from './reaction-transitions';

const { playing } = GAME_STATUS;

export const POUR_OUT_TIME_COST_SEC = 10;

export function pourOut(state: IGameState, now: number = Date.now()): IGameState {
  if (state.status !== playing || state.cauldronIngredients.length < 1) {
    return state;
  }

  const cleared = clearCauldron(state);
  const next = subtractTimeLeft(cleared, POUR_OUT_TIME_COST_SEC, now);
  return applyEndChecks(next);
}
