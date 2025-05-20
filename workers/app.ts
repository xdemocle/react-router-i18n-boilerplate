import { createRequestHandler, type ServerBuild } from 'react-router'

declare module 'react-router' {
  export interface AppLoadContext {
    cloudflare: {
      env: Env
      ctx: ExecutionContext
    }
  }
}

const requestHandler = createRequestHandler(
  async () => {
    if (import.meta.env.MODE === 'development') {
      return import('virtual:react-router/server-build')
    }

    // eslint-disable-next-line import/no-unresolved
    // @ts-expect-error This file is created by running npm run build
    const serverBuild = await import('../build/server/index.js')

    return Promise.resolve(serverBuild as unknown as ServerBuild)
  },
  import.meta.env.MODE
)

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url)

    if (
      url.pathname.startsWith('/assets/') ||
      url.pathname.startsWith('/locales/') ||
      url.pathname.startsWith('/favicon') ||
      url.pathname.startsWith('/robots.txt')
    ) {
      return env.ASSETS.fetch(request)
    }

    return requestHandler(request, {
      cloudflare: { env, ctx },
    })
  },
} satisfies ExportedHandler<Env>
