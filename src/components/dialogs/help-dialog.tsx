import { runWithUiClick } from '../../audio';

type HelpDialogProps = {
  onBack: () => void;
};

type HelpSection = {
  title: string;
  items: readonly string[];
};

const HELP_SECTIONS: readonly HelpSection[] = [
  {
    title: 'Brewing',
    items: [
      'Click shelf ingredients to add them to the cauldron (stock is limited).',
      'Watch the parameter bars — green means you are in the target zone.',
      'Press Brew to check your mixture. Success scores points and a time bonus; failure costs a life.',
      'Pour Out clears a wrong mixture for 10 seconds — no life lost, and shelf stock is not returned.',
      'The cauldron clears after every brew; shelf stock is not restored.',
    ],
  },
  {
    title: 'Controls',
    items: [
      'While playing: Esc or P pauses, B brews, O pours out, and keys 1–8 add shelf ingredients. Resume with the Resume button.',
      'Gamepad (standard layout): Start pauses, A brews, B pours out, and LB/RB/LT/RT plus the D-pad add shelf slots 1–8. Resume with the Resume button.',
    ],
  },
  {
    title: 'Game end',
    items: ['Game ends when time runs out, lives reach zero, or ingredients run out.'],
  },
  {
    title: 'Settings',
    items: [
      'Choose difficulty in Settings before you start. You cannot change it mid-run.',
      'Mute silences everything. Volume is the master level; Music adjusts background music only.',
    ],
  },
  {
    title: 'Music',
    items: [
      'Wizardtorium by Kevin MacLeod (incompetech.com), licensed under Creative Commons By Attribution 4.0.',
    ],
  },
];

export function HelpDialog({ onBack }: HelpDialogProps) {
  return (
    <div
      className="help-dialog"
      role="dialog"
      aria-modal="true"
      aria-labelledby="help-dialog-title"
    >
      <h2 id="help-dialog-title" className="help-dialog__title">
        How to Play
      </h2>
      <div className="help-dialog__body">
        <p>Match the cauldron’s Temperature, Density, and Magic Power to the recipe ranges.</p>
        {HELP_SECTIONS.map(({ title, items }) => (
          <section key={title} className="help-dialog__section">
            <h3 className="help-dialog__section-title">{title}</h3>
            <ul>
              {items.map((text) => (
                <li key={text}>{text}</li>
              ))}
            </ul>
          </section>
        ))}
      </div>
      <button type="button" className="help-dialog__button" onClick={() => runWithUiClick(onBack)}>
        Back
      </button>
    </div>
  );
}
