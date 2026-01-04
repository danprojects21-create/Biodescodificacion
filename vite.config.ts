
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    // Asegura que process.env esté disponible para la SDK de Gemini
    'process.env': process.env
  },
  build: {
    target: 'esnext'
  }
});
