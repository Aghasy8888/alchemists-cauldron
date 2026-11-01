import { defineConfig } from 'vite';

// GitHub Pages project site: https://aghasy8888.github.io/alchemists-cauldron/
export default defineConfig(({ mode }) => ({
  base: mode === 'production' ? '/alchemists-cauldron/' : '/',
  root: '.',
  publicDir: 'public',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
}));
