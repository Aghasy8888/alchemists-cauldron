import { useState, type ReactNode } from 'react';
import { GameOverlayContext } from './game-overlay-context';

type GameOverlayProviderProps = {
  children: ReactNode;
};

/** Holds in-game overlay content for GameShell + keyboard shortcut gating. */
export function GameOverlayProvider({ children }: GameOverlayProviderProps) {
  const [overlay, setOverlay] = useState<ReactNode>(null);

  return (
    <GameOverlayContext.Provider
      value={{
        overlay,
        overlayOpen: overlay != null,
        setOverlay,
        clearOverlay: () => {
          setOverlay(null);
        },
      }}
    >
      {children}
    </GameOverlayContext.Provider>
  );
}
