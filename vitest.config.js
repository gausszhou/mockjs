import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['test/node-test.js', 'test/test.coveralls.js'],
    exclude: ['test/test.mock.*.js', 'test/valid.js', 'test/materiels/**'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html']
    }
  }
})
