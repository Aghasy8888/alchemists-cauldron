import { useEffect, useEffectEvent } from 'react';
import { GAME_STATUS } from '../data/types';
import { getTimeLeftSec } from '../logic/timer';
import { GAME_ACTION } from '../state/game-actions';
import { useGame } from './use-game';

const { playing } = GAME_STATUS;
const { syncTimeLeft } = GAME_ACTION;

/** RAF loop that syncs `timeLeft` from `endTime` while the run is playing. */
export function useGameTimer(): void {
  const { state, dispatch } = useGame();

  const onFrame = useEffectEvent(() => {
    if (state.status !== playing || state.endTime === null) {
      return;
    }

    const nextLeft = getTimeLeftSec(state.endTime);
    if (nextLeft !== state.timeLeft) {
      dispatch({ type: syncTimeLeft, timeLeft: nextLeft });
    }
  });

  useEffect(() => {
    if (state.status !== playing) {
      return;
    }

    let rafId = 0;
    let active = true;

    const tick = (): void => {
      if (!active) {
        return;
      }
      onFrame();
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      active = false;
      if (rafId !== 0) {
        cancelAnimationFrame(rafId);
      }
    };
  }, [state.status]);
}
