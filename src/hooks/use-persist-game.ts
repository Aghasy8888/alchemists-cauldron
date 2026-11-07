import { useEffect, useEffectEvent } from 'react';
import { GAME_STATUS } from '../data/types';
import { saveGame } from '../storage/save';
import { useGame } from './use-game';

const { playing, paused } = GAME_STATUS;

export function usePersistGame(): void {
  const { state } = useGame();
  const { status, score, lives, activeRecipe, cauldronIngredients, shelfStock } = state;

  const persistIfUnfinished = useEffectEvent(() => {
    saveGame(state);
  });

  useEffect(() => {
    if (status !== playing && status !== paused) {
      return;
    }
    persistIfUnfinished();
  }, [status, score, lives, activeRecipe, cauldronIngredients, shelfStock]);
}
