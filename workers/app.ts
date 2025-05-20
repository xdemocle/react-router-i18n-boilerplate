import { createRequestHandler } from 'react-router'

declare module 'react-router' {
  export interface AppLoadContext {
    cloudflare: {
      env: Env
      ctx: ExecutionContext
    }
  }
}

const requestHandler = createRequestHandler(
  // eslint-disable-next-line import/no-unresolved
  () => import('virtual:react-router/server-build'),
  import.meta.env.MODE
)

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url)

    if (
      url.pathname.startsWith('/assets/') ||
      url.pathname.startsWith('/locales/') ||
      url.pathname.startsWith('/favicon') ||
      url.pathname.startsWith('/robots.txt') ||
      url.pathname.startsWith('/manifest.json')
    ) {
      return env.ASSETS.fetch(request)
    }

    return requestHandler(request, {
      cloudflare: { env, ctx },
    })
  },
} satisfies ExportedHandler<Env>
