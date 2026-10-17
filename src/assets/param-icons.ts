import densitySvg from './icons/params/density.svg?raw';
import magicSvg from './icons/params/magic.svg?raw';
import temperatureSvg from './icons/params/temperature.svg?raw';
import { applyIconLabel, cloneSvg, parseSvg } from './svg-utils';

export type ParamIconId = 'temperature' | 'density' | 'magic';

const templates = {
  temperature: parseSvg(temperatureSvg),
  density: parseSvg(densitySvg),
  magic: parseSvg(magicSvg),
} as const satisfies Record<ParamIconId, SVGSVGElement>;

export interface CreateParamIconOptions {
  /** When set, icon is exposed to assistive tech (not decorative). */
  label?: string;
}

/** Returns a wrapper span containing the parameter SVG icon. */
export function createParamIcon(
  id: ParamIconId,
  options: CreateParamIconOptions = {},
): HTMLElement {
  const wrap = document.createElement('span');
  wrap.className = `param-icon param-icon--${id}`;

  const svg = cloneSvg(templates[id]);
  applyIconLabel(svg, options.label);
  wrap.append(svg);
  return wrap;
}
