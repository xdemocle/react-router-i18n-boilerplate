import type {
  CacheStorage,
  Request as CloudflareRequest,
  ExecutionContext,
} from '@cloudflare/workers-types/experimental';

export interface Env {
  VALUE_FROM_CLOUDFLARE: 'Hello from Cloudflare';
}

type GetLoadContextArgs = {
  request: CloudflareRequest;
  context: {
    cloudflare: {
      cf: CloudflareRequest['cf'];
      ctx: Pick<ExecutionContext, 'waitUntil' | 'passThroughOnException'>;
      caches: CacheStorage;
      env: Env;
    };
  };
};

declare module 'react-router' {
  interface AppLoadContext extends ReturnType<typeof getLoadContext> {
    // This will merge the result of `getLoadContext` into the `AppLoadContext`
  }
}

export const getLoadContext = ({ context }: GetLoadContextArgs) => {
  return context;
};
