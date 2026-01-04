import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './', // ESTA LÍNEA ES LA QUE ARREGLA LA PANTALLA EN BLANCO
  define: {
    'process.env': process.env
  },
  build: {
    target: 'esnext',
    outDir: 'dist'
  }
});
