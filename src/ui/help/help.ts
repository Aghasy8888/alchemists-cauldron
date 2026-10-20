export function renderHelp(container: HTMLElement, onBack: () => void): void {
  container.replaceChildren();

  const dialog = document.createElement('div');
  dialog.className = 'help-dialog';
  dialog.setAttribute('role', 'dialog');
  dialog.setAttribute('aria-labelledby', 'help-dialog-title');
  dialog.setAttribute('aria-modal', 'true');

  const title = document.createElement('h2');
  title.id = 'help-dialog-title';
  title.className = 'help-dialog__title';
  title.textContent = 'How to Play';

  const body = document.createElement('div');
  body.className = 'help-dialog__body';

  const intro = document.createElement('p');
  intro.textContent =
    'Match the cauldron’s Temperature, Density, and Magic Power to the recipe ranges.';

  const list = document.createElement('ul');
  const rules = [
    'Click shelf ingredients to add them to the cauldron (stock is limited).',
    'Watch the parameter bars — green means you are in the target zone.',
    'Press Brew to check your mixture. Success scores points and a time bonus; failure costs a life.',
    'Pour Out clears a wrong mixture for 10 seconds — no life lost, and shelf stock is not returned.',
    'While playing: Esc or P pauses, B brews, O pours out, and keys 1–8 add shelf ingredients. Resume with the Resume button.',
    'The cauldron clears after every brew; shelf stock is not restored.',
    'Game ends when time runs out, lives reach zero, or ingredients run out.',
    'Choose difficulty in Settings before you start. You cannot change it mid-run.',
  ];
  for (const text of rules) {
    const item = document.createElement('li');
    item.textContent = text;
    list.append(item);
  }

  body.append(intro, list);

  const back = document.createElement('button');
  back.type = 'button';
  back.className = 'help-dialog__button';
  back.textContent = 'Back';
  back.addEventListener('click', onBack);

  dialog.append(title, body, back);
  container.append(dialog);
}
