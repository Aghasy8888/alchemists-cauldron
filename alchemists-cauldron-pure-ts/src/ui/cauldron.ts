import cauldronArtUrl from '../assets/images/game-cauldron.png';
import { createIngredientIcon } from '../assets/ingredient-icons';
import type { IGameState } from '../data/types';

function createPotArt(): HTMLImageElement {
  const art = document.createElement('img');
  art.className = 'cauldron__art';
  art.src = cauldronArtUrl;
  art.alt = '';
  art.setAttribute('aria-hidden', 'true');
  art.draggable = false;
  return art;
}

export function renderCauldron(container: HTMLElement, state: IGameState): void {
  container.replaceChildren();

  const pot = document.createElement('div');
  pot.className = 'cauldron__pot';
  pot.append(createPotArt());

  const { cauldronIngredients } = state;

  if (cauldronIngredients.length === 0) {
    pot.setAttribute('aria-label', 'Cauldron is empty');
    container.append(pot);
    return;
  }

  const names = cauldronIngredients.map((ingredient) => ingredient.name).join(', ');
  pot.setAttribute('aria-label', `Ingredients in the cauldron: ${names}`);

  const count = cauldronIngredients.length;
  cauldronIngredients.forEach((ingredient, index) => {
    const float = document.createElement('span');
    float.className = 'cauldron__float';
    float.style.setProperty('--i', String(index));
    float.style.setProperty('--count', String(count));
    float.setAttribute('aria-hidden', 'true');
    float.append(createIngredientIcon(ingredient.icon));
    pot.append(float);
  });

  container.append(pot);
}
