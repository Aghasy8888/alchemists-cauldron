import { getRecipesByDifficulty } from '../data/recipes';
import type { Difficulty, IRecipe } from '../data/types';

export function pickRandomRecipe(difficulty: Difficulty): IRecipe {
  const available = getRecipesByDifficulty(difficulty);
  if (available.length === 0) {
    throw new Error(`No recipes for difficulty: ${difficulty}`);
  }

  const index = Math.floor(Math.random() * available.length);
  return available[index]!;
}
