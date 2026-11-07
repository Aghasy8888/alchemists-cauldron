import { difficultyLabel } from '../../data/difficulty';
import {
  LEADERBOARD_SORT,
  type ILeaderboardRow,
  type LeaderboardSort,
} from '../../storage/leaderboard';
import { formatLeaderboardDate } from '../../utils/format-date';

const { score: sortByScore, difficulty: sortByDifficulty } = LEADERBOARD_SORT;

const COLUMN_COUNT = 5;

function rankForRow(
  entries: readonly ILeaderboardRow[],
  index: number,
  sortMode: LeaderboardSort,
): number {
  if (sortMode === sortByScore) {
    return index + 1;
  }

  const current = entries[index];
  if (current === undefined) {
    return index + 1;
  }

  let rank = 0;
  for (let i = 0; i <= index; i += 1) {
    const row = entries[i];
    if (row !== undefined && row.difficulty === current.difficulty) {
      rank += 1;
    }
  }
  return rank;
}

type TableItem =
  | { kind: 'group'; difficulty: ILeaderboardRow['difficulty'] }
  | { kind: 'row'; entry: ILeaderboardRow; rank: number; key: string };

function buildTableItems(
  entries: readonly ILeaderboardRow[],
  sortMode: LeaderboardSort,
): TableItem[] {
  const items: TableItem[] = [];
  let previousDifficulty: ILeaderboardRow['difficulty'] | null = null;

  entries.forEach((entry, index) => {
    if (sortMode === sortByDifficulty && entry.difficulty !== previousDifficulty) {
      items.push({ kind: 'group', difficulty: entry.difficulty });
      previousDifficulty = entry.difficulty;
    }
    items.push({
      kind: 'row',
      entry,
      rank: rankForRow(entries, index, sortMode),
      key: `${entry.difficulty}-${entry.name}-${entry.createdAt}-${entry.score}-${index}`,
    });
  });

  return items;
}

type LeaderboardTableProps = {
  entries: readonly ILeaderboardRow[];
  sortMode: LeaderboardSort;
};

/** Merged leaderboard table (or empty message). */
export function LeaderboardTable({ entries, sortMode }: LeaderboardTableProps) {
  if (entries.length === 0) {
    return <p className="leaderboard__empty">No scores yet. Brew a potion to claim a spot.</p>;
  }

  const items = buildTableItems(entries, sortMode);

  return (
    <div className="leaderboard__scroll">
      <table
        className="leaderboard__table"
        aria-label={
          sortMode === sortByDifficulty ? 'Top players by difficulty' : 'Top players by score'
        }
      >
        <thead>
          <tr>
            <th scope="col">Rank</th>
            <th scope="col">Name</th>
            <th scope="col">Score</th>
            <th scope="col">Difficulty</th>
            <th scope="col">Date</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => {
            if (item.kind === 'group') {
              return (
                <tr key={`group-${item.difficulty}`} className="leaderboard__group">
                  <th scope="colgroup" colSpan={COLUMN_COUNT}>
                    {difficultyLabel(item.difficulty)}
                  </th>
                </tr>
              );
            }

            const { entry, rank, key } = item;
            return (
              <tr key={key}>
                <td>{rank}</td>
                <td title={entry.name}>{entry.name}</td>
                <td>{entry.score}</td>
                <td>{difficultyLabel(entry.difficulty)}</td>
                <td>{formatLeaderboardDate(entry.createdAt)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
