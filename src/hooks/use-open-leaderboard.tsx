import { playUiClick } from '../audio';
import {
  ClearLeaderboardConfirm,
  LeaderboardDialog,
} from '../components/dialogs/leaderboard-overlay';
import { useGameOverlay } from './use-game-overlay';

export function useOpenLeaderboard(): () => void {
  const { setOverlay, clearOverlay } = useGameOverlay();

  const openLeaderboard = (): void => {
    const showLeaderboard = (): void => {
      setOverlay(
        <LeaderboardDialog
          onBack={clearOverlay}
          onRequestClear={() => {
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
