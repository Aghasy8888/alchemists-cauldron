import { loadAllLeaderboards } from '../../storage/leaderboard';
import { createTable } from './table';

export function renderLeaderboard(
  container: HTMLElement,
  options: {
    onBack: () => void;
    onRequestClear: () => void;
  },
): void {
  container.replaceChildren();

  const dialog = document.createElement('div');
  dialog.className = 'leaderboard';
  dialog.setAttribute('role', 'dialog');
  dialog.setAttribute('aria-labelledby', 'leaderboard-title');
  dialog.setAttribute('aria-modal', 'true');

  const title = document.createElement('h2');
  title.id = 'leaderboard-title';
  title.className = 'leaderboard__title';
  title.textContent = 'Top Alchemists';

  const entries = loadAllLeaderboards();
  dialog.append(title, createTable(entries));

  const actions = document.createElement('div');
  actions.className = 'leaderboard__actions';

  const clearButton = document.createElement('button');
  clearButton.type = 'button';
  clearButton.className = 'leaderboard__button leaderboard__button--clear';
  clearButton.textContent = 'Clear Leaderboard';
  clearButton.disabled = entries.length === 0;
  clearButton.addEventListener('click', options.onRequestClear);

  const backButton = document.createElement('button');
  backButton.type = 'button';
  backButton.className = 'leaderboard__button leaderboard__button--back';
  backButton.textContent = 'Back';
  backButton.addEventListener('click', options.onBack);

  actions.append(clearButton, backButton);
  dialog.append(actions);
  container.append(dialog);
}
