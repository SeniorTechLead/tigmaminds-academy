import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { writeFileSync } from 'fs';

// https://vitejs.dev/config/
// Generate a version hash at build time
const buildVersion = Date.now().toString(36);

export default defineConfig({
  define: {
    __APP_VERSION__: JSON.stringify(buildVersion),
  },
  plugins: [
    react(),
    {
      name: 'version-file',
      writeBundle() {
        writeFileSync('dist/version.json', JSON.stringify({ version: buildVersion }));
      },
    },
    {
      name: 'reload-data-files',
      handleHotUpdate({ file, server }) {
        // Large data files (lessons, problems, references) can stall HMR —
        // force a full page reload instead of trying hot module replacement
        if (file.includes('/src/data/') && (file.endsWith('.ts') || file.endsWith('.tsx'))) {
          console.log(`[reload-data-files] forcing reload for: ${file.split('/').pop()}`);
          server.ws.send({ type: 'full-reload' });
          return [];
        }
      },
    },
  ],
  server: {
    hmr: {
      timeout: 10000,
    },
    watch: {
      usePolling: false,
    },
  },
  optimizeDeps: {
    include: ['lucide-react'],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-supabase': ['@supabase/supabase-js'],
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'data-lessons': ['./src/data/lessons.ts', './src/data/lessons-mythology.ts'],
        },
      },
    },
  },
});
