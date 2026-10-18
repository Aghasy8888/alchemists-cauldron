import { addIngredient } from '../logic/add-ingredient';
import { brew, type BrewOutcome } from '../logic/brew';
import { applyEndChecks } from '../logic/game-over';
import { getTimeLeftSec } from '../logic/timer';
import { createMenuState, startNewGame } from '../state/game-state';
import { GAME_STATUS, type IGameState } from '../data/types';
import { renderBars } from './bars';
import { renderActionControls } from './brew';
import { renderCauldron } from './cauldron';
import { renderGameOver } from './game-over';
import { renderHud } from './hud';
import { renderRecipePanel } from './recipe-panel';
import { renderShelf } from './shelf';

const { playing, gameOver } = GAME_STATUS;

const TIME_SYNC_RESULT = {
  unchanged: 'unchanged',
  updated: 'updated',
  ended: 'ended',
} as const;

type TimeSyncResult = (typeof TIME_SYNC_RESULT)[keyof typeof TIME_SYNC_RESULT];

const { unchanged, updated, ended } = TIME_SYNC_RESULT;

export function createApp(root: HTMLElement): void {
  let state: IGameState = createMenuState();
  let lastOutcome: BrewOutcome | null = null;
  let rafId = 0;

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

  const board = document.createElement('div');
  board.className = 'game__board';

  const actionSlot = document.createElement('div');
  actionSlot.className = 'game__actions';

  const main = document.createElement('main');
  main.className = 'game__main';

  const overlaySlot = document.createElement('div');
  overlaySlot.className = 'game__overlay';
  overlaySlot.hidden = true;

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

  main.append(shelfSlot, cauldronSlot, recipeSlot, barsSlot);
  board.append(main, actionSlot, overlaySlot);
  layout.append(header, board);
  root.replaceChildren(layout);

  const stopTimerLoop = (): void => {
    if (rafId !== 0) {
      cancelAnimationFrame(rafId);
      rafId = 0;
    }
  };

  const syncTimeFromEnd = (): TimeSyncResult => {
    if (state.status !== playing || state.endTime === null) {
      return unchanged;
    }

    const nextLeft = getTimeLeftSec(state.endTime);
    if (nextLeft === state.timeLeft) {
      return unchanged;
    }

    state = applyEndChecks({ ...state, timeLeft: nextLeft });
    return state.status === gameOver ? ended : updated;
  };

  const tick = (): void => {
    rafId = 0;
    if (state.status !== playing) {
      return;
    }

    const tickResult = syncTimeFromEnd();
    if (tickResult === ended) {
      render();
      return;
    }
    if (tickResult === updated) {
      renderHud(hudSlot, state);
    }

    rafId = requestAnimationFrame(tick);
  };

  const startTimerLoop = (): void => {
    stopTimerLoop();
    if (state.status === playing) {
      rafId = requestAnimationFrame(tick);
    }
  };

  const playAgain = (): void => {
    lastOutcome = null;
    state = startNewGame(state);
    render();
  };

  const render = (): void => {
    const isGameOver = state.status === gameOver;

    renderHud(hudSlot, state);
    overlaySlot.hidden = !isGameOver;
    if (isGameOver) {
      renderGameOver(overlaySlot, state, playAgain);
      stopTimerLoop();
    } else {
      overlaySlot.replaceChildren();
    }

    renderActionControls(actionSlot, {
      status: state.status,
      canBrew: state.status === playing && state.cauldronIngredients.length >= 1,
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
      state = applyEndChecks(addIngredient(state, ingredientId));
      render();
    });
    renderCauldron(cauldronSlot, state);
    renderBars(barsSlot, state);

    if (state.status === playing) {
      startTimerLoop();
    } else {
      stopTimerLoop();
    }
  };

  render();
}
