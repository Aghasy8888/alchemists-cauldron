import type { IGameState } from '../data/types';

/** Empty the cauldron without restoring shelf stock. */
export function clearCauldron(state: IGameState): IGameState {
  return {
    ...state,
    cauldronIngredients: [],
  };
}
