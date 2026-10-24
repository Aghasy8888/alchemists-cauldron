import { expandRecipeRange, isInRange } from '../../logic/brew-check';
import type { IRecipeRange } from '../../data/types';
import { toPercent } from '../../utils/bar-scale';

function formatBarValue(value: number): string {
  const rounded = Math.round(value * 10) / 10;
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
}

function positionBand(band: HTMLElement, range: IRecipeRange): void {
  const left = toPercent(range.min);
  const right = toPercent(range.max);
  band.hidden = false;
  band.style.left = `${left}%`;
  band.style.width = `${Math.max(0, right - left)}%`;
}

export function updateBar(
  row: HTMLElement,
  value: number,
  range: IRecipeRange | null,
  tolerance: number,
): void {
  const inZone = range !== null && isInRange(value, range);
  const expanded = range === null ? null : expandRecipeRange(range, tolerance);
  const inTolerance = !inZone && expanded !== null && isInRange(value, expanded);

  row.classList.toggle('param-bar--in-zone', inZone);
  row.classList.toggle('param-bar--in-tolerance', inTolerance);

  const displayValue = formatBarValue(value);

  const valueLabel = row.querySelector('.param-bar__value');
  if (valueLabel !== null) {
    valueLabel.textContent = displayValue;
  }

  const track = row.querySelector('.param-bar__track');
  if (track !== null) {
    track.setAttribute('aria-valuenow', displayValue);
  }

  const toleranceBand = row.querySelector<HTMLElement>('.param-bar__tolerance');
  if (toleranceBand !== null) {
    if (expanded === null) {
      toleranceBand.hidden = true;
    } else {
      positionBand(toleranceBand, expanded);
    }
  }

  const zone = row.querySelector<HTMLElement>('.param-bar__zone');
  if (zone !== null) {
    if (range === null) {
      zone.hidden = true;
    } else {
      positionBand(zone, range);
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
