import type {
  Request as CloudflareRequest,
  Response as CloudflareResponse,
  ExecutionContext,
  ExportedHandler,
} from '@cloudflare/workers-types/experimental';
import type { ServerBuild } from 'react-router';
import { createRequestHandler } from 'react-router';
import { getLoadContext, type Env } from '../load-context';
// @ts-ignore - This file is created by running npm run build
import * as build from '../build/server';

const requestHandler = createRequestHandler(build as unknown as ServerBuild);

export default {
  async fetch(request: CloudflareRequest, env: Env, ctx: ExecutionContext): Promise<CloudflareResponse> {
    try {
      const loadContext = getLoadContext({
        request,
        context: {
          cloudflare: {
            cf: request.cf!,
            ctx: {
              waitUntil: ctx.waitUntil.bind(ctx),
              passThroughOnException: ctx.passThroughOnException.bind(ctx),
            },
            caches: caches as any,
            env,
          },
        },
      });

      const response = await requestHandler(request as unknown as Request, loadContext);
      return response as CloudflareResponse;
    } catch (error) {
      console.log(error);
      return new Response('An unexpected error occurred', { status: 500 }) as CloudflareResponse;
    }
  },
} satisfies ExportedHandler<Env>;
