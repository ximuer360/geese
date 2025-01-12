import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  optimizeDeps: {
    include: [
      '@bytemd/vue-next',
      '@bytemd/plugin-gfm',
      '@bytemd/plugin-highlight',
      'bytemd'
    ]
  },
  server: {
    port: 5173
  }
}); 