import { createContext, type Dispatch } from 'react';
import type { IGameState } from '../data/types';
import type { GameAction } from './game-actions';

export type GameContextValue = {
  state: IGameState;
  dispatch: Dispatch<GameAction>;
};

export const GameContext = createContext<GameContextValue | null>(null);
