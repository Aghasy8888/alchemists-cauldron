export const SFX_ID = {
  urgentTimer: 'urgentTimer',
  brewSuccess: 'brewSuccess',
  brewFail: 'brewFail',
  addIngredient: 'addIngredient',
  pourOut: 'pourOut',
} as const;

export type SfxId = (typeof SFX_ID)[keyof typeof SFX_ID];
