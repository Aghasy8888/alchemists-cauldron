import { useContext } from 'react';
import { GameOverlayContext, type GameOverlayContextValue } from '../state/game-overlay-context';

export function useGameOverlay(): GameOverlayContextValue {
  const value = useContext(GameOverlayContext);
  if (value === null) {
    throw new Error('useGameOverlay must be used within a GameOverlayProvider');
  }
  return value;
}