type HeartIconProps = {
  className?: string;
};

export function HeartIcon({ className }: HeartIconProps) {
  const classes =
    className === undefined ? 'hud-icon hud-icon--heart' : `hud-icon hud-icon--heart ${className}`;

  return (
    <svg className={classes} viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
      <path
        d="M12 20s-7-4.35-7-9.2C5 7.57 7.24 5.5 9.6 5.5c1.35 0 2.52.7 3.15 1.74C13.38 6.2 14.55 5.5 15.9 5.5 18.26 5.5 20.5 7.57 20.5 10.8 20.5 15.65 12 20 12 20z"
        fill="currentColor"
      />
    </svg>
  );
}
