import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // ========== Vercel-Specific Optimizations ==========
  base: '/', // Set to '/your-subdir/' if deploying to subdirectory
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name]-[hash][extname]',
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js'
      }
    }
  },
  // ========== 3D Asset Handling ==========
  assetsInclude: ['**/*.glb', '**/*.gltf', '**/*.jpg', '**/*.png'],
  optimizeDeps: {
    exclude: ['three'], // Better Three.js handling
    include: [
      '@react-three/fiber',
      '@react-three/drei',
    ]
  }
}));
