import type { IGameState } from '../data/types';

export function renderGameOver(
  container: HTMLElement,
  state: IGameState,
  onPlayAgain: () => void,
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

  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'game-over__play-again';
  button.textContent = 'Play again';
  button.addEventListener('click', onPlayAgain);

  dialog.append(title, reason, score, button);
  container.append(dialog);
}
