import './styles/globals.scss';
import './styles/game.scss';
import { createApp } from './ui/app';

const root = document.createElement('div');
root.id = 'app';
document.body.append(root);
createApp(root);
