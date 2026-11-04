import { playUiClick } from '../audio';
import {
  ClearLeaderboardConfirm,
  LeaderboardDialog,
} from '../components/dialogs/leaderboard-overlay';
import { useGameOverlay } from './use-game-overlay';

export function useOpenLeaderboard(): () => void {
  const { setOverlay, clearOverlay } = useGameOverlay();

  const openLeaderboard = (): void => {
    const dismissLeaderboard = (): void => {
      playUiClick();
      clearOverlay();
    };

    const showLeaderboard = (): void => {
      setOverlay(
        <LeaderboardDialog
          onBack={dismissLeaderboard}
          onRequestClear={() => {
            playUiClick();
            setOverlay(
              <ClearLeaderboardConfirm onCancel={showLeaderboard} onConfirm={showLeaderboard} />,
            );
          }}
        />,
      );
    };

    playUiClick();
    showLeaderboard();
  };

  return openLeaderboard;
}
