import { useGameTimer } from '../hooks/use-game-timer';
import { useKeyboardShortcuts } from '../hooks/use-keyboard-shortcuts';
import { useVisibilityPause } from '../hooks/use-visibility-pause';
import { addIngredient } from '../logic/add-ingredient';
import { BREW_OUTCOME, brew } from '../logic/brew';
import { applyEndChecks } from '../logic/game-over';
import { pauseRun, resumeRun } from '../logic/pause';
import { pourOut } from '../logic/pour-out';
import { applyReactionTransitions } from '../logic/reaction-transitions';
import { createMenuState, startNewGame } from '../state/game-state';
import { loadLeaderboard, qualifiesForLeaderboard } from '../storage/leaderboard';
import { clearSave, continueSavedGame, hasContinuableSave, saveGame } from '../storage/save';
import { DIFFICULTY_CONFIG } from '../data/difficulty';
import { getShelfIngredients } from '../data/ingredients';
import { GAME_STATUS, type Difficulty, type IGameState } from '../data/types';
import { LOW_TIME_THRESHOLD_SEC } from '../logic/timer';
import { playUrgentTimerChime, unlockAudio } from '../utils/urgent-timer-chime';
import { renderBars } from './bars';
import { renderActionControls } from './brew';
import { playBrewFx } from './brew-fx';
import { renderCauldron } from './cauldron';
import { setupCauldronDropZone } from './cauldron-drop';
import { renderGameOver } from './game-over';
import { renderHelp } from './help';
import { renderHud } from './hud';
import { createGameLayout } from './layout';
import { renderClearLeaderboardConfirm, renderLeaderboard } from './leaderboard';
import { renderPauseDialog } from './pause-dialog';
import { renderRecipePanel } from './recipe-panel';
import { renderSettings } from './settings';
import { renderShelf } from './shelf';

const { menu, playing, paused, gameOver } = GAME_STATUS;
const { success } = BREW_OUTCOME;

const UI_OVERLAY = {
  none: 'none',
  leaderboard: 'leaderboard',
  clearConfirm: 'clear-confirm',
  help: 'help',
  settings: 'settings',
} as const;

type UiOverlay = (typeof UI_OVERLAY)[keyof typeof UI_OVERLAY];

const { none, leaderboard, clearConfirm, help, settings } = UI_OVERLAY;

export function createApp(root: HTMLElement): void {
  let state: IGameState = createMenuState();
  let uiOverlay: UiOverlay = none;
  let scoreSubmitted = false;
  let previousStatus: typeof menu | typeof playing | typeof paused | typeof gameOver = menu;
  let wasUrgentTime = false;

  const syncUrgentTimerChime = (): void => {
    const isUrgent = state.status === playing && state.timeLeft < LOW_TIME_THRESHOLD_SEC;
    if (isUrgent && !wasUrgentTime) {
      playUrgentTimerChime();
    }
    wasUrgentTime = isUrgent;
  };

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

  const persistIfUnfinished = (): void => {
    if (state.status === playing || state.status === paused) {
      saveGame(state);
    } else if (state.status === gameOver) {
      clearSave();
    }
  };

  const timer = useGameTimer({
    getState: () => state,
    setState: (next) => {
      state = next;
    },
    onHudTick: () => {
      syncUrgentTimerChime();
      renderHud(hudSlot, state);
    },
    onEnded: () => {
      clearSave();
      render();
    },
  });

  const openLeaderboard = (): void => {
    uiOverlay = leaderboard;
    render();
  };

  const closeOverlay = (): void => {
    uiOverlay = none;
    render();
  };

  const openHelp = (): void => {
    if (state.status !== menu) {
      return;
    }
    uiOverlay = help;
    render();
  };

  const openSettings = (): void => {
    if (state.status !== menu) {
      return;
    }
    uiOverlay = settings;
    render();
  };

  const selectDifficulty = (difficulty: Difficulty): void => {
    if (state.status !== menu) {
      return;
    }
    state = { ...state, difficulty };
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
    scoreSubmitted = false;
    uiOverlay = none;
    state = startNewGame(state);
    saveGame(state);
    render();
  };

  const pauseGame = (): void => {
    if (state.status !== playing) {
      return;
    }
    uiOverlay = none;
    state = pauseRun(state);
    saveGame(state);
    render();
  };

  const brewGame = (): void => {
    if (state.status !== playing) {
      return;
    }
    const result = brew(state);
    state = result.state;
    persistIfUnfinished();
    render();
    const timeBonusSec =
      result.outcome === success ? DIFFICULTY_CONFIG[state.difficulty].timeBonusPerBrew : 0;
    playBrewFx(cauldronSlot, board, result.outcome, timeBonusSec);
  };

  const pourOutGame = (): void => {
    if (state.status !== playing) {
      return;
    }
    state = pourOut(state);
    persistIfUnfinished();
    render();
  };

  const resumeGame = (): void => {
    if (state.status !== paused) {
      return;
    }
    unlockAudio();
    state = resumeRun(state);
    saveGame(state);
    render();
  };

  const exitToMenu = (): void => {
    scoreSubmitted = false;
    uiOverlay = none;
    clearSave();
    state = createMenuState(state.difficulty);
    render();
  };

  const continueGame = (): void => {
    unlockAudio();
    const restored = continueSavedGame();
    if (restored === null) {
      render();
      return;
    }
    scoreSubmitted = false;
    uiOverlay = none;
    state = restored;
    saveGame(state);
    render();
  };

  useVisibilityPause({
    getStatus: () => state.status,
    onPause: pauseGame,
  });

  let handleAddFromShelf: (ingredientId: string) => void = () => {
    // assigned after render is defined
  };

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
        onBack: closeOverlay,
        onRequestClear: requestClearLeaderboard,
      });
      return;
    }

    if (uiOverlay === help) {
      overlaySlot.hidden = false;
      renderHelp(overlaySlot, closeOverlay);
      return;
    }

    if (uiOverlay === settings) {
      overlaySlot.hidden = false;
      renderSettings(overlaySlot, {
        current: state.difficulty,
        onSelect: selectDifficulty,
        onBack: closeOverlay,
      });
      return;
    }

    if (state.status === gameOver) {
      overlaySlot.hidden = false;
      const showNameEntry =
        !scoreSubmitted && qualifiesForLeaderboard(state.score, loadLeaderboard(state.difficulty));
      renderGameOver(overlaySlot, state, {
        showNameEntry,
        onPlayAgain: playAgain,
        onSubmitScore: () => {
          scoreSubmitted = true;
          render();
        },
        onOpenLeaderboard: openLeaderboard,
        onExitToMenu: exitToMenu,
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
      clearSave();
    }
    previousStatus = state.status;

    const isPaused = state.status === paused;
    board.classList.toggle('game__board--paused', isPaused);

    syncUrgentTimerChime();
    renderHud(hudSlot, state);
    renderOverlay();

    const canUseCauldron = state.status === playing && state.cauldronIngredients.length >= 1;

    renderActionControls(actionSlot, {
      status: state.status,
      difficulty: state.difficulty,
      canBrew: canUseCauldron,
      canPourOut: canUseCauldron,
      canContinue: state.status === menu && hasContinuableSave(),
      onStart: () => {
        unlockAudio();
        scoreSubmitted = false;
        uiOverlay = none;
        state = startNewGame(state);
        saveGame(state);
        render();
      },
      onContinue: continueGame,
      onBrew: brewGame,
      onPourOut: pourOutGame,
      onPause: pauseGame,
      onOpenLeaderboard: openLeaderboard,
      onOpenHelp: openHelp,
      onOpenSettings: openSettings,
    });
    renderRecipePanel(recipeSlot, state);
    renderShelf(shelfSlot, state, handleAddFromShelf);
    renderCauldron(cauldronSlot, state);
    renderBars(barsSlot, state);

    if (state.status === playing) {
      timer.start();
    } else {
      timer.stop();
    }
  };

  handleAddFromShelf = (ingredientId: string): void => {
    if (state.status !== playing) {
      return;
    }
    const before = state.cauldronIngredients;
    const afterAdd = addIngredient(state, ingredientId);
    if (afterAdd === state) {
      return;
    }
    state = applyEndChecks(applyReactionTransitions(before, afterAdd));
    persistIfUnfinished();
    render();
  };

  const addShelfByIndex = (index: number): void => {
    const count = DIFFICULTY_CONFIG[state.difficulty].shelfIngredientCount;
    const shelf = getShelfIngredients(count);
    const ingredient = shelf[index];
    if (ingredient === undefined) {
      return;
    }
    handleAddFromShelf(ingredient.id);
  };

  useKeyboardShortcuts({
    getStatus: () => state.status,
    isOverlayOpen: () => uiOverlay !== none,
    onPause: pauseGame,
    onBrew: brewGame,
    onPourOut: pourOutGame,
    onAddShelfIndex: addShelfByIndex,
  });

  setupCauldronDropZone(cauldronSlot, {
    onDrop: (ingredientId) => {
      handleAddFromShelf(ingredientId);
    },
  });

  render();
}
