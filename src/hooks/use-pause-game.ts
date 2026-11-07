import { GAME_STATUS } from '../data/types';
import { pauseRun } from '../logic/pause';
import { GAME_ACTION } from '../state/game-actions';
import { saveGame } from '../storage/save';
import { useGame } from './use-game';

const { playing } = GAME_STATUS;
const { pause } = GAME_ACTION;

/**
 * Pause the run and persist immediately (US 2.2 save-on-pause / pure-ts `pauseGame`).
 * Call from Pause button, keyboard, and hidden-tab handlers.
 */
export function usePauseGame(): () => void {
  const { state, dispatch } = useGame();

  return () => {
    if (state.status !== playing) {
      return;
    }
    saveGame(pauseRun(state));
    dispatch({ type: pause });
  };
}
