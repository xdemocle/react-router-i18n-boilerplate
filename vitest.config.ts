import { defineWorkersConfig } from '@cloudflare/vitest-pool-workers/config'

export default defineWorkersConfig({
  test: {
    environment: 'node',
    globals: true,
    // exclude: [
    //   '**/node_modules/**',
    //   '**/build/**',
    //   '**/cypress/**',
    //   '**/.{idea,git,cache,output,temp}/**',
    //   '**/workers/**',
    // ],
    reporters: [['junit', { outputFile: 'junit.xml' }], 'verbose'],
    workspace: ['./vitest.config.{unit,browser}.ts'],
    poolOptions: {
      workers: {
        wrangler: { configPath: './wrangler.jsonc' },
      },
    },
  },
})
