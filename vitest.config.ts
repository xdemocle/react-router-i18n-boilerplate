import { defineConfig } from '@playwright/test'

export default defineConfig({
  reporter: [['junit', { outputFile: 'junit.xml' }]],
  use: {
    headless: true,
    browserName: 'chromium',
    channel: 'chrome',
  },
})
