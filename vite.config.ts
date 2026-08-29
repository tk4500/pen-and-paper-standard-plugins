import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        chat: resolve(__dirname, 'src/chat/index.ts'),
      },
      output: {
        entryFileNames: '[name].js',
        format: 'es'
      }
    }
  }
});
