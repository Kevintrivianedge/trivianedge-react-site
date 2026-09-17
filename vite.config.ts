import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';

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
  plugins: [
    react(),
    visualizer({
      open: false,
      filename: 'dist/stats.html',
      title: 'TrivianEdge Bundle Analysis',
      template: 'treemap',
      gzipSize: true,
      brotliSize: true,
      sourcemap: false,
    }),
  ],
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
      output: {
        manualChunks: (id) => {
          // Vendor chunks
          if (id.includes('node_modules/react-dom')) return 'vendor-react-dom';
          if (id.includes('node_modules/react')) return 'vendor-react';
          if (id.includes('node_modules/react-router-dom')) return 'vendor-router';
          if (id.includes('node_modules/react-helmet-async')) return 'vendor-helmet';
          if (id.includes('node_modules/lucide-react')) return 'vendor-icons';
          if (id.includes('node_modules/vanilla-cookieconsent')) return 'vendor-cookie';
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
    ],
  },
});
