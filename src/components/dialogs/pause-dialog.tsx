import { useEffect, useRef } from 'react';
import { useGame } from '../../hooks/use-game';
import { GAME_ACTION } from '../../state/game-actions';
import { clearSave } from '../../storage/save';

const { resume, exitToMenu } = GAME_ACTION;

/** Pause overlay: Resume or Exit to Menu. */
export function PauseDialog() {
  const { dispatch } = useGame();
  const resumeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    resumeRef.current?.focus();
  }, []);

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
            dispatch({ type: resume });
          }}
        >
          Resume
        </button>
        <button
          type="button"
          className="pause-dialog__button pause-dialog__button--exit"
          onClick={() => {
            clearSave();
            dispatch({ type: exitToMenu });
          }}
        >
          Exit to Menu
        </button>
      </div>
    </div>
  );
}
