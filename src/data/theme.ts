export const THEME = {
  classic: 'classic',
  ember: 'ember',
  mist: 'mist',
  arcade: 'arcade',
} as const;

export type Theme = (typeof THEME)[keyof typeof THEME];

const { classic, ember, mist, arcade } = THEME;

const THEME_VALUES: ReadonlySet<string> = new Set([classic, ember, mist, arcade]);

export function isTheme(value: unknown): value is Theme {
  return typeof value === 'string' && THEME_VALUES.has(value);
}

export function themeLabel(theme: Theme): string {
  switch (theme) {
    case classic: {
      return 'Classic';
    }
    case ember: {
      return 'Ember';
    }
    case mist: {
      return 'Mist';
    }
    case arcade: {
      return 'Arcade';
    }
  }
}
