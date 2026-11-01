import { useEffect, useRef } from 'react';
import { GAME_STATUS } from '../data/types';
import { clearSave } from '../storage/save';
import { useGame } from './use-game';

const { gameOver } = GAME_STATUS;

/** Clears the continuable save when the run first reaches game-over. */
export function useClearSaveOnGameOver(): void {
  const { state } = useGame();
  const previousStatusRef = useRef(state.status);

  useEffect(() => {
    const previous = previousStatusRef.current;
    previousStatusRef.current = state.status;
    if (previous !== gameOver && state.status === gameOver) {
      clearSave();
    }
  }, [state.status]);
}
