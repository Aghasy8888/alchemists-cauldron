import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// GitHub Pages project site: https://<user>.github.io/alchemists-cauldron/
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  base: mode === 'production' ? '/alchemists-cauldron/' : '/',
  publicDir: 'public',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
}));
