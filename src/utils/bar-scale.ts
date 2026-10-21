/** Display scale for bipolar bars (0 is the center line). */
export const BAR_SCALE = {
  min: -80,
  max: 100,
} as const;

/** Major labeled ticks along each bar (ends at 100, includes 0). */
export const BAR_SCALE_TICKS = [-80, -40, 0, 40, 80, 100] as const;

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/** Map a bar value onto 0–100% of `BAR_SCALE`. */
export function toPercent(value: number): number {
  const { min, max } = BAR_SCALE;
  const clamped = clamp(value, min, max);
  return ((clamped - min) / (max - min)) * 100;
}
