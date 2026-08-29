# Pen and Paper Standard Plugins

This repository contains standard plugins for the Pen and Paper VTT application. It is set up as a multi-entry monorepo using Vite, where each plugin is built as a separate standalone ES module bundle.

## Architecture

- Each plugin lives in its own directory under `src/` (e.g., `src/chat`, `src/library`, `src/sheet`).
- The main entry point for a plugin should be `src/<plugin-name>/index.ts`.
- The build process outputs a separate `.js` file for each plugin in the `dist/` folder (e.g., `dist/chat.js`), compiling down to vanilla ES modules that can be easily loaded via a `<script type="module">` tag in an iframe.

## Adding a New Plugin

1. **Create a Directory**: Create a new folder under `src/` for your plugin (e.g., `src/library`).
2. **Add Source Files**: Add your plugin code, ensuring the main entry file is `src/library/index.ts`.
3. **Expose in Vite Config**: Open `vite.config.ts` and add the new plugin to the `build.rollupOptions.input` object:

   ```typescript
   export default defineConfig({
     build: {
       rollupOptions: {
         input: {
           chat: resolve(__dirname, 'src/chat/index.ts'),
           library: resolve(__dirname, 'src/library/index.ts'), // Add your plugin here
         },
         output: {
           entryFileNames: '[name].js',
           format: 'es'
         }
       }
     }
   });
   ```

4. **Build**: Run `npm run build` to generate the output files. You should see `dist/library.js` created.

## Commands

- `npm run dev` - Run Vite in development mode (if applicable)
- `npm run build` - Compile TypeScript and build all plugins to the `dist/` directory
