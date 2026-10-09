import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  assetsInclude: ['**/*.glb', '**/*.gltf'],
  build: {
    chunkSizeWarningLimit: 2000,
    rolldownOptions: {                    // ✅ بدل rollupOptions
      output: {
        codeSplitting: {                  // ✅ بدل manualChunks
          groups: [
            { name: 'three', test: /node_modules[\\/]three/ },
            { name: 'r3f', test: /node_modules[\\/]@react-three[\\/](fiber|drei)/ },
            { name: 'postprocessing', test: /node_modules[\\/](@react-three[\\/]postprocessing|postprocessing)/ },
          ],
        },
      },
    },
  },
});