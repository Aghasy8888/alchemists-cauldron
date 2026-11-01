import { useGame } from './hooks/use-game';

export function App() {
  const { state } = useGame();

  return (
    <main className="app">
      <h1 className="app__title">Alchemist&apos;s Cauldron</h1>
      <p className="app__status">
        Status: {state.status} · Difficulty: {state.difficulty}
      </p>
    </main>
  );
}
