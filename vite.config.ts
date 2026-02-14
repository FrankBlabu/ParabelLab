import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import electron from 'vite-plugin-electron';
import renderer from 'vite-plugin-electron-renderer';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    electron([
      {
        // Main process entry point
        entry: 'electron/main.ts',
      },
      {
        // Preload script
        entry: 'electron/preload.ts',
        onstart(options) {
          // Notify the Renderer process to reload the page when preload is rebuilt
          options.reload();
        },
      },
    ]),
    renderer(),
  ],
  // Use relative base for Electron builds, absolute for web
  base: mode === 'electron' ? './' : '/',
  build: {
    rollupOptions: {
      output: {
        // Use relative paths for assets in Electron builds
        assetFileNames: 'assets/[name]-[hash][extname]',
      },
    },
  },
}));
