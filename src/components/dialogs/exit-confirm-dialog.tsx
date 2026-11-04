import { useEffect, useRef } from 'react';
import { runWithUiClick } from '../../audio';

type ExitConfirmDialogProps = {
  onSaveAndExit: () => void;
  onExitWithoutSaving: () => void;
  onBack: () => void;
};

export function ExitConfirmDialog({
  onSaveAndExit,
  onExitWithoutSaving,
  onBack,
}: ExitConfirmDialogProps) {
  const saveRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    saveRef.current?.focus();
  }, []);

  return (
    <div
      className="exit-confirm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="exit-confirm-title"
    >
      <h2 id="exit-confirm-title" className="exit-confirm__title">
        Save game to continue later?
      </h2>
      <p className="exit-confirm__message">
        Saved progress can be resumed from the start screen with Continue.
      </p>
      <div className="exit-confirm__actions">
        <button
          ref={saveRef}
          type="button"
          className="exit-confirm__button exit-confirm__button--save"
          onClick={() => runWithUiClick(onSaveAndExit)}
        >
          Save &amp; Exit
        </button>
        <button
          type="button"
          className="exit-confirm__button exit-confirm__button--discard"
          onClick={() => runWithUiClick(onExitWithoutSaving)}
        >
          Exit without saving
        </button>
        <button
          type="button"
          className="exit-confirm__button exit-confirm__button--back"
          onClick={() => runWithUiClick(onBack)}
        >
          Back
        </button>
      </div>
    </div>
  );
}
