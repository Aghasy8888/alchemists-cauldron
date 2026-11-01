const SVG_NS = 'http://www.w3.org/2000/svg';

/** Parse SVG markup into a live element (Vite `?raw` imports). */
export function parseSvg(raw: string): SVGSVGElement {
  const template = document.createElement('template');
  template.innerHTML = raw.trim();
  const root = template.content.firstElementChild;
  if (!(root instanceof SVGSVGElement)) {
    throw new Error('Invalid SVG markup');
  }
  return root;
}

export function cloneSvg(template: SVGSVGElement): SVGSVGElement {
  return template.cloneNode(true) as SVGSVGElement;
}

/**
 * Decorative by default (`aria-hidden`).
 * Pass `label` when the icon is the only accessible name.
 */
export function applyIconLabel(svg: SVGSVGElement, label?: string): void {
  const existingTitle = svg.querySelector('title');
  existingTitle?.remove();

  if (label === undefined || label === '') {
    svg.setAttribute('aria-hidden', 'true');
    svg.removeAttribute('role');
    svg.removeAttribute('aria-label');
    return;
  }

  svg.removeAttribute('aria-hidden');
  svg.setAttribute('role', 'img');
  svg.setAttribute('aria-label', label);

  const title = document.createElementNS(SVG_NS, 'title');
  title.textContent = label;
  svg.prepend(title);
}

/** Compact SVG element factory for any remaining imperative markup. */
export function svgEl<K extends keyof SVGElementTagNameMap>(
  tag: K,
  attrs: Record<string, string | number> = {},
): SVGElementTagNameMap[K] {
  const el = document.createElementNS(SVG_NS, tag);
  for (const [key, value] of Object.entries(attrs)) {
    el.setAttribute(key, String(value));
  }
  return el;
}
