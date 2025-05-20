import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    reporters: [
      ['junit', { outputFile: './junit.xml' }],
    ],
    browser: {
      enabled: true,
      provider: 'playwright',
      instances: [
        { browser: 'chromium' },
      ],
    },
  },
});