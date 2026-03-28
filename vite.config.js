import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/mock.js'),
      name: 'Mock',
      formats: ['es', 'umd']
    },
    rollupOptions: {
      external: ['window', 'document'],
      output: {
        entryFileNames: 'mock.js',
        globals: {
          window: 'window',
          document: 'document'
        }
      }
    },
    outDir: 'dist',
    emptyOutDir: true
  }
})
