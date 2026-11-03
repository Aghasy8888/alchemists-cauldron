export interface IPlayerSettings {
  muted: boolean;
  volume: number;
}

export const SETTINGS_STORAGE_KEY = 'alchemists-cauldron:settings';

export const DEFAULT_SETTINGS: IPlayerSettings = {
  muted: false,
  volume: 0.7,
};

const settingsListeners = new Set<() => void>();

let settingsCache: IPlayerSettings | null = null;

function emitSettingsChange(): void {
  settingsListeners.forEach((listener) => {
    listener();
  });
}

export function subscribeSettings(listener: () => void): () => void {
  settingsListeners.add(listener);
  return () => {
    settingsListeners.delete(listener);
  };
}

function clampVolume(volume: number): number {
  if (!Number.isFinite(volume)) {
    return DEFAULT_SETTINGS.volume;
  }
  return Math.min(1, Math.max(0, volume));
}

function isValidSettings(value: unknown): value is IPlayerSettings {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  const record = value as Record<string, unknown>;
  return typeof record.muted === 'boolean' && typeof record.volume === 'number';
}

function normalizeSettings(settings: IPlayerSettings): IPlayerSettings {
  return {
    muted: settings.muted,
    volume: clampVolume(settings.volume),
  };
}

/** Hydrate cache from localStorage once; invalid data → defaults. */
export function loadSettings(): IPlayerSettings {
  if (settingsCache !== null) {
    return settingsCache;
  }

  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (raw === null) {
      settingsCache = { ...DEFAULT_SETTINGS };
      return settingsCache;
    }
    const data: unknown = JSON.parse(raw);
    if (!isValidSettings(data)) {
      localStorage.removeItem(SETTINGS_STORAGE_KEY);
      settingsCache = { ...DEFAULT_SETTINGS };
      return settingsCache;
    }
    settingsCache = normalizeSettings(data);
    return settingsCache;
  } catch {
    try {
      localStorage.removeItem(SETTINGS_STORAGE_KEY);
    } catch {
      // Ignore quota / privacy errors on cleanup.
    }
    settingsCache = { ...DEFAULT_SETTINGS };
    return settingsCache;
  }
}

/** Current settings (hydrates on first call). Always a fresh object identity after updates. */
export function getSettings(): IPlayerSettings {
  return loadSettings();
}

export function saveSettings(settings: IPlayerSettings): void {
  const next = normalizeSettings(settings);
  settingsCache = next;
  try {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Keep in-memory prefs even if persistence fails.
  }
  emitSettingsChange();
}

export function updateSettings(partial: Partial<IPlayerSettings>): IPlayerSettings {
  const current = getSettings();
  const next = normalizeSettings({
    muted: partial.muted ?? current.muted,
    volume: partial.volume ?? current.volume,
  });
  saveSettings(next);
  return next;
}
