import babel from '@rolldown/plugin-babel';
import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// GitHub Pages project site: https://aghasy8888.github.io/alchemists-cauldron/
export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    babel({
      presets: [reactCompilerPreset()],
    }),
  ],
  base: mode === 'production' ? '/alchemists-cauldron/' : '/',
  publicDir: 'public',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
}));
