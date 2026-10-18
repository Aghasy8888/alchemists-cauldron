function pad2(value: number): string {
  return String(value).padStart(2, '0');
}

/** Format a timestamp as `DD.MM.YYYY HH:MM`. */
export function formatLeaderboardDate(createdAt: number): string {
  const date = new Date(createdAt);
  const day = pad2(date.getDate());
  const month = pad2(date.getMonth() + 1);
  const year = date.getFullYear();
  const hours = pad2(date.getHours());
  const minutes = pad2(date.getMinutes());
  return `${day}.${month}.${year} ${hours}:${minutes}`;
}
