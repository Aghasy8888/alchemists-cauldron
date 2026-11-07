/** Trim Vite `?raw` SVG imports for `dangerouslySetInnerHTML`. */
export function trimSvgMarkup(raw: string): string {
  return raw.trim();
}
