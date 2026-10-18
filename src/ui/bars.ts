import { createParamIcon } from '../assets/param-icons';
import { calculateCauldron } from '../logic/calculate-cauldron';
import { GAME_STATUS, type IGameState, type IRecipeRange } from '../data/types';

const { menu } = GAME_STATUS;

/** Display scale for bipolar bars (0 is the center line). */
export const BAR_SCALE = {
  min: -80,
  max: 100,
} as const;

type BarKey = 'temperature' | 'density' | 'magicPower';

const BAR_KEYS: BarKey[] = ['temperature', 'density', 'magicPower'];

const BAR_LABELS: Record<BarKey, string> = {
  temperature: 'Temperature',
  density: 'Density',
  magicPower: 'Magic Power',
};

/** CSS modifier shared with shelf chips / recipe labels (T red, D blue, M purple). */
const BAR_PARAM_CLASS: Record<BarKey, 'temperature' | 'density' | 'magic'> = {
  temperature: 'temperature',
  density: 'density',
  magicPower: 'magic',
};

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function toPercent(value: number): number {
  const clamped = clamp(value, BAR_SCALE.min, BAR_SCALE.max);
  return ((clamped - BAR_SCALE.min) / (BAR_SCALE.max - BAR_SCALE.min)) * 100;
}

function isInRange(value: number, range: IRecipeRange): boolean {
  return value >= range.min && value <= range.max;
}

function ensureStructure(container: HTMLElement): HTMLElement {
  let list = container.querySelector<HTMLElement>('.bars__list');
  if (list !== null) {
    return list;
  }

  container.replaceChildren();

  const title = document.createElement('h2');
  title.className = 'bars__title';
  title.textContent = 'Cauldron Parameters';
  container.append(title);

  list = document.createElement('div');
  list.className = 'bars__list';

  for (const key of BAR_KEYS) {
    const row = document.createElement('div');
    row.className = 'param-bar';
    row.dataset.bar = key;

    const heading = document.createElement('div');
    heading.className = 'param-bar__heading';

    const paramClass = BAR_PARAM_CLASS[key];

    const name = document.createElement('span');
    name.className = `param-bar__label param-label param-label--${paramClass}`;
    name.textContent = BAR_LABELS[key];

    const valueLabel = document.createElement('span');
    valueLabel.className = `param-bar__value param-label param-label--${paramClass}`;
    valueLabel.textContent = '0';

    heading.append(name, valueLabel);

    const body = document.createElement('div');
    body.className = 'param-bar__body';
    body.append(createParamIcon(paramClass));

    const track = document.createElement('div');
    track.className = `param-bar__track param-bar__track--${paramClass}`;
    track.setAttribute('role', 'meter');
    track.setAttribute('aria-label', BAR_LABELS[key]);
    track.setAttribute('aria-valuemin', String(BAR_SCALE.min));
    track.setAttribute('aria-valuemax', String(BAR_SCALE.max));
    track.setAttribute('aria-valuenow', '0');

    const zero = document.createElement('span');
    zero.className = 'param-bar__zero';
    zero.style.left = `${toPercent(0)}%`;
    zero.setAttribute('aria-hidden', 'true');

    const zone = document.createElement('span');
    zone.className = 'param-bar__zone';
    zone.hidden = true;
    zone.setAttribute('aria-hidden', 'true');

    const fill = document.createElement('span');
    fill.className = 'param-bar__fill';
    fill.setAttribute('aria-hidden', 'true');

    const marker = document.createElement('span');
    marker.className = 'param-bar__marker';
    marker.setAttribute('aria-hidden', 'true');

    track.append(zero, zone, fill, marker);
    body.append(track);
    row.append(heading, body);
    list.append(row);
  }

  container.append(list);
  return list;
}

function updateBar(row: HTMLElement, value: number, range: IRecipeRange | null): void {
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

export function renderBars(container: HTMLElement, state: IGameState): void {
  const list = ensureStructure(container);
  const values = calculateCauldron(state.status === menu ? [] : state.cauldronIngredients);
  const recipe = state.status === menu ? null : state.activeRecipe;

  for (const key of BAR_KEYS) {
    const row = list.querySelector<HTMLElement>(`[data-bar="${key}"]`);
    if (row === null) {
      continue;
    }
    updateBar(row, values[key], recipe === null ? null : recipe[key]);
  }
}
