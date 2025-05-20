import type {
  CacheStorage,
  CfProperties,
  Request as CloudflareRequest,
  ExecutionContext,
} from '@cloudflare/workers-types/experimental';

export interface Env {
  VALUE_FROM_CLOUDFLARE: 'Hello from Cloudflare';
}

type GetLoadContextArgs = {
  request: Request | CloudflareRequest;
  context: {
    cloudflare?: {
      cf?: CfProperties;
      ctx?: Pick<ExecutionContext, 'waitUntil' | 'passThroughOnException'>;
      caches?: CacheStorage;
      env?: Env;
    };
  };
};

declare module 'react-router' {
  interface AppLoadContext extends ReturnType<typeof getLoadContext> {
    // This will merge the result of `getLoadContext` into the `AppLoadContext`
  }
}

export const getLoadContext = ({ context }: GetLoadContextArgs) => {
  return {
    cloudflare: context.cloudflare || {
      cf: {},
      ctx: {
        waitUntil: () => {},
        passThroughOnException: () => {},
      },
      caches: {} as CacheStorage,
      env: { VALUE_FROM_CLOUDFLARE: 'Hello from Cloudflare' } as Env,
    },
  };
};
