import { useEffect, useEffectEvent } from 'react';
import { DIFFICULTY_CONFIG } from '../data/difficulty';
import { getShelfIngredients } from '../data/ingredients';
import { GAME_STATUS } from '../data/types';
import { GAME_ACTION } from '../state/game-actions';
import { useGame } from './use-game';
import { usePauseGame } from './use-pause-game';

const { playing } = GAME_STATUS;
const { brew, pourOut, addIngredient } = GAME_ACTION;

const DIGIT_CODES: Readonly<Record<string, number>> = {
  Digit1: 0,
  Digit2: 1,
  Digit3: 2,
  Digit4: 3,
  Digit5: 4,
  Digit6: 5,
  Digit7: 6,
  Digit8: 7,
};

type UseKeyboardShortcutsOptions = {
  overlayOpen: boolean;
};

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) {
    return false;
  }
  if (target.isContentEditable) {
    return true;
  }
  const tag = target.tagName;
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT';
}

/** Game shortcuts while playing (Escape/P, B, O, Digit1–8). */
export function useKeyboardShortcuts({ overlayOpen }: UseKeyboardShortcutsOptions): void {
  const { state, dispatch } = useGame();
  const pauseGame = usePauseGame();

  const onKeyDown = useEffectEvent((event: KeyboardEvent) => {
    if (state.status !== playing || overlayOpen || isTypingTarget(event.target)) {
      return;
    }

    if (event.key === 'Escape' || event.code === 'KeyP') {
      event.preventDefault();
      pauseGame();
      return;
    }

    if (event.code === 'KeyB') {
      event.preventDefault();
      dispatch({ type: brew });
      return;
    }

    if (event.code === 'KeyO') {
      event.preventDefault();
      dispatch({ type: pourOut });
      return;
    }

    const shelfIndex = DIGIT_CODES[event.code];
    if (shelfIndex === undefined) {
      return;
    }

    event.preventDefault();
    const count = DIFFICULTY_CONFIG[state.difficulty].shelfIngredientCount;
    const ingredient = getShelfIngredients(count)[shelfIndex];
    if (ingredient === undefined) {
      return;
    }
    dispatch({ type: addIngredient, id: ingredient.id });
  });

  useEffect(() => {
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, []);
}
