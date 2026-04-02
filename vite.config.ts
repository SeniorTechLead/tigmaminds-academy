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
  ],
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
