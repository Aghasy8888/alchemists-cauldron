import {
  LEADERBOARD_SORT,
  loadAllLeaderboards,
  sortLeaderboardRows,
  type LeaderboardSort,
} from '../../storage/leaderboard';
import { createTable } from './table';

const { score: sortByScore, difficulty: sortByDifficulty } = LEADERBOARD_SORT;

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

  const hint = document.createElement('p');
  hint.className = 'leaderboard__hint';
  hint.textContent = 'Each difficulty has its own Top-10. Easy scores never replace Hard scores.';

  const entries = loadAllLeaderboards();
  const difficultyCount = new Set(entries.map((entry) => entry.difficulty)).size;
  const canSortByDifficulty = difficultyCount >= 2;
  let sortMode: LeaderboardSort = sortByScore;

  const body = document.createElement('div');
  body.className = 'leaderboard__body';

  const renderBody = (): void => {
    body.replaceChildren();

    if (entries.length === 0 || !canSortByDifficulty) {
      body.append(createTable(sortLeaderboardRows(entries, sortByScore), sortByScore));
      return;
    }

    const toolbar = document.createElement('div');
    toolbar.className = 'leaderboard__toolbar';

    const sortButton = document.createElement('button');
    sortButton.type = 'button';
    sortButton.className = 'leaderboard__button leaderboard__button--sort';
    const difficultyMode = sortMode === sortByDifficulty;
    sortButton.textContent = difficultyMode ? 'Sort by score' : 'Sort by difficulty';
    sortButton.setAttribute('aria-pressed', String(difficultyMode));
    sortButton.addEventListener('click', () => {
      sortMode = difficultyMode ? sortByScore : sortByDifficulty;
      renderBody();
    });

    toolbar.append(sortButton);
    body.append(toolbar, createTable(sortLeaderboardRows(entries, sortMode), sortMode));
  };

  renderBody();

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
  dialog.append(title, hint, body, actions);
  container.append(dialog);
}
