import { useEffect, useEffectEvent, useRef } from 'react';
import { playSfx, SFX_ID } from '../audio';
import { GAME_STATUS } from '../data/types';
import { LOW_TIME_THRESHOLD_SEC } from '../logic/timer';
import { useGame } from './use-game';

const { playing } = GAME_STATUS;
const { urgentTimer } = SFX_ID;

/** Plays the urgent chime once each time the run timer enters the red zone. */
export function useUrgentTimerChime(): void {
  const { state } = useGame();
  const wasUrgentRef = useRef(false);

  const syncChime = useEffectEvent(() => {
    const isUrgent = state.status === playing && state.timeLeft < LOW_TIME_THRESHOLD_SEC;
    if (isUrgent && !wasUrgentRef.current) {
      playSfx(urgentTimer);
    }
    wasUrgentRef.current = isUrgent;
  });

  useEffect(() => {
    syncChime();
  }, [state.status, state.timeLeft]);
}
