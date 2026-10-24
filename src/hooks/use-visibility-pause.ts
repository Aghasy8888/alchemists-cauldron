import { GAME_STATUS, type GameStatus } from '../data/types';

const { playing } = GAME_STATUS;

export type VisibilityPauseController = {
  destroy: () => void;
};

export type UseVisibilityPauseOptions = {
  getStatus: () => GameStatus;
  onPause: () => void;
};

function pauseIfPlaying(getStatus: () => GameStatus, onPause: () => void): void {
  if (getStatus() === playing) {
    onPause();
  }
}

export function useVisibilityPause({
  getStatus,
  onPause,
}: UseVisibilityPauseOptions): VisibilityPauseController {
  const onVisibilityChange = (): void => {
    if (document.hidden) {
      pauseIfPlaying(getStatus, onPause);
    }
  };

  const onWindowBlur = (): void => {
    pauseIfPlaying(getStatus, onPause);
  };

  document.addEventListener('visibilitychange', onVisibilityChange);
  window.addEventListener('blur', onWindowBlur);

  return {
    destroy: () => {
      document.removeEventListener('visibilitychange', onVisibilityChange);
      window.removeEventListener('blur', onWindowBlur);
    },
  };
}
