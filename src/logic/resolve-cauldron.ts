import { getEnabledReactions } from '../data/reactions';
import type { Difficulty, ICauldronValues, IIngredient } from '../data/types';
import { calculateCauldron } from './calculate-cauldron';

/**
 * Base ingredient sums, then each enabled active reaction's `apply` in catalog order.
 * Empty cauldron → 0 / 0 / 0 (no reactions applied).
 */
export function resolveCauldronValues(
  ingredients: readonly IIngredient[],
  difficulty: Difficulty,
): ICauldronValues {
  if (ingredients.length === 0) {
    return { temperature: 0, density: 0, magicPower: 0 };
  }

  let values = calculateCauldron(ingredients);
  for (const reaction of getEnabledReactions(difficulty)) {
    if (reaction.isActive(ingredients)) {
      values = reaction.apply(values);
    }
  }
  return values;
}
