import { createParamIcon, type ParamIconId } from '../assets/param-icons';
import type { IIngredient } from '../data/types';
import { formatSigned } from '../utils/format-signed';

const TOOLTIP_EDGE_PX = 160;

const PARAM_ROWS: readonly {
  param: ParamIconId;
  label: string;
  valueKey: 'temperature' | 'density' | 'magicPower';
}[] = [
  { param: 'temperature', label: 'Temperature', valueKey: 'temperature' },
  { param: 'density', label: 'Density', valueKey: 'density' },
  { param: 'magic', label: 'Magic Power', valueKey: 'magicPower' },
];

/** Build a hidden shelf-card tooltip with T/D/M rows (param icons + signed values). */
export function createIngredientTooltip(ingredient: IIngredient): HTMLElement {
  const tooltip = document.createElement('div');
  tooltip.className = 'shelf-card__tooltip';
  tooltip.setAttribute('aria-hidden', 'true');

  for (const row of PARAM_ROWS) {
    const line = document.createElement('div');
    line.className = 'shelf-card__tooltip-row';

    const label = document.createElement('span');
    label.className = 'shelf-card__tooltip-label';
    label.append(createParamIcon(row.param));
    const labelText = document.createElement('span');
    labelText.textContent = row.label;
    label.append(labelText);

    const value = document.createElement('span');
    value.className = `shelf-card__tooltip-value param-label param-label--${row.param}`;
    value.textContent = formatSigned(ingredient[row.valueKey]);

    line.append(label, value);
    tooltip.append(line);
  }

  return tooltip;
}

/** Flip tooltip left/up when the card is near the viewport edge. */
export function updateTooltipFlip(card: HTMLElement, tooltip: HTMLElement): void {
  const rect = card.getBoundingClientRect();
  const nearRight = rect.right + TOOLTIP_EDGE_PX > window.innerWidth;
  const nearBottom = rect.bottom + TOOLTIP_EDGE_PX > window.innerHeight;

  tooltip.classList.toggle('shelf-card__tooltip--left', nearRight);
  tooltip.classList.toggle('shelf-card__tooltip--up', nearBottom);
}
