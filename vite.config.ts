import { cloudflare } from '@cloudflare/vite-plugin'
import { reactRouter } from '@react-router/dev/vite'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import eslint from 'vite-plugin-eslint'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [
    tsconfigPaths(),
    eslint(),
    tailwindcss(),
    !process.env.VITEST && reactRouter(),
    cloudflare({ viteEnvironment: { name: 'ssr' } }),
  ],
})
