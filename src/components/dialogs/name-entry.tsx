import { useState, type FormEvent } from 'react';
import type { Difficulty } from '../../data/types';
import { addLeaderboardEntry } from '../../storage/leaderboard';
import { isValidPlayerName } from '../../utils/player-name';

type NameEntryProps = {
  score: number;
  difficulty: Difficulty;
  onSubmitScore: () => void;
};

/** Qualifying Top-10 name form on Game Over. */
export function NameEntry({ score, difficulty, onSubmitScore }: NameEntryProps) {
  const [name, setName] = useState('');
  const valid = isValidPlayerName(name);
  const showError = name.trim().length > 0 && !valid;

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    if (!isValidPlayerName(name)) {
      return;
    }
    const saved = addLeaderboardEntry(name, score, difficulty);
    if (saved === null) {
      return;
    }
    onSubmitScore();
  };

  return (
    <form className="game-over__name-form" noValidate onSubmit={handleSubmit}>
      <label className="game-over__name-label" htmlFor="game-over-player-name">
        Enter your name (2-15 chars):
      </label>
      <input
        id="game-over-player-name"
        className="game-over__name-input"
        type="text"
        name="playerName"
        autoComplete="username"
        maxLength={15}
        placeholder="AlchemistName"
        aria-describedby="game-over-name-error"
        value={name}
        onChange={(event) => {
          setName(event.target.value);
        }}
      />
      <p id="game-over-name-error" className="game-over__name-error" hidden={!showError}>
        Use 2–15 letters, digits, space, _ or -.
      </p>
      <button type="submit" className="game-over__submit" disabled={!valid}>
        Submit Score
      </button>
    </form>
  );
}
