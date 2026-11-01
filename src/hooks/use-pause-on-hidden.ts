import { useEffect, useEffectEvent } from 'react';
import { GAME_STATUS } from '../data/types';
import { GAME_ACTION } from '../state/game-actions';
import { useGame } from './use-game';

const { playing } = GAME_STATUS;
const { pause } = GAME_ACTION;

type UsePauseOnHiddenOptions = {
  shelfDragging: boolean;
};

/** Pause when the tab is hidden or the window blurs (skip blur during shelf drag). */
export function usePauseOnHidden({ shelfDragging }: UsePauseOnHiddenOptions): void {
  const { state, dispatch } = useGame();

  const onVisibilityChange = useEffectEvent(() => {
    if (document.hidden && state.status === playing) {
      dispatch({ type: pause });
    }
  });

  const onWindowBlur = useEffectEvent(() => {
    if (shelfDragging) {
      return;
    }
    if (state.status === playing) {
      dispatch({ type: pause });
    }
  });

  useEffect(() => {
    document.addEventListener('visibilitychange', onVisibilityChange);
    window.addEventListener('blur', onWindowBlur);

    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange);
      window.removeEventListener('blur', onWindowBlur);
    };
  }, []);
}
