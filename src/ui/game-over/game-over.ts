import type { IGameState } from '../../data/types';
import { createNameEntry } from './name-entry';

export function renderGameOver(
  container: HTMLElement,
  state: IGameState,
  options: {
    showNameEntry: boolean;
    onPlayAgain: () => void;
    onSubmitScore: () => void;
    onOpenLeaderboard: () => void;
  },
): void {
  container.replaceChildren();

  const dialog = document.createElement('div');
  dialog.className = 'game-over';
  dialog.setAttribute('role', 'dialog');
  dialog.setAttribute('aria-labelledby', 'game-over-title');

  const title = document.createElement('h2');
  title.id = 'game-over-title';
  title.className = 'game-over__title';
  title.textContent = 'Game Over';

  const reason = document.createElement('p');
  reason.className = 'game-over__reason';
  reason.textContent = state.gameOverReason ?? 'Game ended';

  const score = document.createElement('p');
  score.className = 'game-over__score';
  score.textContent = `Final score: ${state.score}`;

  dialog.append(title, reason, score);

  if (options.showNameEntry) {
    dialog.append(createNameEntry(state.score, state.difficulty, options.onSubmitScore));
  }

  const actions = document.createElement('div');
  actions.className = 'game-over__actions';

  const leaderboard = document.createElement('button');
  leaderboard.type = 'button';
  leaderboard.className = 'game-over__leaderboard';
  leaderboard.textContent = 'Leaderboard';
  leaderboard.addEventListener('click', options.onOpenLeaderboard);

  const playAgain = document.createElement('button');
  playAgain.type = 'button';
  playAgain.className = 'game-over__play-again';
  playAgain.textContent = 'Play again';
  playAgain.addEventListener('click', options.onPlayAgain);

  actions.append(leaderboard, playAgain);
  dialog.append(actions);
  container.append(dialog);
}
