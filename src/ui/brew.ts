import { createUiIcon, type UiIconId } from '../assets/ui-icons';
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

function createMenuButton(options: {
  className: string;
  label: string;
  icon: UiIconId;
  onClick: () => void;
  variant: 'primary' | 'continue' | 'chrome';
}): HTMLButtonElement {
  const { className, label, icon, onClick, variant } = options;
  const button = document.createElement('button');
  button.type = 'button';
  button.className = `menu-controls__btn menu-controls__btn--${variant} ${className}`;

  const iconWrap = document.createElement('span');
  iconWrap.className = 'menu-controls__btn-icon';
  iconWrap.append(createUiIcon(icon));

  const text = document.createElement('span');
  text.className = 'menu-controls__btn-label';
  text.textContent = label;

  button.append(iconWrap, text);
  button.addEventListener('click', onClick);
  return button;
}

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
    primary.className = 'menu-controls__primary';
    if (options.canContinue) {
      primary.classList.add('menu-controls__primary--split');
    }

    primary.append(
      createMenuButton({
        className: 'game__start',
        label: 'Start Game',
        icon: 'play',
        onClick: options.onStart,
        variant: 'primary',
      }),
    );

    if (options.canContinue) {
      primary.append(
        createMenuButton({
          className: 'game__continue',
          label: 'Continue',
          icon: 'continue',
          onClick: options.onContinue,
          variant: 'continue',
        }),
      );
    }

    const chrome = document.createElement('div');
    chrome.className = 'menu-controls__chrome';
    chrome.append(
      createMenuButton({
        className: 'game__settings',
        label: 'Settings',
        icon: 'settings',
        onClick: options.onOpenSettings,
        variant: 'chrome',
      }),
      createMenuButton({
        className: 'game__help',
        label: 'Help',
        icon: 'help',
        onClick: options.onOpenHelp,
        variant: 'chrome',
      }),
      createMenuButton({
        className: 'game__leaderboard',
        label: 'Leaderboard',
        icon: 'leaderboard',
        onClick: options.onOpenLeaderboard,
        variant: 'chrome',
      }),
    );

    wrap.append(difficultyNote, primary, chrome);
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
