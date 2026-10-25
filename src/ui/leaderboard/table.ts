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

function appendGroupHeader(tbody: HTMLElement, difficulty: ILeaderboardRow['difficulty']): void {
  const groupRow = document.createElement('tr');
  groupRow.className = 'leaderboard__group';

  const heading = document.createElement('th');
  heading.scope = 'colgroup';
  heading.colSpan = COLUMN_COUNT;
  heading.textContent = difficultyLabel(difficulty);

  groupRow.append(heading);
  tbody.append(groupRow);
}

export function createTable(
  entries: readonly ILeaderboardRow[],
  sortMode: LeaderboardSort = sortByScore,
): HTMLElement {
  if (entries.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'leaderboard__empty';
    empty.textContent = 'No scores yet. Brew a potion to claim a spot.';
    return empty;
  }

  const table = document.createElement('table');
  table.className = 'leaderboard__table';
  table.setAttribute(
    'aria-label',
    sortMode === sortByDifficulty ? 'Top players by difficulty' : 'Top players by score',
  );

  const thead = document.createElement('thead');
  const headRow = document.createElement('tr');
  for (const label of ['Rank', 'Name', 'Score', 'Difficulty', 'Date']) {
    const th = document.createElement('th');
    th.scope = 'col';
    th.textContent = label;
    headRow.append(th);
  }
  thead.append(headRow);

  const tbody = document.createElement('tbody');
  let previousDifficulty: ILeaderboardRow['difficulty'] | null = null;

  entries.forEach((entry, index) => {
    if (sortMode === sortByDifficulty && entry.difficulty !== previousDifficulty) {
      appendGroupHeader(tbody, entry.difficulty);
      previousDifficulty = entry.difficulty;
    }

    const row = document.createElement('tr');

    const rank = document.createElement('td');
    rank.textContent = String(rankForRow(entries, index, sortMode));

    const name = document.createElement('td');
    name.textContent = entry.name;
    name.title = entry.name;

    const score = document.createElement('td');
    score.textContent = String(entry.score);

    const difficulty = document.createElement('td');
    difficulty.textContent = difficultyLabel(entry.difficulty);

    const date = document.createElement('td');
    date.textContent = formatLeaderboardDate(entry.createdAt);

    row.append(rank, name, score, difficulty, date);
    tbody.append(row);
  });

  table.append(thead, tbody);

  const scroll = document.createElement('div');
  scroll.className = 'leaderboard__scroll';
  scroll.append(table);
  return scroll;
}
