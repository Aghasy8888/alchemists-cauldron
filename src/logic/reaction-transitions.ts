import { getEnabledReactions } from '../data/reactions';
import { GAME_STATUS, type Difficulty, type IGameState, type IIngredient } from '../data/types';
import { createEndTime, getTimeLeftSec } from './timer';

const { playing } = GAME_STATUS;

/** One-shot side effects keyed by reaction id (value transforms stay in `apply`). */
const SIDE_EFFECTS: Record<
  string,
  { timePenaltySec?: number; loseLife?: boolean; clearCauldron?: boolean }
> = {
  bubbling: { timePenaltySec: 10 },
  'volatile-mix': { loseLife: true, clearCauldron: true },
  'steam-burst': { timePenaltySec: 5 },
};

/** Reactions that just became active (not active → active). */
export function getFiredReactions(
  before: readonly IIngredient[],
  after: readonly IIngredient[],
  difficulty: Difficulty,
) {
  return getEnabledReactions(difficulty).filter(
    (reaction) => !reaction.isActive(before) && reaction.isActive(after),
  );
}

/** Sync remaining time from endTime when playing, then subtract seconds (floor 0). */
export function subtractTimeLeft(
  state: IGameState,
  seconds: number,
  now: number = Date.now(),
): IGameState {
  const synced =
    state.status === playing && state.endTime !== null
      ? getTimeLeftSec(state.endTime, now)
      : state.timeLeft;
  const timeLeft = Math.max(0, synced - seconds);

  return {
    ...state,
    timeLeft,
    endTime: state.status === playing ? createEndTime(timeLeft, now) : state.endTime,
  };
}

/** Lose one life (floored at 0). */
export function loseLife(state: IGameState): IGameState {
  return {
    ...state,
    lives: Math.max(0, state.lives - 1),
  };
}

/**
 * Apply edge-triggered reaction side effects after a successful add.
 * Sets `lastReactionId` to the last fired id, or `null` if none fired.
 */
export function applyReactionTransitions(
  before: readonly IIngredient[],
  afterState: IGameState,
  now: number = Date.now(),
): IGameState {
  const fired = getFiredReactions(before, afterState.cauldronIngredients, afterState.difficulty);

  let next = afterState;
  for (const reaction of fired) {
    const effect = SIDE_EFFECTS[reaction.id];
    if (effect === undefined) {
      continue;
    }
    if (effect.timePenaltySec !== undefined) {
      next = subtractTimeLeft(next, effect.timePenaltySec, now);
    }
    if (effect.loseLife === true) {
      next = loseLife(next);
    }
    if (effect.clearCauldron === true) {
      next = {
        ...next,
        cauldronIngredients: [],
      };
    }
  }

  return {
    ...next,
    lastReactionId: fired.length > 0 ? fired[fired.length - 1].id : null,
  };
}
