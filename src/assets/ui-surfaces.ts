import cauldronArtUrl from './images/game-cauldron.png';
import barsBgUrl from './images/game-bars-bg.png';
import barsBgWideUrl from './images/game-bars-bg-wide.png';
import shelfItemBgUrl from './images/Ingredient-shelf-item.png';
import recipeBgUrl from './images/recipe-bg-image.png';

export const UI_SURFACES_READY_CLASS = 'ui-surfaces-ready';

const SURFACE_IMAGE_URLS = [
  shelfItemBgUrl,
  barsBgUrl,
  barsBgWideUrl,
  recipeBgUrl,
  cauldronArtUrl,
] as const;

/**
 * Register UI surface images as CSS custom properties.
 * Vite tracks these imports, so replacing a PNG updates the URL (SCSS `url()` alone can 404 after replace).
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

/** Decode every surface PNG, then mark the document ready for the CSS fade-in. */
export async function preloadUiSurfaceImages(): Promise<void> {
  await Promise.all(SURFACE_IMAGE_URLS.map((url) => loadImage(url)));
  document.documentElement.classList.add(UI_SURFACES_READY_CLASS);
}
