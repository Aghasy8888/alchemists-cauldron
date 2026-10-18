import { DIFFICULTY_CONFIG } from '../data/difficulty';
import { getShelfIngredients } from '../data/ingredients';
import { createIngredientIcon } from '../assets/ingredient-icons';
import { isCauldronFull } from '../logic/add-ingredient';
import { GAME_STATUS, type IGameState } from '../data/types';

const { menu, playing } = GAME_STATUS;

function formatSigned(value: number): string {
  return value > 0 ? `+${value}` : String(value);
}

export function renderShelf(
  container: HTMLElement,
  state: IGameState,
  onAdd: (ingredientId: string) => void,
): void {
  container.replaceChildren();

  const title = document.createElement('h2');
  title.className = 'shelf__title';
  title.textContent = 'Ingredient Shelf';
  container.append(title);

  if (state.status === menu) {
    const empty = document.createElement('p');
    empty.className = 'shelf__hint';
    empty.textContent = 'Start a game to fill the shelf.';
    container.append(empty);
    return;
  }

  const list = document.createElement('ul');
  list.className = 'shelf__list';
  list.setAttribute('aria-label', 'Ingredient shelf');

  const config = DIFFICULTY_CONFIG[state.difficulty];
  const shelfIngredients = getShelfIngredients(config.shelfIngredientCount);
  const cauldronFull = isCauldronFull(state);
  const canAdd = state.status === playing;

  for (const ingredient of shelfIngredients) {
    const stock = state.shelfStock[ingredient.id] ?? 0;
    const isEmpty = stock <= 0;

    const item = document.createElement('li');
    item.className = 'shelf__item';

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'shelf-card';
    button.dataset.ingredientId = ingredient.id;

    if (isEmpty) {
      button.classList.add('shelf-card--empty');
      button.disabled = true;
      button.tabIndex = -1;
      button.setAttribute('aria-label', `${ingredient.name}, out of stock`);
    } else if (!canAdd || cauldronFull) {
      button.disabled = true;
      button.setAttribute(
        'aria-label',
        !canAdd ? `${ingredient.name}, game not in play` : `${ingredient.name}, cauldron is full`,
      );
    } else {
      button.setAttribute(
        'aria-label',
        `Add ${ingredient.name}, stock ${stock}, temperature ${formatSigned(ingredient.temperature)}, density ${formatSigned(ingredient.density)}, magic ${formatSigned(ingredient.magicPower)}`,
      );
      button.addEventListener('click', () => {
        onAdd(ingredient.id);
      });
    }

    const badge = document.createElement('span');
    badge.className = 'shelf-card__badge';
    badge.textContent = String(stock);
    badge.setAttribute('aria-hidden', 'true');
    button.append(badge);

    if (!isEmpty) {
      const iconWrap = document.createElement('span');
      iconWrap.className = 'shelf-card__icon';
      iconWrap.append(createIngredientIcon(ingredient.icon));
      button.append(iconWrap);

      const name = document.createElement('span');
      name.className = 'shelf-card__name';
      name.textContent = ingredient.name;
      button.append(name);

      const stats = document.createElement('span');
      stats.className = 'shelf-card__stats';
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
      button.append(stats);
    }

    item.append(button);
    list.append(item);
  }

  container.append(list);

  if (canAdd && cauldronFull) {
    const note = document.createElement('p');
    note.className = 'shelf__hint';
    note.textContent = 'Cauldron is full. Clear it before adding more.';
    container.append(note);
  }
}
