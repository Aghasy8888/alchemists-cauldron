import causticAcidSvg from './icons/ingredients/caustic-acid.svg?raw';
import dragonTearsSvg from './icons/ingredients/dragon-tears.svg?raw';
import essenceOfTheVoidSvg from './icons/ingredients/essence-of-the-void.svg?raw';
import fairyDustSvg from './icons/ingredients/fairy-dust.svg?raw';
import frostLotusSvg from './icons/ingredients/frost-lotus.svg?raw';
import mandrakeRootSvg from './icons/ingredients/mandrake-root.svg?raw';
import phoenixFeatherSvg from './icons/ingredients/phoenix-feather.svg?raw';
import toadSlimeSvg from './icons/ingredients/toad-slime.svg?raw';
import type { IngredientIconId } from '../data/types';
import { trimSvgMarkup } from './svg-utils';

export type { IngredientIconId };

const markupById = {
  'dragon-tears': trimSvgMarkup(dragonTearsSvg),
  'fairy-dust': trimSvgMarkup(fairyDustSvg),
  'frost-lotus': trimSvgMarkup(frostLotusSvg),
  'mandrake-root': trimSvgMarkup(mandrakeRootSvg),
  'caustic-acid': trimSvgMarkup(causticAcidSvg),
  'essence-of-the-void': trimSvgMarkup(essenceOfTheVoidSvg),
  'phoenix-feather': trimSvgMarkup(phoenixFeatherSvg),
  'toad-slime': trimSvgMarkup(toadSlimeSvg),
} as const satisfies Record<IngredientIconId, string>;

export function getIngredientIconMarkup(id: IngredientIconId): string {
  return markupById[id];
}
