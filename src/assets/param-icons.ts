import densitySvg from './icons/params/density.svg?raw';
import magicSvg from './icons/params/magic.svg?raw';
import temperatureSvg from './icons/params/temperature.svg?raw';
import { trimSvgMarkup } from './svg-utils';

export type ParamIconId = 'temperature' | 'density' | 'magic';

const markupById = {
  temperature: trimSvgMarkup(temperatureSvg),
  density: trimSvgMarkup(densitySvg),
  magic: trimSvgMarkup(magicSvg),
} as const satisfies Record<ParamIconId, string>;

export function getParamIconMarkup(id: ParamIconId): string {
  return markupById[id];
}
