import { useState } from 'react';
import { useGame } from '../../hooks/use-game';
import { useOpenLeaderboard } from '../../hooks/use-open-leaderboard';
import { GAME_ACTION } from '../../state/game-actions';
import { loadLeaderboard, qualifiesForLeaderboard } from '../../storage/leaderboard';
import { clearSave } from '../../storage/save';
import { NameEntry } from './name-entry';

const { startGame, exitToMenu } = GAME_ACTION;

type GameOverDialogProps = {
  scoreSubmitted: boolean;
  onScoreSubmitted: () => void;
};

/** Status-driven Game Over overlay with optional Top-10 name entry. */
export function GameOverDialog({ scoreSubmitted, onScoreSubmitted }: GameOverDialogProps) {
  const { state, dispatch } = useGame();
  const openLeaderboard = useOpenLeaderboard();
  const { score, difficulty, gameOverReason } = state;
  const [board] = useState(() => loadLeaderboard(difficulty));

  const showNameEntry = !scoreSubmitted && qualifiesForLeaderboard(score, board);

  return (
    <div className="game-over" role="dialog" aria-modal="true" aria-labelledby="game-over-title">
      <h2 id="game-over-title" className="game-over__title">
        Game Over
      </h2>
      <p className="game-over__reason">{gameOverReason ?? 'Game ended'}</p>
      <p className="game-over__score">Final score: {score}</p>
      {showNameEntry ? (
        <NameEntry score={score} difficulty={difficulty} onSubmitScore={onScoreSubmitted} />
      ) : null}
      <div className="game-over__actions">
        <button type="button" className="game-over__leaderboard" onClick={openLeaderboard}>
          Leaderboard
        </button>
        <button
          type="button"
          className="game-over__play-again"
          onClick={() => {
            dispatch({ type: startGame });
          }}
        >
          Play again
        </button>
        <button
          type="button"
          className="game-over__exit"
          onClick={() => {
            clearSave();
            dispatch({ type: exitToMenu });
          }}
        >
          Exit to Menu
        </button>
      </div>
    </div>
  );
}
