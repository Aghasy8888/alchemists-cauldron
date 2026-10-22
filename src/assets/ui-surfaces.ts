import barsBgUrl from './images/game-bars-bg.png';
import barsBgWideUrl from './images/game-bars-bg-wide.png';
import shelfItemBgUrl from './images/Ingredient-shelf-item.png';
import recipeBgUrl from './images/recipe-bg-image.png';

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
