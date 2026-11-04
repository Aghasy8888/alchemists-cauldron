import { DIFFICULTY_CONFIG, difficultyButtonLabel, difficultyLabel } from '../../data/difficulty';
import { DIFFICULTY, type Difficulty } from '../../data/types';
import { useGame } from '../../hooks/use-game';
import { GAME_ACTION } from '../../state/game-actions';
import { SettingsSoundSection } from './settings-sound-section';
import { SettingsThemeSection } from './settings-theme-section';

const { easy, medium, hard } = DIFFICULTY;
const { setDifficulty } = GAME_ACTION;

const DIFFICULTY_ORDER: readonly Difficulty[] = [easy, medium, hard];

type SettingsDialogProps = {
  onBack: () => void;
};

export function SettingsDialog({ onBack }: SettingsDialogProps) {
  const { state, dispatch } = useGame();
  const { difficulty: current } = state;

  return (
    <div
      className="settings-dialog"
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-dialog-title"
    >
      <h2 id="settings-dialog-title" className="settings-dialog__title">
        Settings
      </h2>
      <p className="settings-dialog__hint">
        Choose difficulty before starting. Current: {difficultyLabel(current)}.
      </p>
      <div className="settings-dialog__list" role="group" aria-label="Difficulty">
        {DIFFICULTY_ORDER.map((difficulty) => {
          const config = DIFFICULTY_CONFIG[difficulty];
          const selected = difficulty === current;
          return (
            <button
              key={difficulty}
              type="button"
              className={
                selected
                  ? 'settings-dialog__option settings-dialog__option--selected'
                  : 'settings-dialog__option'
              }
              aria-pressed={selected}
              aria-label={`${difficultyLabel(difficulty)}, ${config.shelfIngredientCount} ingredients, ${config.startingTime} seconds, ${config.lives} lives`}
              onClick={() => {
                dispatch({ type: setDifficulty, difficulty });
                onBack();
              }}
            >
              {difficultyButtonLabel(difficulty)}
            </button>
          );
        })}
      </div>

      <SettingsSoundSection />

      <SettingsThemeSection />

      <button type="button" className="settings-dialog__button" onClick={onBack}>
        Back
      </button>
    </div>
  );
}
