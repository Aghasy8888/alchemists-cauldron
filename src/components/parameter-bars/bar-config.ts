import type { ParamIconId } from '../../assets/param-icons';
import type { ICauldronValues } from '../../data/types';

export type BarKey = keyof ICauldronValues;

export const BAR_KEYS = [
  'temperature',
  'density',
  'magicPower',
] as const satisfies readonly BarKey[];

export const BAR_LABELS = {
  temperature: 'Temperature',
  density: 'Density',
  magicPower: 'Magic Power',
} as const satisfies Record<BarKey, string>;

/** CSS modifier shared with shelf chips / recipe labels (T red, D blue, M purple). */
export const BAR_PARAM_ID = {
  temperature: 'temperature',
  density: 'density',
  magicPower: 'magic',
} as const satisfies Record<BarKey, ParamIconId>;

export function formatBarValue(value: number): string {
  const rounded = Math.round(value * 10) / 10;
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
}
