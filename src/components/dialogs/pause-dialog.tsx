import { useEffect, useRef, useState } from 'react';
import { useGame } from '../../hooks/use-game';
import { GAME_ACTION } from '../../state/game-actions';
import { clearSave, saveGame } from '../../storage/save';
import { runWithUiClick, unlockAudio } from '../../audio';
import { ExitConfirmDialog } from './exit-confirm-dialog';

const { resume, exitToMenu } = GAME_ACTION;

const PAUSE_VIEW = {
  pause: 'pause',
  confirmExit: 'confirm-exit',
} as const;

type PauseView = (typeof PAUSE_VIEW)[keyof typeof PAUSE_VIEW];

const { pause: pauseView, confirmExit } = PAUSE_VIEW;

export function PauseDialog() {
  const { state, dispatch } = useGame();
  const [view, setView] = useState<PauseView>(pauseView);
  const resumeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (view === pauseView) {
      resumeRef.current?.focus();
    }
  }, [view]);

  if (view === confirmExit) {
    return (
      <ExitConfirmDialog
        onSaveAndExit={() => {
          saveGame(state);
          dispatch({ type: exitToMenu });
        }}
        onExitWithoutSaving={() => {
          clearSave();
          dispatch({ type: exitToMenu });
        }}
        onBack={() => {
          setView(pauseView);
        }}
      />
    );
  }

  return (
    <div
      className="pause-dialog"
      role="dialog"
      aria-modal="true"
      aria-labelledby="pause-dialog-title"
    >
      <h2 id="pause-dialog-title" className="pause-dialog__title">
        Game Paused
      </h2>
      <div className="pause-dialog__actions">
        <button
          ref={resumeRef}
          type="button"
          className="pause-dialog__button pause-dialog__button--resume"
          onClick={() => {
            runWithUiClick(() => {
              unlockAudio();
              dispatch({ type: resume });
            });
          }}
        >
          Resume
        </button>
        <button
          type="button"
          className="pause-dialog__button pause-dialog__button--exit"
          onClick={() => {
            runWithUiClick(() => {
              if (state.continuedUntouched) {
                dispatch({ type: exitToMenu });
                return;
              }
              setView(confirmExit);
            });
          }}
        >
          Exit to Menu
        </button>
      </div>
    </div>
  );
}
