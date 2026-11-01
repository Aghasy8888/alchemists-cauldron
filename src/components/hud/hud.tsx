import { DIFFICULTY_CONFIG } from '../../data/difficulty';
import { GAME_STATUS } from '../../data/types';
import { useGame } from '../../hooks/use-game';
import { LOW_TIME_THRESHOLD_SEC } from '../../logic/timer';
import { formatTime } from '../../utils/format-time';
import { ClockIcon, HeartIcon } from '../icons';

const { menu, playing } = GAME_STATUS;

export function Hud() {
  const { state } = useGame();

  if (state.status === menu) {
    return (
      <div className="game__hud-row">
        <p className="game__hud-score">Score: 0</p>
        <div className="game__hud-time">
          <div className="game__hud-time-label">
            <ClockIcon />
            <span>{formatTime(0)}</span>
          </div>
        </div>
      </div>
    );
  }

  const config = DIFFICULTY_CONFIG[state.difficulty];
  const isUrgent = state.timeLeft < LOW_TIME_THRESHOLD_SEC && state.status === playing;
  const timeClassName = isUrgent ? 'game__hud-time game__hud-time--urgent' : 'game__hud-time';
  const pct =
    config.startingTime <= 0 ? 0 : Math.min(100, (state.timeLeft / config.startingTime) * 100);

  const hearts = [];
  for (let i = 0; i < state.lives; i += 1) {
    hearts.push(<HeartIcon key={i} />);
  }

  return (
    <div className="game__hud-row">
      <p className="game__hud-score">Score: {state.score}</p>

      <div className={timeClassName}>
        <div className="game__hud-time-label">
          <ClockIcon />
          <span>{formatTime(state.timeLeft)}</span>
        </div>
        <div
          className="game__hud-time-track"
          role="meter"
          aria-label="Time remaining"
          aria-valuemin={0}
          aria-valuemax={config.startingTime}
          aria-valuenow={state.timeLeft}
        >
          <div className="game__hud-time-fill" style={{ width: `${pct}%` }} />
        </div>
      </div>

      <div className="game__hud-lives" aria-label={`Lives: ${state.lives}`}>
        {hearts}
        {state.lives === 0 ? <span className="game__hud-lives-empty">0</span> : null}
      </div>
    </div>
  );
}
