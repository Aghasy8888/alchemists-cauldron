import { useEffect, useEffectEvent, useRef } from 'react';
import { playSfx, SFX_ID } from '../audio';
import { GAME_STATUS } from '../data/types';
import { useGame } from './use-game';

const { playing } = GAME_STATUS;
const { addIngredient } = SFX_ID;

function sumShelfStock(shelfStock: Readonly<Record<string, number>>): number {
  let total = 0;
  for (const amount of Object.values(shelfStock)) {
    total += amount;
  }
  return total;
}

/** Plays add-ingredient SFX when shelf stock decreases during play (successful add). */
export function useAddIngredientSfx(): void {
  const { state } = useGame();
  const previousSumRef = useRef<number | null>(null);

  const syncAddSfx = useEffectEvent(() => {
    const stockSum = sumShelfStock(state.shelfStock);

    if (state.status !== playing) {
      previousSumRef.current = stockSum;
      return;
    }

    const previous = previousSumRef.current;
    previousSumRef.current = stockSum;

    if (previous !== null && stockSum < previous) {
      playSfx(addIngredient);
    }
  });

  useEffect(() => {
    syncAddSfx();
  }, [state.status, state.shelfStock]);
}
