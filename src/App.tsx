import { useEffect, useState } from 'react';
import { preloadUiSurfaceImages } from './assets/ui-surfaces';
import { ActionControls } from './components/action-controls';
import { Cauldron } from './components/cauldron';
import { GameShell } from './components/game-shell';
import { Hud } from './components/hud';
import { ParameterBars } from './components/parameter-bars';
import { RecipePanel } from './components/recipe-panel';
import { Shelf } from './components/shelf';
import { GAME_STATUS } from './data/types';
import { useGame } from './hooks/use-game';

const { paused } = GAME_STATUS;

export function App() {
  const { state } = useGame();
  const [shelfDragging, setShelfDragging] = useState(false);
  const [surfacesReady, setSurfacesReady] = useState(false);

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
      boardPaused={state.status === paused}
      shelfDragging={shelfDragging}
      surfacesReady={surfacesReady}
    />
  );
}
