import { useEffect, useEffectEvent, type RefObject } from 'react';
import { playSfx, SFX_ID } from '../audio';
import { BREW_OUTCOME } from '../data/types';
import { useGame } from './use-game';

const { success, failure } = BREW_OUTCOME;
const { brewSuccess, brewFail } = SFX_ID;

const CAULDRON_SUCCESS_CLASS = 'game__cauldron--brew-success';
const CAULDRON_FAIL_CLASS = 'game__cauldron--brew-fail';
const BOARD_SHAKE_CLASS = 'game__board--shake';

function playOneShot(el: HTMLElement, className: string): void {
  el.classList.remove(className);
  void el.offsetWidth;
  el.classList.add(className);

  const onEnd = (event: AnimationEvent): void => {
    if (event.target !== el) {
      return;
    }
    el.classList.remove(className);
    el.removeEventListener('animationend', onEnd);
  };

  el.addEventListener('animationend', onEnd);
}

type UseBrewFxOptions = {
  cauldronRef: RefObject<HTMLElement | null>;
  boardRef: RefObject<HTMLElement | null>;
};

/** Plays CSS brew success/fail (and board shake) when `brewFx.token` changes. */
export function useBrewFx({ cauldronRef, boardRef }: UseBrewFxOptions): void {
  const { state } = useGame();
  const { brewFx } = state;

  const playFx = useEffectEvent(() => {
    if (brewFx === null) {
      return;
    }

    const cauldron = cauldronRef.current;
    const board = boardRef.current;
    if (cauldron === null) {
      return;
    }

    if (brewFx.outcome === success) {
      playOneShot(cauldron, CAULDRON_SUCCESS_CLASS);
      playSfx(brewSuccess);
      return;
    }

    if (brewFx.outcome === failure) {
      playOneShot(cauldron, CAULDRON_FAIL_CLASS);
      if (board !== null) {
        playOneShot(board, BOARD_SHAKE_CLASS);
      }
      playSfx(brewFail);
    }
  });

  const token = brewFx?.token;

  useEffect(() => {
    if (token === undefined) {
      return;
    }
    playFx();
  }, [token]);
}
