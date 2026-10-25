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
  let isDragging = false;

  const onDragStart = (): void => {
    isDragging = true;
  };

  const onDragEnd = (): void => {
    isDragging = false;
  };

  const onVisibilityChange = (): void => {
    if (document.hidden) {
      pauseIfPlaying(getStatus, onPause);
    }
  };

  const onWindowBlur = (): void => {
    if (isDragging) {
      return;
    }
    pauseIfPlaying(getStatus, onPause);
  };

  document.addEventListener('dragstart', onDragStart, true);
  document.addEventListener('dragend', onDragEnd, true);
  document.addEventListener('visibilitychange', onVisibilityChange);
  window.addEventListener('blur', onWindowBlur);

  return {
    destroy: () => {
      document.removeEventListener('dragstart', onDragStart, true);
      document.removeEventListener('dragend', onDragEnd, true);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      window.removeEventListener('blur', onWindowBlur);
    },
  };
}
