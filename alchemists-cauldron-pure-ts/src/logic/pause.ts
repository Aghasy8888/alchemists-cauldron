import { GAME_STATUS, type IGameState } from '../data/types';
import { createEndTime, getTimeLeftSec } from './timer';

const { playing, paused } = GAME_STATUS;

/** Freeze a run: sync remaining time, clear endTime, set status to paused. */
export function pauseRun(state: IGameState, now: number = Date.now()): IGameState {
  if (state.status !== playing) {
    return state;
  }

  const timeLeft = state.endTime !== null ? getTimeLeftSec(state.endTime, now) : state.timeLeft;

  return {
    ...state,
    status: paused,
    timeLeft,
    endTime: null,
  };
}

/** Continue a paused run: rebuild endTime from timeLeft, set status to playing. */
export function resumeRun(state: IGameState, now: number = Date.now()): IGameState {
  if (state.status !== paused) {
    return state;
  }

  return {
    ...state,
    status: playing,
    endTime: createEndTime(state.timeLeft, now),
  };
}
