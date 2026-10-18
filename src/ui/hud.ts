import { createClockIcon, createHeartIcon } from '../assets/hud-icons';
import { DIFFICULTY_CONFIG } from '../data/difficulty';
import { GAME_STATUS, type IGameState } from '../data/types';
import { formatTime, LOW_TIME_THRESHOLD_SEC } from '../logic/timer';

const { menu, playing } = GAME_STATUS;

/** HUD during play / game-over: score, time (MM:SS + bar), lives. */
export function renderHud(container: HTMLElement, state: IGameState): void {
  container.replaceChildren();

  if (state.status === menu) {
    return;
  }

  const config = DIFFICULTY_CONFIG[state.difficulty];
  const row = document.createElement('div');
  row.className = 'game__hud-row';

  const score = document.createElement('p');
  score.className = 'game__hud-score';
  score.textContent = `Score: ${state.score}`;
  row.append(score);

  const timeBlock = document.createElement('div');
  timeBlock.className = 'game__hud-time';
  if (state.timeLeft < LOW_TIME_THRESHOLD_SEC && state.status === playing) {
    timeBlock.classList.add('game__hud-time--urgent');
  }

  const timeLabel = document.createElement('div');
  timeLabel.className = 'game__hud-time-label';
  timeLabel.append(createClockIcon());
  const timeText = document.createElement('span');
  timeText.textContent = formatTime(state.timeLeft);
  timeLabel.append(timeText);
  timeBlock.append(timeLabel);

  const track = document.createElement('div');
  track.className = 'game__hud-time-track';
  track.setAttribute('role', 'meter');
  track.setAttribute('aria-label', 'Time remaining');
  track.setAttribute('aria-valuemin', '0');
  track.setAttribute('aria-valuemax', String(config.startingTime));
  track.setAttribute('aria-valuenow', String(state.timeLeft));

  const fill = document.createElement('div');
  fill.className = 'game__hud-time-fill';
  const pct =
    config.startingTime <= 0 ? 0 : Math.min(100, (state.timeLeft / config.startingTime) * 100);
  fill.style.width = `${pct}%`;
  track.append(fill);
  timeBlock.append(track);
  row.append(timeBlock);

  const lives = document.createElement('div');
  lives.className = 'game__hud-lives';
  lives.setAttribute('aria-label', `Lives: ${state.lives}`);
  for (let i = 0; i < state.lives; i += 1) {
    lives.append(createHeartIcon());
  }
  if (state.lives === 0) {
    const empty = document.createElement('span');
    empty.className = 'game__hud-lives-empty';
    empty.textContent = '0';
    lives.append(empty);
  }
  row.append(lives);

  container.append(row);
}
