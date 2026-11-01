import causticAcidSvg from './icons/ingredients/caustic-acid.svg?raw';
import dragonTearsSvg from './icons/ingredients/dragon-tears.svg?raw';
import essenceOfTheVoidSvg from './icons/ingredients/essence-of-the-void.svg?raw';
import fairyDustSvg from './icons/ingredients/fairy-dust.svg?raw';
import frostLotusSvg from './icons/ingredients/frost-lotus.svg?raw';
import mandrakeRootSvg from './icons/ingredients/mandrake-root.svg?raw';
import phoenixFeatherSvg from './icons/ingredients/phoenix-feather.svg?raw';
import toadSlimeSvg from './icons/ingredients/toad-slime.svg?raw';
import type { IngredientIconId } from '../data/types';
import { applyIconLabel, cloneSvg, parseSvg } from './svg-utils';

const templates = {
  'dragon-tears': parseSvg(dragonTearsSvg),
  'fairy-dust': parseSvg(fairyDustSvg),
  'frost-lotus': parseSvg(frostLotusSvg),
  'mandrake-root': parseSvg(mandrakeRootSvg),
  'caustic-acid': parseSvg(causticAcidSvg),
  'essence-of-the-void': parseSvg(essenceOfTheVoidSvg),
  'phoenix-feather': parseSvg(phoenixFeatherSvg),
  'toad-slime': parseSvg(toadSlimeSvg),
} as const satisfies Record<IngredientIconId, SVGSVGElement>;

export type { IngredientIconId };

export interface CreateIngredientIconOptions {
  /** When set, icon is exposed to assistive tech (not decorative). */
  label?: string;
}

export function createIngredientIcon(
  iconId: IngredientIconId,
  options: CreateIngredientIconOptions = {},
): SVGSVGElement {
  const svg = cloneSvg(templates[iconId]);
  applyIconLabel(svg, options.label);
  return svg;
}
