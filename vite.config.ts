import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './', // Esto soluciona la pantalla en blanco
  build: {
    outDir: 'dist',
    target: 'esnext'
  }
});
