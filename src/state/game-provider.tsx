import { useReducer, type ReactNode } from 'react';
import { GameContext } from './game-context';
import { gameReducer } from './game-reducer';
import { createMenuState } from './game-state';

type GameProviderProps = {
  children: ReactNode;
};

export function GameProvider({ children }: GameProviderProps) {
  const [state, dispatch] = useReducer(gameReducer, undefined, createMenuState);

  return <GameContext.Provider value={{ state, dispatch }}>{children}</GameContext.Provider>;
}
