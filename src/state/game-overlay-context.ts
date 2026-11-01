import { createContext, type ReactNode } from 'react';

export type GameOverlayContextValue = {
  overlay: ReactNode;
  overlayOpen: boolean;
  setOverlay: (node: ReactNode) => void;
  clearOverlay: () => void;
};

export const GameOverlayContext = createContext<GameOverlayContextValue | null>(null);
