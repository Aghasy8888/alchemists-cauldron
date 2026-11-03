import type { UiIconId } from '../../assets/ui-icons';
import { difficultyLabel } from '../../data/difficulty';
import { GAME_STATUS } from '../../data/types';
import { useContinuableSave } from '../../hooks/use-continuable-save';
import { useGame } from '../../hooks/use-game';
import { useGameOverlay } from '../../hooks/use-game-overlay';
import { useOpenLeaderboard } from '../../hooks/use-open-leaderboard';
import { usePauseGame } from '../../hooks/use-pause-game';
import { GAME_ACTION } from '../../state/game-actions';
import { continueSavedGame } from '../../storage/save';
import { unlockAudio } from '../../audio';
import { HelpDialog, SettingsDialog } from '../dialogs';
import { UiIcon } from '../icons';

const { menu, playing } = GAME_STATUS;
const { startGame, continueGame, brew, pourOut } = GAME_ACTION;

type MenuButtonProps = {
  className: string;
  label: string;
  icon: UiIconId;
  onClick: () => void;
  variant: 'primary' | 'continue' | 'chrome';
};

function MenuButton({ className, label, icon, onClick, variant }: MenuButtonProps) {
  return (
    <button
      type="button"
      className={`menu-controls__btn menu-controls__btn--${variant} ${className}`}
      onClick={onClick}
    >
      <span className="menu-controls__btn-icon">
        <UiIcon id={icon} />
      </span>
      <span className="menu-controls__btn-label">{label}</span>
    </button>
  );
}

export function ActionControls() {
  const { state, dispatch } = useGame();
  const { setOverlay, clearOverlay } = useGameOverlay();
  const openLeaderboard = useOpenLeaderboard();
  const pauseGame = usePauseGame();
  const canContinue = useContinuableSave();
  const { status, difficulty, cauldronIngredients } = state;
  const canBrew = cauldronIngredients.length >= 1;
  const canPourOut = cauldronIngredients.length >= 1;

  if (status === menu) {
    const primaryClassName = canContinue
      ? 'menu-controls__primary menu-controls__primary--split'
      : 'menu-controls__primary';

    return (
      <div className="menu-controls">
        <p className="menu-controls__difficulty">Difficulty: {difficultyLabel(difficulty)}</p>

        <div className={primaryClassName}>
          <MenuButton
            className="game__start"
            label="Start Game"
            icon="play"
            variant="primary"
            onClick={() => {
              unlockAudio();
              dispatch({ type: startGame });
            }}
          />
          {canContinue ? (
            <MenuButton
              className="game__continue"
              label="Continue"
              icon="continue"
              variant="continue"
              onClick={() => {
                unlockAudio();
                const restored = continueSavedGame();
                if (restored !== null) {
                  dispatch({ type: continueGame, state: restored });
                }
              }}
            />
          ) : null}
        </div>

        <div className="menu-controls__chrome">
          <MenuButton
            className="game__settings"
            label="Settings"
            icon="settings"
            variant="chrome"
            onClick={() => {
              setOverlay(<SettingsDialog onBack={clearOverlay} />);
            }}
          />
          <MenuButton
            className="game__help"
            label="Help"
            icon="help"
            variant="chrome"
            onClick={() => {
              setOverlay(<HelpDialog onBack={clearOverlay} />);
            }}
          />
          <MenuButton
            className="game__leaderboard"
            label="Leaderboard"
            icon="leaderboard"
            variant="chrome"
            onClick={openLeaderboard}
          />
        </div>
      </div>
    );
  }

  if (status !== playing) {
    return null;
  }

  return (
    <div className="brew-controls">
      <div className="brew-controls__row">
        <button
          type="button"
          className="brew-controls__button"
          disabled={!canBrew}
          aria-label={canBrew ? 'Brew the cauldron mixture' : 'Add at least one ingredient to brew'}
          onClick={() => {
            dispatch({ type: brew });
          }}
        >
          Brew
        </button>
        <button
          type="button"
          className="brew-controls__pour-out"
          disabled={!canPourOut}
          aria-label={
            canPourOut
              ? 'Pour out the cauldron (costs 10 seconds)'
              : 'Cauldron is empty — nothing to pour out'
          }
          onClick={() => {
            dispatch({ type: pourOut });
          }}
        >
          Pour Out
        </button>
        <button
          type="button"
          className="brew-controls__pause"
          aria-label="Pause the game"
          onClick={pauseGame}
        >
          Pause
        </button>
      </div>
    </div>
  );
}
