import { useContext } from 'react';
import { GameContext, type GameContextValue } from '../state/game-context';

export function useGame(): GameContextValue {
  const value = useContext(GameContext);
  if (value === null) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return value;
}
