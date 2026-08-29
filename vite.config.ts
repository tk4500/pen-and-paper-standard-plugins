import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/chat/ChatPlugin.ts'),
      name: 'ChatPlugin',
      fileName: 'chat-plugin',
      formats: ['iife']
    },
    rollupOptions: {
      // Ensure we don't externalize dependencies so it's a standalone plugin bundle
      external: [],
    }
  }
});