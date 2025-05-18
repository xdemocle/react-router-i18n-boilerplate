import { createInstance } from 'i18next';
import resourcesToBackend from 'i18next-resources-to-backend';
import { isbot } from 'isbot';
import { renderToReadableStream } from 'react-dom/server';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import type { EntryContext } from 'react-router';
import { ServerRouter } from 'react-router';
import { baseClientConfig } from './i18n/config';
import i18n from './i18n/server';

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  routerContext: EntryContext
) {
  let shellRendered = false;
  const instance = createInstance();
  const userAgent = request.headers.get('user-agent');

  // Then we could detect locale from the request
  const lng = await i18n.getLocale(request);
  // And here we detect what namespaces the routes about to render want to use
  const ns = i18n.getRouteNamespaces(routerContext);

  // First, we create a new instance of i18next so every request will have a
  // completely unique instance and not share any state.
  await instance
    .use(initReactI18next) // Tell our instance to use react-i18next
    .use(
      resourcesToBackend(async (language: string, namespace: string) => {
        try {
          // Load translations from the public directory
          const module = await import(
            `../public/locales/${language}/${namespace}.json`
          );
          return module.default;
        } catch (error) {
          console.error(
            `Failed to load translations for ${language}/${namespace}:`,
            error
          );
          return {};
        }
      })
    )
    .init({
      ...baseClientConfig, // use the same configuration as in your client side.
      lng, // The locale we detected above
      ns, // The namespaces the routes about to render want to use
    });

  const body = await renderToReadableStream(
    <I18nextProvider i18n={instance}>
      <ServerRouter context={routerContext} url={request.url} />
    </I18nextProvider>,
    {
      onError(error: unknown) {
        responseStatusCode = 500;
        // Log streaming rendering errors from inside the shell.  Don't log
        // errors encountered during initial shell rendering since they'll
        // reject and get logged in handleDocumentRequest.
        if (shellRendered) {
          console.error(error);
        }
      },
    }
  );

  shellRendered = true;

  // Ensure requests from bots and SPA Mode renders wait for all content to load before responding
  // https://react.dev/reference/react-dom/server/renderToPipeableStream#waiting-for-all-content-to-load-for-crawlers-and-static-generation
  if ((userAgent && isbot(userAgent)) || routerContext.isSpaMode) {
    await body.allReady;
  }

  responseHeaders.set('Content-Type', 'text/html');

  return new Response(body, {
    headers: responseHeaders,
    status: responseStatusCode,
  });
}
