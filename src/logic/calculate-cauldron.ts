import type { IIngredient } from '../data/types';

export interface ICauldronValues {
  temperature: number;
  density: number;
  magicPower: number;
}

/** Pure sum of ingredient parameters. Empty cauldron → 0 / 0 / 0. */
export function calculateCauldron(ingredients: readonly IIngredient[]): ICauldronValues {
  return ingredients.reduce<ICauldronValues>(
    (totals, ingredient) => ({
      temperature: totals.temperature + ingredient.temperature,
      density: totals.density + ingredient.density,
      magicPower: totals.magicPower + ingredient.magicPower,
    }),
    { temperature: 0, density: 0, magicPower: 0 },
  );
}
