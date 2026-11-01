import { useEffect, useEffectEvent } from 'react';
import { usePauseGame } from './use-pause-game';

type UsePauseOnHiddenOptions = {
  shelfDragging: boolean;
};

/** Pause when the tab is hidden or the window blurs (skip blur during shelf drag). */
export function usePauseOnHidden({ shelfDragging }: UsePauseOnHiddenOptions): void {
  const pauseGame = usePauseGame();

  const onVisibilityChange = useEffectEvent(() => {
    if (document.hidden) {
      pauseGame();
    }
  });

  const onWindowBlur = useEffectEvent(() => {
    if (shelfDragging) {
      return;
    }
    pauseGame();
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
