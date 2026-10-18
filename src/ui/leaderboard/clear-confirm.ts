import { clearLeaderboard } from '../../storage/leaderboard';

export function renderClearLeaderboardConfirm(
  container: HTMLElement,
  options: {
    onConfirm: () => void;
    onCancel: () => void;
  },
): void {
  container.replaceChildren();

  const dialog = document.createElement('div');
  dialog.className = 'leaderboard-confirm';
  dialog.setAttribute('role', 'dialog');
  dialog.setAttribute('aria-labelledby', 'leaderboard-confirm-title');
  dialog.setAttribute('aria-modal', 'true');

  const title = document.createElement('h2');
  title.id = 'leaderboard-confirm-title';
  title.className = 'leaderboard-confirm__title';
  title.textContent = 'Clear Leaderboard?';

  const message = document.createElement('p');
  message.className = 'leaderboard-confirm__message';
  message.textContent = 'This removes all Top-10 scores. This cannot be undone.';

  const actions = document.createElement('div');
  actions.className = 'leaderboard-confirm__actions';

  const confirm = document.createElement('button');
  confirm.type = 'button';
  confirm.className = 'leaderboard-confirm__button leaderboard-confirm__button--confirm';
  confirm.textContent = 'Clear';
  confirm.addEventListener('click', () => {
    clearLeaderboard();
    options.onConfirm();
  });

  const cancel = document.createElement('button');
  cancel.type = 'button';
  cancel.className = 'leaderboard-confirm__button leaderboard-confirm__button--cancel';
  cancel.textContent = 'Cancel';
  cancel.addEventListener('click', options.onCancel);

  actions.append(confirm, cancel);
  dialog.append(title, message, actions);
  container.append(dialog);
}
