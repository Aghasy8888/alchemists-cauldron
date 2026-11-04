import { useEffect, useEffectEvent, useRef, type RefObject } from 'react';
import { playSfx, SFX_ID } from '../audio';
import { GAME_STATUS } from '../data/types';
import { useGame } from './use-game';

const { menu } = GAME_STATUS;
const { scoreUp, lifeLost } = SFX_ID;

const SCORE_BUMP_CLASS = 'game__hud-score--bump';
const LIVES_LOSS_CLASS = 'game__hud-lives--loss';

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

type UseHudFeedbackOptions = {
  scoreRef: RefObject<HTMLElement | null>;
  livesRef: RefObject<HTMLElement | null>;
};

export function useHudFeedback({ scoreRef, livesRef }: UseHudFeedbackOptions): void {
  const { state } = useGame();
  const previousScoreRef = useRef<number | null>(null);
  const previousLivesRef = useRef<number | null>(null);

  const syncFeedback = useEffectEvent(() => {
    if (state.status === menu) {
      previousScoreRef.current = null;
      previousLivesRef.current = null;
      return;
    }

    const { score, lives } = state;
    const previousScore = previousScoreRef.current;
    const previousLives = previousLivesRef.current;
    previousScoreRef.current = score;
    previousLivesRef.current = lives;

    if (previousScore === null || previousLives === null) {
      return;
    }

    if (score > previousScore) {
      const scoreEl = scoreRef.current;
      if (scoreEl !== null) {
        playOneShot(scoreEl, SCORE_BUMP_CLASS);
      }
      playSfx(scoreUp);
    }

    if (lives < previousLives) {
      const livesEl = livesRef.current;
      if (livesEl !== null) {
        playOneShot(livesEl, LIVES_LOSS_CLASS);
      }
      playSfx(lifeLost);
    }
  });

  useEffect(() => {
    syncFeedback();
  }, [state.status, state.score, state.lives]);
}
