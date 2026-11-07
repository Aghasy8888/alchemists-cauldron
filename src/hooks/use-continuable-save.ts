import { useSyncExternalStore } from 'react';
import { hasContinuableSave, subscribeSaveVersion } from '../storage/save';

/** Whether a continuable save exists; re-renders when saveGame / clearSave change localStorage. */
export function useContinuableSave(): boolean {
  return useSyncExternalStore(subscribeSaveVersion, hasContinuableSave, hasContinuableSave);
}
