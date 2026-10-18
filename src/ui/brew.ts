import { BREW_OUTCOME, type BrewOutcome } from '../logic/brew';
import { GAME_STATUS, type GameStatus } from '../data/types';

const { menu, playing } = GAME_STATUS;
const { success, failure } = BREW_OUTCOME;

const BREW_STATUS_CLASS = {
  [success]: 'brew-controls__status--success',
  [failure]: 'brew-controls__status--failure',
} as const;

const BREW_STATUS_MESSAGE = {
  [success]: 'Brew succeeded!',
  [failure]: 'Brew failed — mixture was off.',
} as const;

export function renderActionControls(
  container: HTMLElement,
  options: {
    status: GameStatus;
    canBrew: boolean;
    lastOutcome: BrewOutcome | null;
    onStart: () => void;
    onBrew: () => void;
    onPause: () => void;
    onOpenLeaderboard: () => void;
  },
): void {
  container.replaceChildren();

  if (options.status === menu) {
    const row = document.createElement('div');
    row.className = 'brew-controls__row';

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'game__start';
    button.textContent = 'Start Game';
    button.addEventListener('click', options.onStart);

    const leaderboard = document.createElement('button');
    leaderboard.type = 'button';
    leaderboard.className = 'game__leaderboard';
    leaderboard.textContent = 'Leaderboard';
    leaderboard.addEventListener('click', options.onOpenLeaderboard);

    row.append(button, leaderboard);
    container.append(row);
    return;
  }

  if (options.status !== playing) {
    return;
  }

  const wrap = document.createElement('div');
  wrap.className = 'brew-controls';

  const row = document.createElement('div');
  row.className = 'brew-controls__row';

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

  const pause = document.createElement('button');
  pause.type = 'button';
  pause.className = 'brew-controls__pause';
  pause.textContent = 'Pause';
  pause.setAttribute('aria-label', 'Pause the game');
  pause.addEventListener('click', options.onPause);

  row.append(button, pause);
  wrap.append(row);

  if (options.lastOutcome === success || options.lastOutcome === failure) {
    const status = document.createElement('p');
    status.className = 'brew-controls__status';
    status.classList.add(BREW_STATUS_CLASS[options.lastOutcome]);
    status.textContent = BREW_STATUS_MESSAGE[options.lastOutcome];
    wrap.append(status);
  }

  container.append(wrap);
}
