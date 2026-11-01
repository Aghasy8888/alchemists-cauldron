import type { ReactNode } from 'react';

type GameShellProps = {
  hud: ReactNode;
  actions: ReactNode;
  boardPaused?: boolean;
  overlay?: ReactNode;
};

export function GameShell({ hud, actions, boardPaused = false, overlay }: GameShellProps) {
  const boardClassName = boardPaused ? 'game__board game__board--paused' : 'game__board';

  return (
    <div className="game">
      <header className="game__header">
        <h1 className="game__title">Alchemist&apos;s Cauldron</h1>
        <div className="game__hud">{hud}</div>
      </header>

      <div className={boardClassName}>
        <main className="game__main">
          <section className="game__shelf" aria-label="Shelf" />
          <section className="game__cauldron" aria-label="Cauldron" />
          <section className="game__recipe" aria-label="Recipe panel" />
          <section className="game__bars" aria-label="Parameter bars" />
        </main>

        <div className="game__actions">{actions}</div>

        <div className="game__overlay" hidden={overlay == null}>
          {overlay}
        </div>
      </div>
    </div>
  );
}
