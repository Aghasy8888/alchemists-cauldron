import { useSyncExternalStore } from 'react';
import { getSettings, subscribeSettings, type IPlayerSettings } from '../storage/settings';

export function usePlayerSettings(): IPlayerSettings {
  return useSyncExternalStore(subscribeSettings, getSettings, getSettings);
}
