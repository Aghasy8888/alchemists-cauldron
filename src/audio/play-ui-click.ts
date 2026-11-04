import { playSfx } from './play-sfx';
import { SFX_ID } from './sfx-id';

const { uiClick } = SFX_ID;

export function playUiClick(): void {
  playSfx(uiClick);
}

export function runWithUiClick(action: () => void): void {
  playUiClick();
  action();
}
