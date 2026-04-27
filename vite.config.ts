import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  server: {
    port: 5173,
    host: true,
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
    minify: 'esbuild',
    cssMinify: true,
    reportCompressedSize: false,
    assetsInlineLimit: 4096,
    rollupOptions: {
      // @google/genai is only used in the Cloudflare Worker (src/worker.ts) which
      // is built separately via wrangler. Marking it external prevents it from
      // being accidentally included in the browser bundle.
      external: ['@google/genai'],
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom'],
          'vendor-router': ['react-router-dom'],
          'vendor-motion': ['framer-motion'],
          'vendor-helmet': ['react-helmet-async'],
          'vendor-icons': ['lucide-react'],
          amplitude: ['@amplitude/unified'],
        },
      },
    },
    cssCodeSplit: true,
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'react-helmet-async',
      'framer-motion',
    ],
    // Exclude the server-only package from dependency pre-bundling.
    exclude: ['@google/genai'],
  },
});
