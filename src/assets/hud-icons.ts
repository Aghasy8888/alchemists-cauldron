import { applyIconLabel, svgEl } from './svg-utils';

function createRoot(className: string): SVGSVGElement {
  const svg = svgEl('svg', {
    viewBox: '0 0 24 24',
    width: 20,
    height: 20,
    class: className,
    fill: 'none',
  });
  return svg;
}

export function createClockIcon(): SVGSVGElement {
  const svg = createRoot('hud-icon hud-icon--clock');
  svg.append(
    svgEl('circle', { cx: 12, cy: 12, r: 9, stroke: 'currentColor', 'stroke-width': 2 }),
    svgEl('path', {
      d: 'M12 7v5l3 2',
      stroke: 'currentColor',
      'stroke-width': 2,
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
    }),
  );
  applyIconLabel(svg);
  return svg;
}

export function createHeartIcon(): SVGSVGElement {
  const svg = createRoot('hud-icon hud-icon--heart');
  svg.append(
    svgEl('path', {
      d: 'M12 20s-7-4.35-7-9.2C5 7.57 7.24 5.5 9.6 5.5c1.35 0 2.52.7 3.15 1.74C13.38 6.2 14.55 5.5 15.9 5.5 18.26 5.5 20.5 7.57 20.5 10.8 20.5 15.65 12 20 12 20z',
      fill: 'currentColor',
    }),
  );
  applyIconLabel(svg);
  return svg;
}
