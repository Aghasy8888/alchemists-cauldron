import { GAME_STATUS, type GameStatus } from '../data/types';

const { playing } = GAME_STATUS;

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

export type KeyboardShortcutsController = {
  destroy: () => void;
};

export type UseKeyboardShortcutsOptions = {
  getStatus: () => GameStatus;
  isOverlayOpen: () => boolean;
  onPause: () => void;
  onBrew: () => void;
  onPourOut: () => void;
  /** 0-based shelf slot index (Digit1 → 0). */
  onAddShelfIndex: (index: number) => void;
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

export function useKeyboardShortcuts({
  getStatus,
  isOverlayOpen,
  onPause,
  onBrew,
  onPourOut,
  onAddShelfIndex,
}: UseKeyboardShortcutsOptions): KeyboardShortcutsController {
  const onKeyDown = (event: KeyboardEvent): void => {
    if (getStatus() !== playing || isOverlayOpen() || isTypingTarget(event.target)) {
      return;
    }

    if (event.key === 'Escape' || event.code === 'KeyP') {
      event.preventDefault();
      onPause();
      return;
    }

    if (event.code === 'KeyB') {
      event.preventDefault();
      onBrew();
      return;
    }

    if (event.code === 'KeyO') {
      event.preventDefault();
      onPourOut();
      return;
    }

    const shelfIndex = DIGIT_CODES[event.code];
    if (shelfIndex !== undefined) {
      event.preventDefault();
      onAddShelfIndex(shelfIndex);
    }
  };

  window.addEventListener('keydown', onKeyDown);

  return {
    destroy: () => {
      window.removeEventListener('keydown', onKeyDown);
    },
  };
}
