export const SFX_ID = {
  urgentTimer: 'urgentTimer',
} as const;

export type SfxId = (typeof SFX_ID)[keyof typeof SFX_ID];
