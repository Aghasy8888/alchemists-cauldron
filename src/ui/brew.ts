import { BREW_OUTCOME, type BrewOutcome } from '../logic/brew';
import { GAME_STATUS, type GameStatus } from '../data/types';

const BREW_STATUS_CLASS = {
  [BREW_OUTCOME.success]: 'brew-controls__status--success',
  [BREW_OUTCOME.failure]: 'brew-controls__status--failure',
} as const;

const BREW_STATUS_MESSAGE = {
  [BREW_OUTCOME.success]: 'Brew succeeded!',
  [BREW_OUTCOME.failure]: 'Brew failed — mixture was off.',
} as const;

export function renderActionControls(
  container: HTMLElement,
  options: {
    status: GameStatus;
    canBrew: boolean;
    lastOutcome: BrewOutcome | null;
    onStart: () => void;
    onBrew: () => void;
  },
): void {
  container.replaceChildren();

  if (options.status === GAME_STATUS.menu) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'game__start';
    button.textContent = 'Start Game';
    button.addEventListener('click', options.onStart);
    container.append(button);
    return;
  }

  if (options.status !== GAME_STATUS.playing) {
    return;
  }

  const wrap = document.createElement('div');
  wrap.className = 'brew-controls';

  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'brew-controls__button';
  button.textContent = 'Brew';
  button.disabled = !options.canBrew;
  button.setAttribute(
    'aria-label',
    options.canBrew ? 'Brew the cauldron mixture' : 'Add at least one ingredient to brew',
  );

  if (options.canBrew) {
    button.addEventListener('click', options.onBrew);
  }

  wrap.append(button);

  if (
    options.lastOutcome === BREW_OUTCOME.success ||
    options.lastOutcome === BREW_OUTCOME.failure
  ) {
    const status = document.createElement('p');
    status.className = 'brew-controls__status';
    status.classList.add(BREW_STATUS_CLASS[options.lastOutcome]);
    status.textContent = BREW_STATUS_MESSAGE[options.lastOutcome];
    wrap.append(status);
  }

  container.append(wrap);
}
