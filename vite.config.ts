import { defineConfig } from 'vite';

// GitHub Pages project site: https://<user>.github.io/alchemists-cauldron/
export default defineConfig(({ mode }) => ({
  base: mode === 'production' ? '/alchemists-cauldron/' : '/',
  root: '.',
  publicDir: 'public',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
}));
