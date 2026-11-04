export const THEME = {
  classic: 'classic',
  ember: 'ember',
} as const;

export type Theme = (typeof THEME)[keyof typeof THEME];

const { classic, ember } = THEME;

const THEME_VALUES: ReadonlySet<string> = new Set([classic, ember]);

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
  }
}
