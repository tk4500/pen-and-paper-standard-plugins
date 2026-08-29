import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'PresencePlugin',
      formats: ['es'],
      fileName: () => 'index.js'
    },
    rollupOptions: {
      output: {
        entryFileNames: 'index.js',
      }
    }
  }
});
