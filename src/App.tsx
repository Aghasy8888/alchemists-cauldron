import { useEffect, useEffectEvent, useRef, useState } from 'react';
import { preloadUiSurfaceImages } from './assets/ui-surfaces';
import { ActionControls } from './components/action-controls';
import { Cauldron } from './components/cauldron';
import { GameOverDialog, PauseDialog } from './components/dialogs';
import { GameShell } from './components/game-shell';
import { Hud } from './components/hud';
import { ParameterBars } from './components/parameter-bars';
import { RecipePanel } from './components/recipe-panel';
import { Shelf } from './components/shelf';
import { GAME_STATUS } from './data/types';
import { useClearSaveOnGameOver } from './hooks/use-clear-save-on-game-over';
import { useGame } from './hooks/use-game';
import { useGameOverlay } from './hooks/use-game-overlay';
import { useGameTimer } from './hooks/use-game-timer';
import { useKeyboardShortcuts } from './hooks/use-keyboard-shortcuts';
import { usePauseOnHidden } from './hooks/use-pause-on-hidden';
import { useSaveOnPauseResume } from './hooks/use-save-on-pause-resume';

const { paused, gameOver } = GAME_STATUS;

export function App() {
  const { state } = useGame();
  const { overlay: menuOverlay, clearOverlay } = useGameOverlay();
  const [shelfDragging, setShelfDragging] = useState(false);
  const [surfacesReady, setSurfacesReady] = useState(false);
  const [scoreSubmitted, setScoreSubmitted] = useState(false);
  const previousStatusRef = useRef(state.status);
  const { status } = state;
  const isPaused = status === paused;
  const isGameOver = status === gameOver;
  const overlay =
    menuOverlay ??
    (isPaused ? (
      <PauseDialog />
    ) : isGameOver ? (
      <GameOverDialog
        scoreSubmitted={scoreSubmitted}
        onScoreSubmitted={() => {
          setScoreSubmitted(true);
        }}
      />
    ) : null);
  const overlayOpen = overlay != null;

  useGameTimer();
  useClearSaveOnGameOver();
  useSaveOnPauseResume();
  usePauseOnHidden({ shelfDragging });
  useKeyboardShortcuts({ overlayOpen });

  const clearMenuOverlayOnEnter = useEffectEvent(() => {
    clearOverlay();
  });

  useEffect(() => {
    const previous = previousStatusRef.current;
    previousStatusRef.current = status;

    if (previous !== paused && status === paused) {
      clearMenuOverlayOnEnter();
    }
    if (previous !== gameOver && status === gameOver) {
      clearMenuOverlayOnEnter();
      setScoreSubmitted(false);
    }
  }, [status]);

  useEffect(() => {
    let cancelled = false;
    void preloadUiSurfaceImages().then(() => {
      if (!cancelled) {
        setSurfacesReady(true);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <GameShell
      hud={<Hud />}
      actions={<ActionControls />}
      shelf={<Shelf onDraggingChange={setShelfDragging} />}
      cauldron={<Cauldron />}
      recipe={<RecipePanel />}
      bars={<ParameterBars />}
      overlay={overlay}
      boardPaused={isPaused}
      shelfDragging={shelfDragging}
      surfacesReady={surfacesReady}
    />
  );
}
