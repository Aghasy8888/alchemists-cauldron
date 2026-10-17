import { createIngredientIcon } from '../assets/ingredient-icons';
import type { IGameState } from '../data/types';

function formatSigned(value: number): string {
  return value > 0 ? `+${value}` : String(value);
}

export function renderCauldron(container: HTMLElement, state: IGameState): void {
  container.replaceChildren();

  const title = document.createElement('h2');
  title.className = 'cauldron__title';
  title.textContent = 'Cauldron';
  container.append(title);

  const list = document.createElement('ol');
  list.className = 'cauldron__list';
  list.setAttribute('aria-label', 'Ingredients in the cauldron');

  if (state.status === 'menu' || state.cauldronIngredients.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'cauldron__empty';
    empty.textContent =
      state.status === 'menu'
        ? 'Empty until you start.'
        : 'Empty — add ingredients from the shelf.';
    container.append(empty);
    return;
  }

  for (const ingredient of state.cauldronIngredients) {
    const item = document.createElement('li');
    item.className = 'cauldron__item';

    const iconWrap = document.createElement('span');
    iconWrap.className = 'cauldron__icon';
    iconWrap.append(createIngredientIcon(ingredient.icon));

    const name = document.createElement('span');
    name.className = 'cauldron__name';
    name.textContent = ingredient.name;

    const stats = document.createElement('span');
    stats.className = 'cauldron__stats';
    stats.textContent = `${formatSigned(ingredient.temperature)} / ${formatSigned(ingredient.density)} / ${formatSigned(ingredient.magicPower)}`;

    item.append(iconWrap, name, stats);
    list.append(item);
  }

  container.append(list);
}
