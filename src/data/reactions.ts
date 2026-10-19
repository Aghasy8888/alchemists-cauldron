import { calculateCauldron } from '../logic/calculate-cauldron';
import { DIFFICULTY_CONFIG } from './difficulty';
import { DIFFICULTY, type Difficulty, type IIngredient, type IReaction } from './types';

const { medium, hard } = DIFFICULTY;

function hasIds(ingredients: readonly IIngredient[], ...ids: string[]): boolean {
  return ids.every((id) => ingredients.some((ingredient) => ingredient.id === id));
}

function scale(value: number, factor: number): number {
  return value * factor;
}

/**
 * Full reaction catalog (US 3.3 table order).
 * Enabled subset: `REACTIONS.slice(0, reactionCount)` — Easy 0, Medium 2, Hard 3.
 */
export const REACTIONS: readonly IReaction[] = [
  {
    id: 'bubbling',
    name: 'Bubbling',
    difficulty: medium,
    isActive: (ingredients) => hasIds(ingredients, 'fairy-dust', 'caustic-acid'),
    apply: (values) => ({
      ...values,
      magicPower: scale(values.magicPower, 1.5),
    }),
  },
  {
    id: 'volatile-mix',
    name: 'Volatile Mix',
    difficulty: medium,
    isActive: (ingredients) => hasIds(ingredients, 'phoenix-feather', 'essence-of-the-void'),
    apply: (values) => values,
  },
  {
    id: 'solar-frost',
    name: 'Solar Frost',
    difficulty: hard,
    isActive: (ingredients) => hasIds(ingredients, 'dragon-tears', 'frost-lotus'),
    apply: (values) => ({
      ...values,
      temperature: 0,
      density: scale(values.density, 1.2),
    }),
  },
  {
    id: 'rooted-steam',
    name: 'Rooted Steam',
    difficulty: hard,
    isActive: (ingredients) => hasIds(ingredients, 'mandrake-root', 'toad-slime'),
    apply: (values) => ({
      ...values,
      density: scale(values.density, 1.25),
      magicPower: scale(values.magicPower, 0.9),
    }),
  },
  {
    id: 'ashen-bloom',
    name: 'Ashen Bloom',
    difficulty: hard,
    isActive: (ingredients) => hasIds(ingredients, 'phoenix-feather', 'fairy-dust'),
    apply: (values) => ({
      ...values,
      temperature: values.temperature + 10,
      magicPower: scale(values.magicPower, 1.25),
    }),
  },
  {
    id: 'annihilation',
    name: 'Annihilation',
    difficulty: hard,
    isActive: (ingredients) => {
      const hot = ingredients.some((ingredient) => ingredient.temperature > 15);
      const cold = ingredients.some((ingredient) => ingredient.temperature < -15);
      return hot && cold;
    },
    apply: (values) => ({
      ...values,
      temperature: 0,
      density: values.density * 2,
    }),
  },
  {
    id: 'pressure-spike',
    name: 'Pressure Spike',
    difficulty: hard,
    isActive: (ingredients) => calculateCauldron(ingredients).density >= 70,
    apply: (values) => ({
      ...values,
      density: 70,
      magicPower: scale(values.magicPower, 1.1),
    }),
  },
  {
    id: 'magma-flux',
    name: 'Magma Flux',
    difficulty: hard,
    isActive: (ingredients) => calculateCauldron(ingredients).temperature >= 60,
    apply: (values) => ({
      ...values,
      magicPower: scale(values.magicPower, 1.2),
      density: scale(values.density, 0.9),
    }),
  },
  {
    id: 'deep-freeze',
    name: 'Deep Freeze',
    difficulty: hard,
    isActive: (ingredients) => calculateCauldron(ingredients).temperature <= -20,
    apply: (values) => ({
      ...values,
      density: scale(values.density, 1.15),
      magicPower: scale(values.magicPower, 0.85),
    }),
  },
  {
    id: 'arcane-saturation',
    name: 'Arcane Saturation',
    difficulty: hard,
    isActive: (ingredients) => calculateCauldron(ingredients).magicPower >= 80,
    apply: (values) => ({
      ...values,
      magicPower: 80,
      temperature: values.temperature + 5,
    }),
  },
  {
    id: 'steam-burst',
    name: 'Steam Burst',
    difficulty: hard,
    isActive: (ingredients) =>
      hasIds(ingredients, 'dragon-tears', 'caustic-acid') &&
      calculateCauldron(ingredients).temperature >= 35,
    apply: (values) => ({
      ...values,
      temperature: values.temperature + 10,
    }),
  },
  {
    id: 'black-ice',
    name: 'Black Ice',
    difficulty: hard,
    isActive: (ingredients) =>
      hasIds(ingredients, 'frost-lotus', 'essence-of-the-void') &&
      calculateCauldron(ingredients).density <= 0,
    apply: (values) => ({
      ...values,
      temperature: values.temperature - 10,
      magicPower: scale(values.magicPower, 1.2),
    }),
  },
  {
    id: 'heavy-spark',
    name: 'Heavy Spark',
    difficulty: hard,
    isActive: (ingredients) =>
      hasIds(ingredients, 'fairy-dust', 'toad-slime') &&
      calculateCauldron(ingredients).density >= 40,
    apply: (values) => ({
      ...values,
      density: scale(values.density, 1.2),
      magicPower: scale(values.magicPower, 1.1),
    }),
  },
  {
    id: 'burning-root',
    name: 'Burning Root',
    difficulty: hard,
    isActive: (ingredients) =>
      hasIds(ingredients, 'mandrake-root', 'phoenix-feather') &&
      calculateCauldron(ingredients).temperature >= 40,
    apply: (values) => ({
      ...values,
      temperature: values.temperature + 15,
      density: scale(values.density, 0.9),
    }),
  },
  {
    id: 'void-resonance',
    name: 'Void Resonance',
    difficulty: hard,
    isActive: (ingredients) =>
      hasIds(ingredients, 'essence-of-the-void', 'dragon-tears') &&
      calculateCauldron(ingredients).magicPower >= 50,
    apply: (values) => ({
      ...values,
      magicPower: scale(values.magicPower, 1.3),
      temperature: values.temperature - 5,
    }),
  },
];

/** Reactions enabled for the current difficulty (Easy: none). */
export function getEnabledReactions(difficulty: Difficulty): readonly IReaction[] {
  const count = DIFFICULTY_CONFIG[difficulty].reactionCount;
  return REACTIONS.slice(0, count);
}
