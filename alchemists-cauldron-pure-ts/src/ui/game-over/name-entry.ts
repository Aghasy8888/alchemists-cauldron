import type { Difficulty } from '../../data/types';
import { addLeaderboardEntry } from '../../storage/leaderboard';
import { isValidPlayerName } from '../../utils/player-name';

export function createNameEntry(
  score: number,
  difficulty: Difficulty,
  onSubmitScore: () => void,
): HTMLElement {
  const form = document.createElement('form');
  form.className = 'game-over__name-form';
  form.setAttribute('novalidate', '');

  const label = document.createElement('label');
  label.className = 'game-over__name-label';
  label.htmlFor = 'game-over-player-name';
  label.textContent = 'Enter your name (2-15 chars):';

  const input = document.createElement('input');
  input.id = 'game-over-player-name';
  input.className = 'game-over__name-input';
  input.type = 'text';
  input.name = 'playerName';
  input.autocomplete = 'username';
  input.maxLength = 15;
  input.placeholder = 'AlchemistName';
  input.setAttribute('aria-describedby', 'game-over-name-error');

  const error = document.createElement('p');
  error.id = 'game-over-name-error';
  error.className = 'game-over__name-error';
  error.hidden = true;
  error.textContent = 'Use 2–15 letters, digits, space, _ or -.';

  const submit = document.createElement('button');
  submit.type = 'submit';
  submit.className = 'game-over__submit';
  submit.textContent = 'Submit Score';
  submit.disabled = true;

  const syncSubmit = (): void => {
    const valid = isValidPlayerName(input.value);
    submit.disabled = !valid;
    error.hidden = input.value.trim().length === 0 || valid;
  };

  input.addEventListener('input', syncSubmit);

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!isValidPlayerName(input.value)) {
      error.hidden = false;
      submit.disabled = true;
      return;
    }
    const saved = addLeaderboardEntry(input.value, score, difficulty);
    if (saved === null) {
      error.hidden = false;
      return;
    }
    onSubmitScore();
  });

  form.append(label, input, error, submit);
  return form;
}
