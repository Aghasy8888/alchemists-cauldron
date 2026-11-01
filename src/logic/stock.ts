import type { IIngredient } from '../data/types';

/** Random whole stock from 2 to 15 for each shelf ingredient. */
export function createStock(ingredients: readonly IIngredient[]): Record<string, number> {
  const shelfStock: Record<string, number> = {};

  for (const ingredient of ingredients) {
    shelfStock[ingredient.id] = Math.floor(Math.random() * 14) + 2;
  }

  return shelfStock;
}
