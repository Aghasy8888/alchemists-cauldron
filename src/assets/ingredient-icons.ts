/** Simple per-ingredient SVG icons (separate assets, not a composite image). */

const SVG_NS = 'http://www.w3.org/2000/svg';

function createSvgRoot(): SVGSVGElement {
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('viewBox', '0 0 40 40');
  svg.setAttribute('width', '40');
  svg.setAttribute('height', '40');
  svg.setAttribute('aria-hidden', 'true');
  svg.classList.add('ingredient-icon');
  return svg;
}

function circle(cx: number, cy: number, r: number, fill: string): SVGCircleElement {
  const el = document.createElementNS(SVG_NS, 'circle');
  el.setAttribute('cx', String(cx));
  el.setAttribute('cy', String(cy));
  el.setAttribute('r', String(r));
  el.setAttribute('fill', fill);
  return el;
}

function path(d: string, fill: string): SVGPathElement {
  const el = document.createElementNS(SVG_NS, 'path');
  el.setAttribute('d', d);
  el.setAttribute('fill', fill);
  return el;
}

const builders: Record<string, () => SVGSVGElement> = {
  'dragon-tears': () => {
    const svg = createSvgRoot();
    svg.append(
      circle(20, 14, 8, '#e85d04'),
      path('M20 22 C12 28 12 34 20 36 C28 34 28 28 20 22 Z', '#f48c06'),
    );
    return svg;
  },
  'fairy-dust': () => {
    const svg = createSvgRoot();
    svg.append(
      circle(20, 20, 6, '#c77dff'),
      circle(10, 12, 3, '#e0aaff'),
      circle(30, 14, 3, '#e0aaff'),
      circle(12, 28, 2.5, '#e0aaff'),
      circle(28, 28, 2.5, '#e0aaff'),
    );
    return svg;
  },
  'frost-lotus': () => {
    const svg = createSvgRoot();
    svg.append(
      path('M20 8 L24 18 L20 16 L16 18 Z', '#90e0ef'),
      path('M20 32 L24 22 L20 24 L16 22 Z', '#90e0ef'),
      path('M8 20 L18 16 L16 20 L18 24 Z', '#48cae4'),
      path('M32 20 L22 16 L24 20 L22 24 Z', '#48cae4'),
      circle(20, 20, 4, '#caf0f8'),
    );
    return svg;
  },
  'mandrake-root': () => {
    const svg = createSvgRoot();
    svg.append(
      path('M18 8 H22 V18 H28 V22 H22 V34 H18 V22 H12 V18 H18 Z', '#6a994e'),
      path('M14 30 Q20 36 26 30', '#386641'),
    );
    return svg;
  },
  'caustic-acid': () => {
    const svg = createSvgRoot();
    svg.append(
      path('M14 8 H26 L24 16 H16 Z', '#adb5bd'),
      path('M12 16 H28 L26 34 H14 Z', '#52b788'),
      circle(20, 24, 3, '#95d5b2'),
    );
    return svg;
  },
  'essence-of-the-void': () => {
    const svg = createSvgRoot();
    svg.append(
      circle(20, 20, 12, '#240046'),
      circle(20, 20, 6, '#7b2cbf'),
      circle(20, 20, 2.5, '#e0aaff'),
    );
    return svg;
  },
  'phoenix-feather': () => {
    const svg = createSvgRoot();
    svg.append(
      path('M10 30 Q20 4 30 30 Q20 24 10 30 Z', '#dc2f02'),
      path('M16 28 Q20 12 24 28', '#f48c06'),
    );
    return svg;
  },
  'toad-slime': () => {
    const svg = createSvgRoot();
    svg.append(
      path('M8 22 Q20 8 32 22 Q28 34 20 34 Q12 34 8 22 Z', '#80b918'),
      circle(15, 20, 2, '#143601'),
      circle(25, 20, 2, '#143601'),
    );
    return svg;
  },
};

export function createIngredientIcon(iconId: string): SVGSVGElement {
  const build = builders[iconId];
  if (build === undefined) {
    const svg = createSvgRoot();
    svg.append(circle(20, 20, 10, '#adb5bd'));
    return svg;
  }
  return build();
}
