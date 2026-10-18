/** Format a number with an explicit `+` for positive values. */
export function formatSigned(value: number): string {
  return value > 0 ? `+${value}` : String(value);
}
