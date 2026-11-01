import { useEffect, useEffectEvent, useRef } from 'react';
import { GAME_STATUS } from '../data/types';
import { saveGame } from '../storage/save';
import { useGame } from './use-game';

const { playing, paused } = GAME_STATUS;

/** Persists the run when entering pause or resuming from pause. */
export function useSaveOnPauseResume(): void {
  const { state } = useGame();
  const previousStatusRef = useRef(state.status);

  const persistOnTransition = useEffectEvent(() => {
    const previous = previousStatusRef.current;
    const next = state.status;
    previousStatusRef.current = next;

    const enteredPause = previous === playing && next === paused;
    const resumed = previous === paused && next === playing;
    if (enteredPause || resumed) {
      saveGame(state);
    }
  });

  useEffect(() => {
    persistOnTransition();
  }, [state.status]);
}
