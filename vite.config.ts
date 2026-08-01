
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    outDir: 'dist',
    rollupOptions: {
      output: {
        // Enable code splitting for better bundle loading
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'state-management': ['@reduxjs/toolkit', 'react-redux'],
          'ui-components': ['lucide-react', 'tailwindcss', 'framer-motion'],
          'api-client': ['axios', 'laravel-echo', 'pusher-js'],
        },
      },
    },
    chunkSizeWarningLimit: 300,
  },
});