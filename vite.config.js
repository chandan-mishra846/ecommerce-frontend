import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@components': resolve(__dirname, './src/components'),
      '@features': resolve(__dirname, './src/features'),
      '@utils': resolve(__dirname, './src/utils')
    },
    extensions: ['.js', '.jsx', '.json']
  },
  server: {
    port: 5175,
    proxy: {
      '/api': {
        target: 'http://localhost:8003',
        changeOrigin: true,
        secure: false,
        ws: true
      }
    }
  },
  // Add polyfills for node modules
  define: {
    'process.env': {}
  }
});