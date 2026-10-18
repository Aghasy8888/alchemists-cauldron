import { formatLeaderboardDate } from '../../utils/format-date';
import type { ILeaderboardEntry } from '../../storage/leaderboard';

export function createTable(entries: readonly ILeaderboardEntry[]): HTMLElement {
  if (entries.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'leaderboard__empty';
    empty.textContent = 'No scores yet. Brew a potion to claim a spot.';
    return empty;
  }

  const table = document.createElement('table');
  table.className = 'leaderboard__table';
  table.setAttribute('aria-label', 'Top 10 leaderboard');

  const thead = document.createElement('thead');
  const headRow = document.createElement('tr');
  for (const label of ['Rank', 'Name', 'Score', 'Date']) {
    const th = document.createElement('th');
    th.scope = 'col';
    th.textContent = label;
    headRow.append(th);
  }
  thead.append(headRow);

  const tbody = document.createElement('tbody');
  entries.forEach((entry, index) => {
    const row = document.createElement('tr');

    const rank = document.createElement('td');
    rank.textContent = String(index + 1);

    const name = document.createElement('td');
    name.textContent = entry.name;

    const score = document.createElement('td');
    score.textContent = String(entry.score);

    const date = document.createElement('td');
    date.textContent = formatLeaderboardDate(entry.createdAt);

    row.append(rank, name, score, date);
    tbody.append(row);
  });

  table.append(thead, tbody);
  return table;
}
