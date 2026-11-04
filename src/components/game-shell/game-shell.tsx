import type { ReactNode, Ref } from 'react';
import { GAME_SURFACES_READY_CLASS } from '../../assets/ui-surfaces';
import { usePlayerSettings } from '../../hooks/use-player-settings';

type GameShellProps = {
  hud: ReactNode;
  actions: ReactNode;
  shelf?: ReactNode;
  cauldron?: ReactNode;
  recipe?: ReactNode;
  bars?: ReactNode;
  boardPaused?: boolean;
  boardMenu?: boolean;
  shelfDragging?: boolean;
  surfacesReady?: boolean;
  overlay?: ReactNode;
  boardRef?: Ref<HTMLDivElement>;
};

export function GameShell({
  hud,
  actions,
  shelf,
  cauldron,
  recipe,
  bars,
  boardPaused = false,
  boardMenu = false,
  shelfDragging = false,
  surfacesReady = false,
  overlay,
  boardRef,
}: GameShellProps) {
  const { theme } = usePlayerSettings();
  const gameClassName = surfacesReady ? `game ${GAME_SURFACES_READY_CLASS}` : 'game';
  const boardClassName = [
    'game__board',
    boardPaused ? 'game__board--paused' : '',
    boardMenu ? 'game__board--menu' : '',
    shelfDragging ? 'game__board--shelf-dragging' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={gameClassName} data-theme={theme}>
      <header className="game__header">
        <h1 className="game__title">Alchemist&apos;s Cauldron</h1>
        <div className="game__hud">{hud}</div>
      </header>

      <div ref={boardRef} className={boardClassName}>
        <main className="game__main">
          {shelf}
          {cauldron}
          {recipe}
          {bars ?? <section className="game__bars" aria-label="Parameter bars" />}
        </main>

        <div className="game__actions">{actions}</div>

        <div className="game__overlay" hidden={overlay == null}>
          {overlay}
        </div>
      </div>
    </div>
  );
}
