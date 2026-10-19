import { BREW_OUTCOME, type BrewOutcome } from '../logic/brew';

const { success, failure } = BREW_OUTCOME;

const CAULDRON_SUCCESS_CLASS = 'game__cauldron--brew-success';
const CAULDRON_FAIL_CLASS = 'game__cauldron--brew-fail';
const BOARD_SHAKE_CLASS = 'game__board--shake';
const TIME_BONUS_CLASS = 'cauldron__time-bonus';

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

function playTimeBonusFloat(cauldron: HTMLElement, timeBonusSec: number): void {
  cauldron.querySelectorAll(`.${TIME_BONUS_CLASS}`).forEach((node) => {
    node.remove();
  });

  const label = document.createElement('span');
  label.className = TIME_BONUS_CLASS;
  label.textContent = `+${timeBonusSec}s`;
  label.setAttribute('aria-hidden', 'true');
  cauldron.append(label);
  void label.offsetWidth;

  const onEnd = (event: AnimationEvent): void => {
    if (event.target !== label) {
      return;
    }
    label.removeEventListener('animationend', onEnd);
    label.remove();
  };

  label.addEventListener('animationend', onEnd);
}

export function playBrewFx(
  cauldron: HTMLElement,
  board: HTMLElement,
  outcome: BrewOutcome,
  timeBonusSec: number = 0,
): void {
  if (outcome === success) {
    playOneShot(cauldron, CAULDRON_SUCCESS_CLASS);
    if (timeBonusSec > 0) {
      playTimeBonusFloat(cauldron, timeBonusSec);
    }
    return;
  }

  if (outcome === failure) {
    playOneShot(cauldron, CAULDRON_FAIL_CLASS);
    playOneShot(board, BOARD_SHAKE_CLASS);
  }
}
