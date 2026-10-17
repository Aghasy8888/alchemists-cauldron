import { DIFFICULTY_CONFIG } from '../data/difficulty';
import type { IGameState } from '../data/types';

/** Ingredient counter for the recipe panel (full recipe UI comes in US 1.3). */
export function renderRecipePanel(container: HTMLElement, state: IGameState): void {
  container.replaceChildren();

  const title = document.createElement('h2');
  title.className = 'recipe-panel__title';
  title.textContent = 'Recipe';
  container.append(title);

  const config = DIFFICULTY_CONFIG[state.difficulty];
  const added = state.status === 'menu' ? 0 : state.cauldronIngredients.length;
  const maximum = config.maxCauldronIngredients;

  const counter = document.createElement('p');
  counter.className = 'recipe-panel__counter';
  counter.textContent = `Ingredients: ${added} / ${maximum}`;
  container.append(counter);

  if (state.status === 'menu') {
    const hint = document.createElement('p');
    hint.className = 'recipe-panel__hint';
    hint.textContent = 'A recipe will appear when brewing is added.';
    container.append(hint);
  }
}
