import cauldronArtUrl from './images/game-cauldron.png';
import barsBgUrl from './images/game-bars-bg.png';
import barsBgWideUrl from './images/game-bars-bg-wide.png';
import shelfItemBgUrl from './images/Ingredient-shelf-item.png';
import recipeBgUrl from './images/recipe-bg-image.png';

/** BEM modifier on `.game` after surface PNGs are decoded (React-owned, not `html`). */
export const GAME_SURFACES_READY_CLASS = 'game--surfaces-ready';

const SURFACE_IMAGE_URLS = [
  shelfItemBgUrl,
  barsBgUrl,
  barsBgWideUrl,
  recipeBgUrl,
  cauldronArtUrl,
] as const;

/**
 * Register UI surface images as CSS custom properties on `:root`.
 * Vite tracks these imports, so replacing a PNG updates the URL (SCSS `url()` alone can 404 after replace).
 * Call once at bootstrap (allowed document `:root` style write — not UI chrome class toggles).
 */
export function applyUiSurfaceImages(): void {
  const { style } = document.documentElement;
  style.setProperty('--img-shelf-item', `url("${shelfItemBgUrl}")`);
  style.setProperty('--img-bars-bg', `url("${barsBgUrl}")`);
  style.setProperty('--img-bars-bg-wide', `url("${barsBgWideUrl}")`);
  style.setProperty('--img-recipe-bg', `url("${recipeBgUrl}")`);
}

function loadImage(url: string): Promise<void> {
  return new Promise((resolve) => {
    const image = new Image();
    let settled = false;

    const settle = (): void => {
      if (settled) {
        return;
      }
      settled = true;
      resolve();
    };

    const finish = (): void => {
      if (typeof image.decode === 'function') {
        void image.decode().then(settle).catch(settle);
        return;
      }
      settle();
    };

    image.addEventListener('load', finish);
    image.addEventListener('error', settle);
    image.src = url;

    if (image.complete) {
      if (image.naturalWidth > 0) {
        finish();
      } else {
        settle();
      }
    }
  });
}

/** Decode every surface PNG (caller applies React-owned ready class). */
export async function preloadUiSurfaceImages(): Promise<void> {
  await Promise.all(SURFACE_IMAGE_URLS.map((url) => loadImage(url)));
}
