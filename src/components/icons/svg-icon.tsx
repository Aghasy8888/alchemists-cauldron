type SvgIconProps = {
  className?: string;
  markup: string;
  /** When set, icon is exposed to assistive tech (not decorative). */
  label?: string;
};

/** Renders static SVG markup inside a themed host span. */
export function SvgIcon({ className, markup, label }: SvgIconProps) {
  const decorative = label === undefined || label === '';

  return (
    <span
      className={className}
      aria-hidden={decorative ? true : undefined}
      role={decorative ? undefined : 'img'}
      aria-label={decorative ? undefined : label}
      dangerouslySetInnerHTML={{ __html: markup }}
    />
  );
}
