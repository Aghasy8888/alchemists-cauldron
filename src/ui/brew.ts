import { difficultyLabel } from '../data/difficulty';
import { BREW_OUTCOME, type BrewOutcome } from '../logic/brew';
import { GAME_STATUS, type Difficulty, type GameStatus } from '../data/types';

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
    difficulty: Difficulty;
    canBrew: boolean;
    canPourOut: boolean;
    canContinue: boolean;
    lastOutcome: BrewOutcome | null;
    onStart: () => void;
    onContinue: () => void;
    onBrew: () => void;
    onPourOut: () => void;
    onPause: () => void;
    onOpenLeaderboard: () => void;
    onOpenHelp: () => void;
    onOpenSettings: () => void;
  },
): void {
  container.replaceChildren();

  if (options.status === menu) {
    const wrap = document.createElement('div');
    wrap.className = 'menu-controls';

    const difficultyNote = document.createElement('p');
    difficultyNote.className = 'menu-controls__difficulty';
    difficultyNote.textContent = `Difficulty: ${difficultyLabel(options.difficulty)}`;

    const primary = document.createElement('div');
    primary.className = 'brew-controls__row';

    const start = document.createElement('button');
    start.type = 'button';
    start.className = 'game__start';
    start.textContent = 'Start Game';
    start.addEventListener('click', options.onStart);
    primary.append(start);

    if (options.canContinue) {
      const continueBtn = document.createElement('button');
      continueBtn.type = 'button';
      continueBtn.className = 'game__continue';
      continueBtn.textContent = 'Continue Game';
      continueBtn.addEventListener('click', options.onContinue);
      primary.append(continueBtn);
    }

    const settings = document.createElement('button');
    settings.type = 'button';
    settings.className = 'game__settings';
    settings.textContent = 'Settings';
    settings.addEventListener('click', options.onOpenSettings);
    primary.append(settings);

    const secondary = document.createElement('div');
    secondary.className = 'brew-controls__row';

    const help = document.createElement('button');
    help.type = 'button';
    help.className = 'game__help';
    help.textContent = 'Help';
    help.addEventListener('click', options.onOpenHelp);

    const leaderboard = document.createElement('button');
    leaderboard.type = 'button';
    leaderboard.className = 'game__leaderboard';
    leaderboard.textContent = 'Leaderboard';
    leaderboard.addEventListener('click', options.onOpenLeaderboard);

    secondary.append(help, leaderboard);
    wrap.append(difficultyNote, primary, secondary);
    container.append(wrap);
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

  const pourOut = document.createElement('button');
  pourOut.type = 'button';
  pourOut.className = 'brew-controls__pour-out';
  pourOut.textContent = 'Pour Out';
  pourOut.disabled = !options.canPourOut;
  pourOut.setAttribute(
    'aria-label',
    options.canPourOut
      ? 'Pour out the cauldron (costs 10 seconds)'
      : 'Cauldron is empty — nothing to pour out',
  );

  if (options.canPourOut) {
    pourOut.addEventListener('click', options.onPourOut);
  }

  const pause = document.createElement('button');
  pause.type = 'button';
  pause.className = 'brew-controls__pause';
  pause.textContent = 'Pause';
  pause.setAttribute('aria-label', 'Pause the game');
  pause.addEventListener('click', options.onPause);

  row.append(button, pourOut, pause);
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
