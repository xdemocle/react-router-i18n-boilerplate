// import { defineWorkersConfig } from '@cloudflare/vitest-pool-workers/dist/config'
import { defineConfig } from 'vitest/config'

export default defineConfig({
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
  },
})

// deps: {
//   optimizer: {
//     ssr: {
//       enabled: true,
//       include: ["discord-api-types/v10", "@microlabs/otel-cf-workers"],
//     },
//   },
// },

// poolOptions: {
//   workers: {
//     wrangler: { configPath: './wrangler.jsonc' },
//   },
// },
