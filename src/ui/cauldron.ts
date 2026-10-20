import { createIngredientIcon } from '../assets/ingredient-icons';
import { GAME_STATUS, type IGameState } from '../data/types';

const { menu } = GAME_STATUS;

export function renderCauldron(container: HTMLElement, state: IGameState): void {
  container.replaceChildren();

  const pot = document.createElement('div');
  pot.className = 'cauldron__pot';

  if (state.status === menu || state.cauldronIngredients.length === 0) {
    pot.setAttribute('aria-label', 'Cauldron is empty');
    const empty = document.createElement('p');
    empty.className = 'cauldron__empty';
    empty.textContent =
      state.status === menu ? 'Empty until you start.' : 'Empty — add ingredients from the shelf.';
    pot.append(empty);
    container.append(pot);
    return;
  }

  const names = state.cauldronIngredients.map((ingredient) => ingredient.name).join(', ');
  pot.setAttribute('aria-label', `Ingredients in the cauldron: ${names}`);

  state.cauldronIngredients.forEach((ingredient, index) => {
    const float = document.createElement('span');
    float.className = 'cauldron__float';
    float.style.setProperty('--i', String(index));
    float.setAttribute('aria-hidden', 'true');
    float.append(createIngredientIcon(ingredient.icon));
    pot.append(float);
  });

  container.append(pot);
}
