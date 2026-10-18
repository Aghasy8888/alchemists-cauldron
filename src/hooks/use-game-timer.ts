import { applyEndChecks } from '../logic/game-over';
import { getTimeLeftSec } from '../logic/timer';
import { GAME_STATUS, type IGameState } from '../data/types';

const { playing, gameOver } = GAME_STATUS;

const TIME_SYNC_RESULT = {
  unchanged: 'unchanged',
  updated: 'updated',
  ended: 'ended',
} as const;

type TimeSyncResult = (typeof TIME_SYNC_RESULT)[keyof typeof TIME_SYNC_RESULT];

const { unchanged, updated, ended } = TIME_SYNC_RESULT;

export type GameTimerController = {
  start: () => void;
  stop: () => void;
  destroy: () => void;
};

export type UseGameTimerOptions = {
  getState: () => IGameState;
  setState: (next: IGameState) => void;
  onHudTick: () => void;
  onEnded: () => void;
};

/** RAF loop that syncs `timeLeft` from `endTime` while the run is playing. */
export function useGameTimer({
  getState,
  setState,
  onHudTick,
  onEnded,
}: UseGameTimerOptions): GameTimerController {
  let rafId = 0;
  let destroyed = false;

  const stop = (): void => {
    if (rafId !== 0) {
      cancelAnimationFrame(rafId);
      rafId = 0;
    }
  };

  const syncTimeFromEnd = (): TimeSyncResult => {
    const state = getState();
    if (state.status !== playing || state.endTime === null) {
      return unchanged;
    }

    const nextLeft = getTimeLeftSec(state.endTime);
    if (nextLeft === state.timeLeft) {
      return unchanged;
    }

    const next = applyEndChecks({ ...state, timeLeft: nextLeft });
    setState(next);
    return next.status === gameOver ? ended : updated;
  };

  const tick = (): void => {
    rafId = 0;
    if (destroyed) {
      return;
    }

    const state = getState();
    if (state.status !== playing) {
      return;
    }

    const tickResult = syncTimeFromEnd();
    if (tickResult === ended) {
      onEnded();
      return;
    }
    if (tickResult === updated) {
      onHudTick();
    }

    rafId = requestAnimationFrame(tick);
  };

  const start = (): void => {
    stop();
    if (destroyed) {
      return;
    }
    if (getState().status === playing) {
      rafId = requestAnimationFrame(tick);
    }
  };

  const destroy = (): void => {
    destroyed = true;
    stop();
  };

  return { start, stop, destroy };
}
