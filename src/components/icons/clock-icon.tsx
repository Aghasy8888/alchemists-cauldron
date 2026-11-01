type ClockIconProps = {
  className?: string;
};

export function ClockIcon({ className }: ClockIconProps) {
  const classes =
    className === undefined ? 'hud-icon hud-icon--clock' : `hud-icon hud-icon--clock ${className}`;

  return (
    <svg className={classes} viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
      <path
        d="M12 7v5l3 2"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
