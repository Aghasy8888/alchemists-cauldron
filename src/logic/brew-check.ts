import type { IRecipe, IRecipeRange } from '../data/types';
import type { ICauldronValues } from './calculate-cauldron';

export interface ICheckedRanges {
  temperature: IRecipeRange;
  density: IRecipeRange;
  magicPower: IRecipeRange;
}

function expandRange(range: IRecipeRange, tolerance: number): IRecipeRange {
  return {
    min: range.min - tolerance,
    max: range.max + tolerance,
  };
}

/** Expand each recipe range by ±tolerance (Level 1 Medium = 8). */
export function expandRecipeRanges(recipe: IRecipe, tolerance: number): ICheckedRanges {
  return {
    temperature: expandRange(recipe.temperature, tolerance),
    density: expandRange(recipe.density, tolerance),
    magicPower: expandRange(recipe.magicPower, tolerance),
  };
}

function isInRange(value: number, range: IRecipeRange): boolean {
  return value >= range.min && value <= range.max;
}

/** True when all three parameters fall inside the expanded ranges. No reactions. */
export function isBrewSuccess(values: ICauldronValues, checked: ICheckedRanges): boolean {
  return (
    isInRange(values.temperature, checked.temperature) &&
    isInRange(values.density, checked.density) &&
    isInRange(values.magicPower, checked.magicPower)
  );
}
