import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { applyUiSurfaceImages, preloadUiSurfaceImages } from './assets/ui-surfaces';
import { App } from './App';
import { GameProvider } from './state/game-provider';
import './styles/globals.scss';
import './styles/icons.scss';
import './styles/game.scss';

applyUiSurfaceImages();
void preloadUiSurfaceImages();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GameProvider>
      <App />
    </GameProvider>
  </StrictMode>,
);
