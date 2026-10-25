import { DIFFICULTY_CONFIG } from '../data/difficulty';
import { getShelfIngredients } from '../data/ingredients';
import { createIngredientIcon } from '../assets/ingredient-icons';
import { isCauldronFull } from '../logic/add-ingredient';
import { GAME_STATUS, type IGameState } from '../data/types';
import { formatSigned } from '../utils/format-signed';
import { DRAG_MIME } from './cauldron-drop';
import { createIngredientTooltip, updateTooltipFlip } from './ingredient-tooltip';

const { menu, playing } = GAME_STATUS;

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
        !canAdd
          ? `${ingredient.name}, game not in play, temperature ${formatSigned(ingredient.temperature)}, density ${formatSigned(ingredient.density)}, magic ${formatSigned(ingredient.magicPower)}`
          : `${ingredient.name}, cauldron is full, temperature ${formatSigned(ingredient.temperature)}, density ${formatSigned(ingredient.density)}, magic ${formatSigned(ingredient.magicPower)}`,
      );
    } else {
      button.draggable = true;
      button.setAttribute(
        'aria-label',
        `Add ${ingredient.name}, stock ${stock}, temperature ${formatSigned(ingredient.temperature)}, density ${formatSigned(ingredient.density)}, magic ${formatSigned(ingredient.magicPower)}`,
      );
      button.addEventListener('dragstart', (event) => {
        if (event.dataTransfer === null) {
          return;
        }
        button.classList.add('shelf-card--dragging');
        document.documentElement.classList.add('is-shelf-dragging');
        event.dataTransfer.setData(DRAG_MIME, ingredient.id);
        event.dataTransfer.effectAllowed = 'copy';
        void button.offsetWidth;
        const rect = button.getBoundingClientRect();
        event.dataTransfer.setDragImage(
          button,
          event.clientX - rect.left,
          event.clientY - rect.top,
        );
      });
      button.addEventListener('dragend', () => {
        button.classList.remove('shelf-card--dragging');
        document.documentElement.classList.remove('is-shelf-dragging');
      });
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

      const tooltip = createIngredientTooltip(ingredient);
      const syncFlip = (): void => {
        updateTooltipFlip(button, tooltip);
      };
      button.addEventListener('mouseenter', syncFlip);
      button.addEventListener('focusin', syncFlip);
      button.append(tooltip);
    }

    item.append(button);
    list.append(item);
  }

  container.append(list);
}
