import type { IGameState } from '../data/types';

export function clearCauldron(state: IGameState): IGameState {
  return {
    ...state,
    cauldronIngredients: [],
  };
}
