import { GAME_STATUS, type IGameState } from '../data/types';

/** Minimal HUD for US 1.3: score during play (time/lives UI in US 1.4). */
export function renderHud(container: HTMLElement, state: IGameState): void {
  container.replaceChildren();

  if (state.status === GAME_STATUS.menu) {
    return;
  }

  const score = document.createElement('p');
  score.className = 'game__hud-score';
  score.textContent = `Score: ${state.score}`;
  container.append(score);
}
