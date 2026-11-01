import { ActionControls } from './components/action-controls';
import { GameShell } from './components/game-shell';
import { Hud } from './components/hud';
import { GAME_STATUS } from './data/types';
import { useGame } from './hooks/use-game';

const { paused } = GAME_STATUS;

export function App() {
  const { state } = useGame();

  return (
    <GameShell hud={<Hud />} actions={<ActionControls />} boardPaused={state.status === paused} />
  );
}
