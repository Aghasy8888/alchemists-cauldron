import continueSvg from './icons/ui/continue.svg?raw';
import helpSvg from './icons/ui/help.svg?raw';
import leaderboardSvg from './icons/ui/leaderboard.svg?raw';
import playSvg from './icons/ui/play.svg?raw';
import settingsSvg from './icons/ui/settings.svg?raw';
import { trimSvgMarkup } from './svg-utils';

export type UiIconId = 'play' | 'continue' | 'settings' | 'help' | 'leaderboard';

const markupById = {
  play: trimSvgMarkup(playSvg),
  continue: trimSvgMarkup(continueSvg),
  settings: trimSvgMarkup(settingsSvg),
  help: trimSvgMarkup(helpSvg),
  leaderboard: trimSvgMarkup(leaderboardSvg),
} as const satisfies Record<UiIconId, string>;

export function getUiIconMarkup(id: UiIconId): string {
  return markupById[id];
}
