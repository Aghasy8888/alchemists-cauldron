import { createIngredientIcon } from '../assets/ingredient-icons';
import { createParamIcon, type ParamIconId } from '../assets/param-icons';
import type { IIngredient } from '../data/types';
import { formatSigned } from '../utils/format-signed';

const TOOLTIP_EDGE_PX = 220;

const PARAM_ROWS: readonly {
  param: ParamIconId;
  label: string;
  valueKey: 'temperature' | 'density' | 'magicPower';
}[] = [
  { param: 'temperature', label: 'Temperature', valueKey: 'temperature' },
  { param: 'density', label: 'Density', valueKey: 'density' },
  { param: 'magic', label: 'Magic Power', valueKey: 'magicPower' },
];

/** Build a hidden shelf-card tooltip with header + T/D/M rows (param icons + signed values). */
export function createIngredientTooltip(ingredient: IIngredient): HTMLElement {
  const tooltip = document.createElement('div');
  tooltip.className = 'shelf-card__tooltip';
  tooltip.setAttribute('aria-hidden', 'true');

  const header = document.createElement('div');
  header.className = 'shelf-card__tooltip-header';

  const icon = document.createElement('span');
  icon.className = 'shelf-card__tooltip-icon';
  icon.append(createIngredientIcon(ingredient.icon));

  const title = document.createElement('span');
  title.className = 'shelf-card__tooltip-title';
  title.textContent = ingredient.name;

  header.append(icon, title);

  const stats = document.createElement('div');
  stats.className = 'shelf-card__tooltip-stats';

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
    stats.append(line);
  }

  tooltip.append(header, stats);
  return tooltip;
}

export function updateTooltipFlip(card: HTMLElement, tooltip: HTMLElement): void {
  const rect = card.getBoundingClientRect();
  const nearBottom = rect.bottom + TOOLTIP_EDGE_PX > window.innerHeight;

  tooltip.classList.toggle('shelf-card__tooltip--up', nearBottom);
}
