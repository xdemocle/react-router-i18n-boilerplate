import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

/**
 * @type {import('vitest/config').UserConfig}
 * @name 'browser'
 * @enviroment 'node' | 'jsdom' | 'happy-dom' | 'edge-runtime'
 * @instances at least one instance is required [{ browser: 'chromium', headless: true }]
 * @browser.provider 'playwright' | 'webdriverio'
 */
export default defineConfig({
  plugins: [react()],
  test: {
    name: 'browser',
    environment: 'jsdom',
    globals: true,
    include: ['tests/spec/**/*.spec.tsx'],
    browser: {
      provider: 'playwright',
      enabled: true,
      instances: [{ browser: 'chromium', headless: true }],
    },
  },
})
