import { applyUiSurfaceImages } from './assets/ui-surfaces';
import './styles/globals.scss';
import './styles/icons.scss';
import './styles/game.scss';
import { createApp } from './ui/app';

applyUiSurfaceImages();

const root = document.createElement('div');
root.id = 'app';
document.body.append(root);
createApp(root);
