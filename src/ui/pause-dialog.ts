export function renderPauseDialog(
  container: HTMLElement,
  onResume: () => void,
  onExitToMenu: () => void,
): void {
  container.replaceChildren();

  const dialog = document.createElement('div');
  dialog.className = 'pause-dialog';
  dialog.setAttribute('role', 'dialog');
  dialog.setAttribute('aria-labelledby', 'pause-dialog-title');
  dialog.setAttribute('aria-modal', 'true');

  const title = document.createElement('h2');
  title.id = 'pause-dialog-title';
  title.className = 'pause-dialog__title';
  title.textContent = 'Game Paused';

  const actions = document.createElement('div');
  actions.className = 'pause-dialog__actions';

  const resume = document.createElement('button');
  resume.type = 'button';
  resume.className = 'pause-dialog__button pause-dialog__button--resume';
  resume.textContent = 'Resume';
  resume.addEventListener('click', onResume);

  const exit = document.createElement('button');
  exit.type = 'button';
  exit.className = 'pause-dialog__button pause-dialog__button--exit';
  exit.textContent = 'Exit to Menu';
  exit.addEventListener('click', onExitToMenu);

  actions.append(resume, exit);
  dialog.append(title, actions);
  container.append(dialog);
}
