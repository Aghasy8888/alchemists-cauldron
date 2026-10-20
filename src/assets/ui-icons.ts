import continueSvg from './icons/ui/continue.svg?raw';
import helpSvg from './icons/ui/help.svg?raw';
import leaderboardSvg from './icons/ui/leaderboard.svg?raw';
import playSvg from './icons/ui/play.svg?raw';
import settingsSvg from './icons/ui/settings.svg?raw';
import { applyIconLabel, cloneSvg, parseSvg } from './svg-utils';

export type UiIconId = 'play' | 'continue' | 'settings' | 'help' | 'leaderboard';

const templates = {
  play: parseSvg(playSvg),
  continue: parseSvg(continueSvg),
  settings: parseSvg(settingsSvg),
  help: parseSvg(helpSvg),
  leaderboard: parseSvg(leaderboardSvg),
} as const satisfies Record<UiIconId, SVGSVGElement>;

/** Returns a wrapper span containing a decorative UI action icon. */
export function createUiIcon(id: UiIconId): HTMLElement {
  const wrap = document.createElement('span');
  wrap.className = `ui-icon ui-icon--${id}`;

  const svg = cloneSvg(templates[id]);
  applyIconLabel(svg);
  wrap.append(svg);
  return wrap;
}
