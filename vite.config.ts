import { defineConfig } from 'vite'

export default defineConfig(({ mode }) => ({
    build: {
        lib: {
            entry: 'src/mock.ts',
            name: 'Mock',
            formats: ['umd'],
            fileName: (format) => 'mock' + (mode === 'minify' ? '-min' : '') + '.js',
        },
        outDir: 'dist',
        emptyOutDir: mode === 'minify' ? false : true,
        minify: mode === 'minify' ? 'esbuild' : false,
        sourcemap: mode === 'minify',
    },
}))
