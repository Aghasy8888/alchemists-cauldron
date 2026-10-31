import { GAME_STATUS, type IGameState } from '../data/types';

/** Canonical game-over reasons — destructure in consumers; use bare names. */
export const GAME_OVER_REASON = {
  timeUp: "Time's up",
  noLives: 'No lives left',
  outOfIngredients: 'Out of ingredients',
} as const;

export type GameOverReason = (typeof GAME_OVER_REASON)[keyof typeof GAME_OVER_REASON];

const { gameOver, playing } = GAME_STATUS;
const { timeUp, noLives, outOfIngredients } = GAME_OVER_REASON;

export function isOutOfIngredients(state: IGameState): boolean {
  const stocks = Object.values(state.shelfStock);
  if (stocks.length === 0) {
    return false;
  }

  const shelfEmpty = stocks.every((stock) => stock <= 0);
  return shelfEmpty && state.cauldronIngredients.length === 0;
}

export function endGame(state: IGameState, reason: GameOverReason): IGameState {
  return {
    ...state,
    status: gameOver,
    timeLeft: reason === timeUp ? 0 : state.timeLeft,
    endTime: null,
    gameOverReason: reason,
  };
}

/**
 * Apply end-of-run checks after brew / add / timer tick.
 * Priority: time → lives → out of ingredients.
 */
export function applyEndChecks(state: IGameState): IGameState {
  if (state.status !== playing) {
    return state;
  }

  if (state.timeLeft <= 0) {
    return endGame(state, timeUp);
  }

  if (state.lives <= 0) {
    return endGame(state, noLives);
  }

  if (isOutOfIngredients(state)) {
    return endGame(state, outOfIngredients);
  }

  return state;
}
