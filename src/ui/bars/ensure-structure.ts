import { createParamIcon } from '../../assets/param-icons';
import { BAR_SCALE, BAR_SCALE_TICKS, toPercent } from '../../utils/bar-scale';

export type BarKey = 'temperature' | 'density' | 'magicPower';

export const BAR_KEYS: BarKey[] = ['temperature', 'density', 'magicPower'];

export const BAR_LABELS: Record<BarKey, string> = {
  temperature: 'Temperature',
  density: 'Density',
  magicPower: 'Magic Power',
};

/** CSS modifier shared with shelf chips / recipe labels (T red, D blue, M purple). */
export const BAR_PARAM_CLASS: Record<BarKey, 'temperature' | 'density' | 'magic'> = {
  temperature: 'temperature',
  density: 'density',
  magicPower: 'magic',
};

export function ensureStructure(container: HTMLElement): HTMLElement {
  let list = container.querySelector<HTMLElement>('.bars__list');
  if (list !== null) {
    return list;
  }

  container.replaceChildren();

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

    const meter = document.createElement('div');
    meter.className = 'param-bar__meter';

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

    const tolerance = document.createElement('span');
    tolerance.className = 'param-bar__tolerance';
    tolerance.hidden = true;
    tolerance.setAttribute('aria-hidden', 'true');

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

    track.append(zero, tolerance, zone, fill, marker);

    const scale = document.createElement('div');
    scale.className = 'param-bar__scale';
    scale.setAttribute('aria-hidden', 'true');
    for (const tick of BAR_SCALE_TICKS) {
      const tickEl = document.createElement('span');
      tickEl.className = 'param-bar__tick';
      if (tick === 0) {
        tickEl.classList.add('param-bar__tick--zero');
      }
      tickEl.style.left = `${toPercent(tick)}%`;

      const label = document.createElement('span');
      label.className = 'param-bar__tick-label';
      label.textContent = String(tick);
      tickEl.append(label);
      scale.append(tickEl);
    }

    meter.append(track, scale);
    body.append(meter);
    row.append(heading, body);
    list.append(row);
  }

  container.append(list);
  return list;
}
