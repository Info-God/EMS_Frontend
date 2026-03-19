
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import viteCompression from 'vite-plugin-compression'; // Import the plugin
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),tailwindcss(),
    viteCompression({
      algorithm: 'gzip', // Use gzip compression
      ext: '.gz',       // Suffix for the generated files
      threshold: 10240, // Only compress files larger than 10KB
      deleteOriginFile: false, // Keep original files (optional)
    }),
    viteCompression({
      algorithm: 'brotliCompress', // Also generate brotli compressed files
      ext: '.br', // Suffix for brotli files
      threshold: 10240, // Only compress files larger than 10KB
      deleteOriginFile: false, // Keep original files (optional)
    }),
  ],
  // Other Vite configurations (e.g., build options, server options)
  build: {
    outDir: 'dist', // Your output directory
  },
});