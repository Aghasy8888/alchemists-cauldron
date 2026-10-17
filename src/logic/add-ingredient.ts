import { getIngredientById } from '../data/ingredients';
import { DIFFICULTY_CONFIG } from '../data/difficulty';
import type { IGameState } from '../data/types';

/**
 * Adds one portion of an ingredient to the cauldron when allowed.
 * Returns a new state object; does not mutate the input.
 */
export function addIngredient(state: IGameState, ingredientId: string): IGameState {
  if (state.status !== 'playing') {
    return state;
  }

  const config = DIFFICULTY_CONFIG[state.difficulty];
  if (state.cauldronIngredients.length >= config.maxCauldronIngredients) {
    return state;
  }

  const stockLeft = state.shelfStock[ingredientId];
  if (stockLeft === undefined || stockLeft <= 0) {
    return state;
  }

  const ingredient = getIngredientById(ingredientId);
  if (ingredient === undefined) {
    return state;
  }

  return {
    ...state,
    cauldronIngredients: [...state.cauldronIngredients, ingredient],
    shelfStock: {
      ...state.shelfStock,
      [ingredientId]: stockLeft - 1,
    },
  };
}

export function isCauldronFull(state: IGameState): boolean {
  const config = DIFFICULTY_CONFIG[state.difficulty];
  return state.cauldronIngredients.length >= config.maxCauldronIngredients;
}
