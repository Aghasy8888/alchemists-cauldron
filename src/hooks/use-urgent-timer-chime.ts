import { useEffect, useEffectEvent, useRef } from 'react';
import { GAME_STATUS } from '../data/types';
import { LOW_TIME_THRESHOLD_SEC } from '../logic/timer';
import { playUrgentTimerChime } from '../utils/urgent-timer-chime';
import { useGame } from './use-game';

const { playing } = GAME_STATUS;

/** Plays the urgent chime once each time the run timer enters the red zone. */
export function useUrgentTimerChime(): void {
  const { state } = useGame();
  const wasUrgentRef = useRef(false);

  const syncChime = useEffectEvent(() => {
    const isUrgent = state.status === playing && state.timeLeft < LOW_TIME_THRESHOLD_SEC;
    if (isUrgent && !wasUrgentRef.current) {
      playUrgentTimerChime();
    }
    wasUrgentRef.current = isUrgent;
  });

  useEffect(() => {
    syncChime();
  }, [state.status, state.timeLeft]);
}
