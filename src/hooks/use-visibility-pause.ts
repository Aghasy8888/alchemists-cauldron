import { GAME_STATUS, type GameStatus } from '../data/types';

const { playing } = GAME_STATUS;

export type VisibilityPauseController = {
  destroy: () => void;
};

export type UseVisibilityPauseOptions = {
  getStatus: () => GameStatus;
  onPause: () => void;
};

/** Pause the run when the browser tab becomes hidden. */
export function useVisibilityPause({
  getStatus,
  onPause,
}: UseVisibilityPauseOptions): VisibilityPauseController {
  const onVisibilityChange = (): void => {
    if (document.hidden && getStatus() === playing) {
      onPause();
    }
  };

  document.addEventListener('visibilitychange', onVisibilityChange);

  return {
    destroy: () => {
      document.removeEventListener('visibilitychange', onVisibilityChange);
    },
  };
}
