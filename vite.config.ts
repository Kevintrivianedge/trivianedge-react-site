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
    modulePreload: {
      // index.tsx dynamically imports @amplitude/unified from inside a
      // requestIdleCallback so its ~700KB bundle (analytics + session-replay/
      // rrweb) never blocks first paint. Vite's default modulePreload behavior
      // still emits <link rel="modulepreload"> for every dynamic-import target
      // reachable from the entry point though, which makes the browser fetch
      // it immediately anyway — defeating the deferral entirely. Exclude it
      // (and its internal rrweb sub-chunks) from the auto-generated preload
      // list so it's only ever requested when the idle-callback actually fires.
      resolveDependencies: (_filename, deps) =>
        deps.filter(dep => !dep.includes('amplitude') && !dep.includes('rrweb')),
    },
    rollupOptions: {
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
  },
});
