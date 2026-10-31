import { DIFFICULTY_CONFIG, difficultyButtonLabel, difficultyLabel } from '../../data/difficulty';
import { DIFFICULTY, type Difficulty } from '../../data/types';

const { easy, medium, hard } = DIFFICULTY;

const DIFFICULTY_ORDER: readonly Difficulty[] = [easy, medium, hard];

export function renderSettings(
  container: HTMLElement,
  options: {
    current: Difficulty;
    onSelect: (difficulty: Difficulty) => void;
    onBack: () => void;
  },
): void {
  container.replaceChildren();

  const dialog = document.createElement('div');
  dialog.className = 'settings-dialog';
  dialog.setAttribute('role', 'dialog');
  dialog.setAttribute('aria-labelledby', 'settings-dialog-title');
  dialog.setAttribute('aria-modal', 'true');

  const title = document.createElement('h2');
  title.id = 'settings-dialog-title';
  title.className = 'settings-dialog__title';
  title.textContent = 'Settings';

  const hint = document.createElement('p');
  hint.className = 'settings-dialog__hint';
  hint.textContent = `Choose difficulty before starting. Current: ${difficultyLabel(options.current)}.`;

  const list = document.createElement('div');
  list.className = 'settings-dialog__list';
  list.setAttribute('role', 'group');
  list.setAttribute('aria-label', 'Difficulty');

  for (const difficulty of DIFFICULTY_ORDER) {
    const config = DIFFICULTY_CONFIG[difficulty];
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'settings-dialog__option';
    if (difficulty === options.current) {
      button.classList.add('settings-dialog__option--selected');
      button.setAttribute('aria-pressed', 'true');
    } else {
      button.setAttribute('aria-pressed', 'false');
    }
    button.textContent = difficultyButtonLabel(difficulty);
    button.setAttribute(
      'aria-label',
      `${difficultyLabel(difficulty)}, ${config.shelfIngredientCount} ingredients, ${config.startingTime} seconds, ${config.lives} lives`,
    );
    button.addEventListener('click', () => {
      options.onSelect(difficulty);
    });
    list.append(button);
  }

  const back = document.createElement('button');
  back.type = 'button';
  back.className = 'settings-dialog__button';
  back.textContent = 'Back';
  back.addEventListener('click', options.onBack);

  dialog.append(title, hint, list, back);
  container.append(dialog);
}
