import { useEffect, useEffectEvent, useRef } from 'react';
import { playSfx, SFX_ID } from '../audio';
import { DIFFICULTY_CONFIG } from '../data/difficulty';
import { getShelfIngredients } from '../data/ingredients';
import { GAME_STATUS } from '../data/types';
import { GAME_ACTION } from '../state/game-actions';
import {
  createGamepadEdgeTracker,
  GAMEPAD_ACTION,
  getPrimaryGamepad,
  shelfIndexFromAction,
  type GamepadAction,
} from '../utils/gamepad';
import { useGame } from './use-game';
import { usePauseGame } from './use-pause-game';

const { playing } = GAME_STATUS;
const { brew, pourOut, addIngredient } = GAME_ACTION;
const { pourOut: pourOutSfx } = SFX_ID;
const { pause: pauseAction, brew: brewAction, pourOut: pourOutAction } = GAMEPAD_ACTION;

type UseGamepadControlsOptions = {
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

/** Poll a connected gamepad while playing; same actions/gates as keyboard. */
export function useGamepadControls({ overlayOpen }: UseGamepadControlsOptions): void {
  const { state, dispatch } = useGame();
  const pauseGame = usePauseGame();
  const trackerRef = useRef(createGamepadEdgeTracker());
  const { status } = state;

  const handleActions = useEffectEvent((actions: GamepadAction[]) => {
    for (const action of actions) {
      if (action === pauseAction) {
        pauseGame();
        continue;
      }

      if (action === brewAction) {
        dispatch({ type: brew });
        continue;
      }

      if (action === pourOutAction) {
        if (state.cauldronIngredients.length < 1) {
          continue;
        }
        playSfx(pourOutSfx);
        dispatch({ type: pourOut });
        continue;
      }

      const shelfIndex = shelfIndexFromAction(action);
      if (shelfIndex === null) {
        continue;
      }

      const count = DIFFICULTY_CONFIG[state.difficulty].shelfIngredientCount;
      const ingredient = getShelfIngredients(count)[shelfIndex];
      if (ingredient === undefined) {
        continue;
      }
      dispatch({ type: addIngredient, id: ingredient.id });
    }
  });

  const pollFrame = useEffectEvent(() => {
    const pad = getPrimaryGamepad();
    if (pad === null) {
      return false;
    }

    const actions = trackerRef.current.sample(pad);
    if (overlayOpen || isTypingTarget(document.activeElement)) {
      return true;
    }
    if (actions.length > 0) {
      handleActions(actions);
    }
    return true;
  });

  useEffect(() => {
    if (status !== playing) {
      trackerRef.current.reset();
      return;
    }

    const tracker = trackerRef.current;
    let rafId = 0;
    let looping = false;

    const stopLoop = (): void => {
      looping = false;
      if (rafId !== 0) {
        cancelAnimationFrame(rafId);
        rafId = 0;
      }
      tracker.reset();
    };

    const tick = (): void => {
      rafId = 0;
      if (!looping) {
        return;
      }
      const stillConnected = pollFrame();
      if (!stillConnected) {
        stopLoop();
        return;
      }
      rafId = requestAnimationFrame(tick);
    };

    const startLoop = (): void => {
      if (looping || getPrimaryGamepad() === null) {
        return;
      }
      looping = true;
      rafId = requestAnimationFrame(tick);
    };

    const onConnected = (): void => {
      startLoop();
    };

    const onDisconnected = (): void => {
      if (getPrimaryGamepad() === null) {
        stopLoop();
      }
    };

    window.addEventListener('gamepadconnected', onConnected);
    window.addEventListener('gamepaddisconnected', onDisconnected);
    startLoop();

    return () => {
      window.removeEventListener('gamepadconnected', onConnected);
      window.removeEventListener('gamepaddisconnected', onDisconnected);
      stopLoop();
    };
  }, [status]);
}
