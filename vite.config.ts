// import { cloudflare } from "@cloudflare/vite-plugin";
import { reactRouter } from '@react-router/dev/vite';
import { cloudflareDevProxy } from '@react-router/dev/vite/cloudflare';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import eslint from 'vite-plugin-eslint';
import tsconfigPaths from 'vite-tsconfig-paths';
import { getLoadContext } from './load-context';

export default defineConfig({
  plugins: [
    eslint({
      overrideConfigFile: './.eslintrc.cjs',
    }),
    cloudflareDevProxy({
      getLoadContext,
    }),
    // cloudflare({ viteEnvironment: { name: "ssr" } }),
    tailwindcss(),
    reactRouter(),
    tsconfigPaths(),
  ],
});
