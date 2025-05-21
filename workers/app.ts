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
  () => {
    if (process.env.NODE_ENV === 'test' || process.env.VITEST) {
      return {} as ServerBuild
    }

    // eslint-disable-next-line import/no-unresolved
    return import('virtual:react-router/server-build')
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
