import { isbot } from 'isbot';
import { renderToReadableStream } from 'react-dom/server';
import { I18nextProvider } from 'react-i18next';
import type { EntryContext } from 'react-router';
import { ServerRouter } from 'react-router';
import { i18n } from './i18n/server';

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  routerContext: EntryContext
) {
  // Initialize i18next for this request
  const userAgent = request.headers.get('user-agent');
  const isBot = userAgent && isbot(userAgent);

  let hustonWeHaveAProblem = false;

  try {
    const stream = await renderToReadableStream(
      <I18nextProvider i18n={i18n}>
        <ServerRouter context={routerContext} url={request.url} />
      </I18nextProvider>,
      {
        onError(error) {
          console.error('Error during rendering:', error);
          hustonWeHaveAProblem = true;
        },
        bootstrapScriptContent: `window.ENV = ${JSON.stringify({
          LANGUAGE: i18n.language,
          NAMESPACES: Object.keys(i18n.options.ns || {}),
        })};
        `,
      }
    );

    if (isBot) {
      await stream.allReady;
    }

    return new Response(stream, {
      status: hustonWeHaveAProblem ? 500 : responseStatusCode,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error('Fatal rendering error:', error);

    return new Response('<!DOCTYPE html><html><body><h1>Internal Server Error</h1></body></html>', {
      status: 500,
      headers: { 'Content-Type': 'text/html' },
    });
  }
}
