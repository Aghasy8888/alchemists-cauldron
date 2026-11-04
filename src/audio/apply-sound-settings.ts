import { updateSettings, type IPlayerSettings } from '../storage/settings';
import { unlockAudio } from './context';

export function applySoundSettings(partial: Partial<IPlayerSettings>): IPlayerSettings {
  const next = updateSettings(partial);
  unlockAudio();
  return next;
}
