import { createIngredientIcon } from '../assets/ingredient-icons';
import { GAME_STATUS, type IGameState } from '../data/types';

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

  if (state.status === GAME_STATUS.menu || state.cauldronIngredients.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'cauldron__empty';
    empty.textContent =
      state.status === GAME_STATUS.menu
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
    const temp = document.createElement('span');
    temp.className = 'param-chip param-chip--temperature';
    temp.textContent = `T ${formatSigned(ingredient.temperature)}`;
    const density = document.createElement('span');
    density.className = 'param-chip param-chip--density';
    density.textContent = `D ${formatSigned(ingredient.density)}`;
    const magic = document.createElement('span');
    magic.className = 'param-chip param-chip--magic';
    magic.textContent = `M ${formatSigned(ingredient.magicPower)}`;
    stats.append(temp, density, magic);

    item.append(iconWrap, name, stats);
    list.append(item);
  }

  container.append(list);
}
