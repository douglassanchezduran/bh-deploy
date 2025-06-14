import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// @ts-expect-error process is a nodejs global
const host = process.env.TAURI_DEV_HOST;

// https://vitejs.dev/config/
export default defineConfig(async () => ({
  plugins: [react()],
  resolve: {
    alias: {
      // Asegúrate de que estos alias coincidan con los que definiste en tsconfig.json
      '@components': resolve(__dirname, 'src/shared/components'),
      '@layout': resolve(__dirname, 'src/shared/layout'),
      '@assets': resolve(__dirname, 'src/shared/assets'),
      '@utils': resolve(__dirname, 'src/shared/utils'),
      '@app-types': resolve(__dirname, 'src/shared/types'),
      '@features': resolve(__dirname, 'src/features'),
    },
  },
  // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
  //
  // 1. prevent vite from obscuring rust errors
  clearScreen: false,
  // 2. tauri expects a fixed port, fail if that port is not available
  server: {
    port: 1420,
    strictPort: true,
    host: host || false,
    hmr: host
      ? {
          protocol: 'ws',
          host,
          port: 1421,
        }
      : undefined,
    watch: {
      // 3. tell vite to ignore watching `src-tauri`
      ignored: ['**/src-tauri/**'],
    },
  },
}));
