import type { Difficulty, IGameState } from '../data/types';

/** Canonical game action types — destructure in consumers; use bare names. */
export const GAME_ACTION = {
  startGame: 'START_GAME',
  continueGame: 'CONTINUE_GAME',
  exitToMenu: 'EXIT_TO_MENU',
  setDifficulty: 'SET_DIFFICULTY',
  addIngredient: 'ADD_INGREDIENT',
  brew: 'BREW',
  pourOut: 'POUR_OUT',
  pause: 'PAUSE',
  resume: 'RESUME',
  syncTimeLeft: 'SYNC_TIME_LEFT',
} as const;

export type GameAction =
  | { type: typeof GAME_ACTION.startGame }
  | { type: typeof GAME_ACTION.continueGame; state: IGameState }
  | { type: typeof GAME_ACTION.exitToMenu }
  | { type: typeof GAME_ACTION.setDifficulty; difficulty: Difficulty }
  | { type: typeof GAME_ACTION.addIngredient; id: string }
  | { type: typeof GAME_ACTION.brew }
  | { type: typeof GAME_ACTION.pourOut }
  | { type: typeof GAME_ACTION.pause }
  | { type: typeof GAME_ACTION.resume }
  | { type: typeof GAME_ACTION.syncTimeLeft; timeLeft: number };
