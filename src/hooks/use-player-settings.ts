import { useSyncExternalStore } from 'react';
import { getSettings, subscribeSettings, type IPlayerSettings } from '../storage/settings';

/** Live player settings (mute / volume) from the settings store. */
export function usePlayerSettings(): IPlayerSettings {
  return useSyncExternalStore(subscribeSettings, getSettings, getSettings);
}
