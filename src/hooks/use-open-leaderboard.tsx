import {
  ClearLeaderboardConfirm,
  LeaderboardDialog,
} from '../components/dialogs/leaderboard-overlay';
import { useGameOverlay } from './use-game-overlay';

/** Opens the Leaderboard overlay with nested clear-confirm support. */
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

    showLeaderboard();
  };

  return openLeaderboard;
}
