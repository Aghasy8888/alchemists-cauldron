import { useGameTimer } from '../hooks/use-game-timer';
import { useVisibilityPause } from '../hooks/use-visibility-pause';
import { addIngredient } from '../logic/add-ingredient';
import { brew, type BrewOutcome } from '../logic/brew';
import { applyEndChecks } from '../logic/game-over';
import { pauseRun, resumeRun } from '../logic/pause';
import { createMenuState, startNewGame } from '../state/game-state';
import { loadLeaderboard, qualifiesForLeaderboard } from '../storage/leaderboard';
import { GAME_STATUS, type IGameState } from '../data/types';
import { renderBars } from './bars';
import { renderActionControls } from './brew';
import { renderCauldron } from './cauldron';
import { renderGameOver } from './game-over';
import { renderHud } from './hud';
import { createGameLayout } from './layout';
import { renderClearLeaderboardConfirm, renderLeaderboard } from './leaderboard';
import { renderPauseDialog } from './pause-dialog';
import { renderRecipePanel } from './recipe-panel';
import { renderShelf } from './shelf';

const { menu, playing, paused, gameOver } = GAME_STATUS;

const UI_OVERLAY = {
  none: 'none',
  leaderboard: 'leaderboard',
  clearConfirm: 'clear-confirm',
} as const;

type UiOverlay = (typeof UI_OVERLAY)[keyof typeof UI_OVERLAY];

const { none, leaderboard, clearConfirm } = UI_OVERLAY;

export function createApp(root: HTMLElement): void {
  let state: IGameState = createMenuState();
  let lastOutcome: BrewOutcome | null = null;
  let uiOverlay: UiOverlay = none;
  let scoreSubmitted = false;
  let previousStatus: typeof menu | typeof playing | typeof paused | typeof gameOver = menu;

  const {
    root: layout,
    hudSlot,
    board,
    actionSlot,
    overlaySlot,
    recipeSlot,
    shelfSlot,
    cauldronSlot,
    barsSlot,
  } = createGameLayout();
  root.replaceChildren(layout);

  const timer = useGameTimer({
    getState: () => state,
    setState: (next) => {
      state = next;
    },
    onHudTick: () => {
      renderHud(hudSlot, state);
    },
    onEnded: () => {
      render();
    },
  });

  const openLeaderboard = (): void => {
    uiOverlay = leaderboard;
    render();
  };

  const closeLeaderboard = (): void => {
    uiOverlay = none;
    render();
  };

  const requestClearLeaderboard = (): void => {
    uiOverlay = clearConfirm;
    render();
  };

  const cancelClearLeaderboard = (): void => {
    uiOverlay = leaderboard;
    render();
  };

  const confirmClearLeaderboard = (): void => {
    uiOverlay = leaderboard;
    render();
  };

  const playAgain = (): void => {
    lastOutcome = null;
    scoreSubmitted = false;
    uiOverlay = none;
    state = startNewGame(state);
    render();
  };

  const pauseGame = (): void => {
    if (state.status !== playing) {
      return;
    }
    uiOverlay = none;
    state = pauseRun(state);
    render();
  };

  const resumeGame = (): void => {
    if (state.status !== paused) {
      return;
    }
    state = resumeRun(state);
    render();
  };

  const exitToMenu = (): void => {
    lastOutcome = null;
    scoreSubmitted = false;
    uiOverlay = none;
    state = createMenuState();
    render();
  };

  useVisibilityPause({
    getStatus: () => state.status,
    onPause: pauseGame,
  });

  const renderOverlay = (): void => {
    if (uiOverlay === clearConfirm) {
      overlaySlot.hidden = false;
      renderClearLeaderboardConfirm(overlaySlot, {
        onConfirm: confirmClearLeaderboard,
        onCancel: cancelClearLeaderboard,
      });
      return;
    }

    if (uiOverlay === leaderboard) {
      overlaySlot.hidden = false;
      renderLeaderboard(overlaySlot, {
        onBack: closeLeaderboard,
        onRequestClear: requestClearLeaderboard,
      });
      return;
    }

    if (state.status === gameOver) {
      overlaySlot.hidden = false;
      const showNameEntry =
        !scoreSubmitted && qualifiesForLeaderboard(state.score, loadLeaderboard());
      renderGameOver(overlaySlot, state, {
        showNameEntry,
        onPlayAgain: playAgain,
        onSubmitScore: () => {
          scoreSubmitted = true;
          render();
        },
        onOpenLeaderboard: openLeaderboard,
      });
      return;
    }

    if (state.status === paused) {
      overlaySlot.hidden = false;
      renderPauseDialog(overlaySlot, resumeGame, exitToMenu);
      return;
    }

    overlaySlot.replaceChildren();
    overlaySlot.hidden = true;
  };

  const render = (): void => {
    if (previousStatus !== gameOver && state.status === gameOver) {
      scoreSubmitted = false;
      uiOverlay = none;
    }
    previousStatus = state.status;

    const isPaused = state.status === paused;
    board.classList.toggle('game__board--paused', isPaused);

    renderHud(hudSlot, state);
    renderOverlay();

    renderActionControls(actionSlot, {
      status: state.status,
      canBrew: state.status === playing && state.cauldronIngredients.length >= 1,
      lastOutcome,
      onStart: () => {
        lastOutcome = null;
        scoreSubmitted = false;
        uiOverlay = none;
        state = startNewGame(state);
        render();
      },
      onBrew: () => {
        if (state.status !== playing) {
          return;
        }
        const result = brew(state);
        state = result.state;
        lastOutcome = result.outcome;
        render();
      },
      onPause: pauseGame,
      onOpenLeaderboard: openLeaderboard,
    });
    renderRecipePanel(recipeSlot, state);
    renderShelf(shelfSlot, state, (ingredientId) => {
      if (state.status !== playing) {
        return;
      }
      lastOutcome = null;
      state = applyEndChecks(addIngredient(state, ingredientId));
      render();
    });
    renderCauldron(cauldronSlot, state);
    renderBars(barsSlot, state);

    if (state.status === playing) {
      timer.start();
    } else {
      timer.stop();
    }
  };

  render();
}
