export function renderStartControls(
  container: HTMLElement,
  isPlaying: boolean,
  onStart: () => void,
): void {
  container.replaceChildren();

  if (isPlaying) {
    return;
  }

  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'start-game';
  button.textContent = 'Start Game';
  button.addEventListener('click', onStart);
  container.append(button);
}
