import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/mock.js'),
      name: 'Mock',
      formats: ['umd']
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
