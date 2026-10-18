import { addIngredient } from '../logic/add-ingredient';
import { brew, type BrewOutcome } from '../logic/brew';
import { createMenuState, startNewGame } from '../state/game-state';
import { GAME_STATUS, type IGameState } from '../data/types';
import { renderBars } from './bars';
import { renderActionControls } from './brew';
import { renderCauldron } from './cauldron';
import { renderHud } from './hud';
import { renderRecipePanel } from './recipe-panel';
import { renderShelf } from './shelf';

export function createApp(root: HTMLElement): void {
  let state: IGameState = createMenuState();
  let lastOutcome: BrewOutcome | null = null;

  const layout = document.createElement('div');
  layout.className = 'game';

  const header = document.createElement('header');
  header.className = 'game__header';
  const heading = document.createElement('h1');
  heading.className = 'game__title';
  heading.textContent = "Alchemist's Cauldron";
  const hudSlot = document.createElement('div');
  hudSlot.className = 'game__hud';
  header.append(heading, hudSlot);

  const actionSlot = document.createElement('div');
  actionSlot.className = 'game__actions';

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

  const barsSlot = document.createElement('section');
  barsSlot.className = 'game__bars';
  barsSlot.setAttribute('aria-label', 'Parameter bars');

  // Composition matches example: shelf | cauldron | recipe, bars below, Brew bottom-center.
  main.append(shelfSlot, cauldronSlot, recipeSlot, barsSlot);
  layout.append(header, main, actionSlot);
  root.replaceChildren(layout);

  const render = (): void => {
    renderHud(hudSlot, state);
    renderActionControls(actionSlot, {
      status: state.status,
      canBrew: state.status === GAME_STATUS.playing && state.cauldronIngredients.length >= 1,
      lastOutcome,
      onStart: () => {
        lastOutcome = null;
        state = startNewGame(state);
        render();
      },
      onBrew: () => {
        const result = brew(state);
        state = result.state;
        lastOutcome = result.outcome;
        render();
      },
    });
    renderRecipePanel(recipeSlot, state);
    renderShelf(shelfSlot, state, (ingredientId) => {
      lastOutcome = null;
      state = addIngredient(state, ingredientId);
      render();
    });
    renderCauldron(cauldronSlot, state);
    renderBars(barsSlot, state);
  };

  render();
}
