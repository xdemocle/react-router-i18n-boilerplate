import { defineConfig } from 'vitest/config'

/**
 * @type {import('vitest/config').UserConfig}
 * @name 'unit'
 * @enviroment 'node' | 'edge-runtime'
 */
export default defineConfig({
  test: {
    name: 'unit',
    environment: 'node',
    globals: true,
    include: ['tests/unit/**/*.test.ts'],
  },
})
