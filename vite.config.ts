import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  server: {
    port: 3000,
    host: '0.0.0.0',
    proxy: {
      '/api': {
        target: 'http://localhost:8787',
        changeOrigin: true,
      },
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
  build: {
    // Target modern browsers to avoid unnecessary transpilation/polyfill overhead.
    target: 'es2020',
    sourcemap: false,
    rollupOptions: {
      // @google/genai is only used in the Cloudflare Worker (src/worker.ts) which
      // is built separately via wrangler. Marking it external prevents it from
      // being accidentally included in the browser bundle.
      external: ['@google/genai'],
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          motion: ['framer-motion'],
          icons: ['lucide-react'],
          seo: ['react-helmet-async'],
          amplitude: ['@amplitude/unified'],
        },
      },
    },
    cssCodeSplit: true,
    minify: 'esbuild',
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-helmet-async'],
    // Exclude the server-only package from dependency pre-bundling.
    exclude: ['@google/genai'],
  },
});
