import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
    host: true // Permet l'accès depuis d'autres machines sur le réseau local
  },
  build: {
    outDir: 'dist',
    sourcemap: false, // Désactiver les sourcemaps en production
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          // Séparer les dépendances pour un meilleur caching
          vendor: ['react', 'react-dom'],
          charts: ['recharts'],
          icons: ['lucide-react']
        }
      }
    }
  },
  preview: {
    port: 3000,
    open: true
  }
})

