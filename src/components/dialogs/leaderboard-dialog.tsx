import { useState } from 'react';
import { runWithUiClick } from '../../audio';
import {
  LEADERBOARD_SORT,
  loadAllLeaderboards,
  sortLeaderboardRows,
  type LeaderboardSort,
} from '../../storage/leaderboard';
import { LeaderboardTable } from './leaderboard-table';

const { score: sortByScore, difficulty: sortByDifficulty } = LEADERBOARD_SORT;

type LeaderboardDialogProps = {
  onBack: () => void;
  onRequestClear: () => void;
};

export function LeaderboardDialog({ onBack, onRequestClear }: LeaderboardDialogProps) {
  const [entries] = useState(() => loadAllLeaderboards());
  const difficultyCount = new Set(entries.map((entry) => entry.difficulty)).size;
  const canSortByDifficulty = difficultyCount >= 2;
  const [sortMode, setSortMode] = useState<LeaderboardSort>(sortByScore);

  const effectiveSort = canSortByDifficulty ? sortMode : sortByScore;
  const difficultyMode = effectiveSort === sortByDifficulty;

  return (
    <div
      className="leaderboard"
      role="dialog"
      aria-modal="true"
      aria-labelledby="leaderboard-title"
    >
      <h2 id="leaderboard-title" className="leaderboard__title">
        Top Alchemists
      </h2>
      <p className="leaderboard__hint">
        Each difficulty has its own Top-10. Easy scores never replace Hard scores.
      </p>
      <div className="leaderboard__body">
        {canSortByDifficulty ? (
          <div className="leaderboard__toolbar">
            <button
              type="button"
              className="leaderboard__button leaderboard__button--sort"
              aria-pressed={difficultyMode}
              onClick={() => {
                runWithUiClick(() => {
                  setSortMode(difficultyMode ? sortByScore : sortByDifficulty);
                });
              }}
            >
              {difficultyMode ? 'Sort by score' : 'Sort by difficulty'}
            </button>
          </div>
        ) : null}
        <LeaderboardTable
          entries={sortLeaderboardRows(entries, effectiveSort)}
          sortMode={effectiveSort}
        />
      </div>
      <div className="leaderboard__actions">
        <button
          type="button"
          className="leaderboard__button leaderboard__button--clear"
          disabled={entries.length === 0}
          onClick={() => runWithUiClick(onRequestClear)}
        >
          Clear Leaderboard
        </button>
        <button
          type="button"
          className="leaderboard__button leaderboard__button--back"
          onClick={() => runWithUiClick(onBack)}
        >
          Back
        </button>
      </div>
    </div>
  );
}
