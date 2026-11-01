import { clearLeaderboard } from '../../storage/leaderboard';

type ClearLeaderboardConfirmProps = {
  onConfirm: () => void;
  onCancel: () => void;
};

/** In-app confirm before wiping all difficulty leaderboards. */
export function ClearLeaderboardConfirm({ onConfirm, onCancel }: ClearLeaderboardConfirmProps) {
  return (
    <div
      className="leaderboard-confirm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="leaderboard-confirm-title"
    >
      <h2 id="leaderboard-confirm-title" className="leaderboard-confirm__title">
        Clear Leaderboard?
      </h2>
      <p className="leaderboard-confirm__message">
        This removes all Top-10 scores. This cannot be undone.
      </p>
      <div className="leaderboard-confirm__actions">
        <button
          type="button"
          className="leaderboard-confirm__button leaderboard-confirm__button--confirm"
          onClick={() => {
            clearLeaderboard();
            onConfirm();
          }}
        >
          Clear
        </button>
        <button
          type="button"
          className="leaderboard-confirm__button leaderboard-confirm__button--cancel"
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
