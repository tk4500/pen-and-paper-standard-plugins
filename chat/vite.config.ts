import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'index.ts'),
      name: 'ChatPlugin',
      formats: ['es']
    },
    rollupOptions: {
      output: {
        entryFileNames: 'index.js'
      }
    }
  }
});