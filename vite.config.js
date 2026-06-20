import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const backendUrl = env.REACT_APP_BE_URL || 'http://localhost:3016';

  return {
    plugins: [react()],
    envPrefix: ['VITE_', 'REACT_APP_'],
    resolve: {
      alias: { '@': path.resolve(__dirname, './src') },
    },
    server: {
      proxy: {
        '/api': { target: backendUrl, changeOrigin: true },
        '^/(image|cover_front|cover_back)-': { target: backendUrl, changeOrigin: true },
      },
    },
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: ['./src/test-setup.ts'],
      include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
      alias: { '@': path.resolve(__dirname, './src') },
    },
  };
});
