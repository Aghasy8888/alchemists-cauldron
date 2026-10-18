import { isInRange } from '../../logic/brew-check';
import type { IRecipeRange } from '../../data/types';
import { toPercent } from '../../utils/bar-scale';

export function updateBar(row: HTMLElement, value: number, range: IRecipeRange | null): void {
  const inZone = range !== null && isInRange(value, range);
  row.classList.toggle('param-bar--in-zone', inZone);

  const valueLabel = row.querySelector('.param-bar__value');
  if (valueLabel !== null) {
    valueLabel.textContent = String(value);
  }

  const track = row.querySelector('.param-bar__track');
  if (track !== null) {
    track.setAttribute('aria-valuenow', String(value));
  }

  const zone = row.querySelector<HTMLElement>('.param-bar__zone');
  if (zone !== null) {
    if (range === null) {
      zone.hidden = true;
    } else {
      zone.hidden = false;
      const left = toPercent(range.min);
      const right = toPercent(range.max);
      zone.style.left = `${left}%`;
      zone.style.width = `${Math.max(0, right - left)}%`;
    }
  }

  const zeroPct = toPercent(0);
  const valuePct = toPercent(value);

  const fill = row.querySelector<HTMLElement>('.param-bar__fill');
  if (fill !== null) {
    if (value >= 0) {
      fill.style.left = `${zeroPct}%`;
      fill.style.width = `${valuePct - zeroPct}%`;
    } else {
      fill.style.left = `${valuePct}%`;
      fill.style.width = `${zeroPct - valuePct}%`;
    }
  }

  const marker = row.querySelector<HTMLElement>('.param-bar__marker');
  if (marker !== null) {
    marker.style.left = `${valuePct}%`;
  }
}
