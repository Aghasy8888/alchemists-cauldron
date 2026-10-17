import { addIngredient } from '../logic/add-ingredient';
import { createMenuState, startNewGame } from '../state/game-state';
import type { IGameState } from '../data/types';
import { renderCauldron } from './cauldron';
import { renderStartControls } from './menu';
import { renderRecipePanel } from './recipe-panel';
import { renderShelf } from './shelf';

export function createApp(root: HTMLElement): void {
  let state: IGameState = createMenuState();

  const layout = document.createElement('div');
  layout.className = 'game';

  const header = document.createElement('header');
  header.className = 'game__header';
  const heading = document.createElement('h1');
  heading.className = 'game__title';
  heading.textContent = "Alchemist's Cauldron";
  header.append(heading);

  const startSlot = document.createElement('div');
  startSlot.className = 'game__start';

  const main = document.createElement('main');
  main.className = 'game__main';

  const recipeSlot = document.createElement('section');
  recipeSlot.className = 'game__recipe';
  recipeSlot.setAttribute('aria-label', 'Recipe panel');

  const shelfSlot = document.createElement('section');
  shelfSlot.className = 'game__shelf';
  shelfSlot.setAttribute('aria-label', 'Shelf');

  const cauldronSlot = document.createElement('section');
  cauldronSlot.className = 'game__cauldron';
  cauldronSlot.setAttribute('aria-label', 'Cauldron');

  main.append(recipeSlot, shelfSlot, cauldronSlot);
  layout.append(header, startSlot, main);
  root.replaceChildren(layout);

  const render = (): void => {
    renderStartControls(startSlot, state.status === 'playing', () => {
      state = startNewGame(state);
      render();
    });
    renderRecipePanel(recipeSlot, state);
    renderShelf(shelfSlot, state, (ingredientId) => {
      state = addIngredient(state, ingredientId);
      render();
    });
    renderCauldron(cauldronSlot, state);
  };

  render();
}
