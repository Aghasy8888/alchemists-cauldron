import { useEffect, useEffectEvent } from 'react';
import { pauseMusic, startMusic, stopMusic } from '../audio';
import { GAME_STATUS } from '../data/types';
import { useGame } from './use-game';

const { menu, playing, paused, gameOver } = GAME_STATUS;

export function useBackgroundMusic(): void {
  const { state } = useGame();
  const { status } = state;

  const syncMusic = useEffectEvent(() => {
    if (status === menu || status === gameOver) {
      stopMusic();
      return;
    }

    if (status === paused || document.hidden) {
      pauseMusic();
      return;
    }

    if (status === playing) {
      startMusic();
    }
  });

  useEffect(() => {
    syncMusic();
  }, [status]);

  useEffect(() => {
    const onVisibilityChange = (): void => {
      syncMusic();
    };

    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange);
      stopMusic();
    };
  }, []);
}
