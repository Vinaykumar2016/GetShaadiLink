import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
    build: {
      target: "esnext", // Modern ES targets to avoid legacy transpilation code bloating the bundles
      cssCodeSplit: true,
      chunkSizeWarningLimit: 800,
      rollupOptions: {
        output: {
          manualChunks(id) {
            // Split react framework, framer-motion, and lucide-react into vendor chunks
            if (id.includes("node_modules")) {
              if (id.includes("react") || id.includes("scheduler")) {
                return "vendor-react";
              }
              if (id.includes("framer-motion")) {
                return "vendor-motion";
              }
              if (id.includes("lucide")) {
                return "vendor-icons";
              }
              return "vendor-libs";
            }
          }
        }
      }
    }
  };
});
