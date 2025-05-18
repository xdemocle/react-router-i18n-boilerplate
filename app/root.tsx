import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from 'react-router';
import type { Route } from './+types/root';
import './app.css';
import remixI18n from './i18n/server';
// import { useTranslation } from 'react-i18next';
// import { useChangeLanguage } from 'remix-i18next/react';

export const loader = async ({ request }: { request: Request }) => {
  const locale = await remixI18n.getLocale(request);

  return Response.json({ locale });
};

export const links: Route.LinksFunction = () => [
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  {
    rel: 'preconnect',
    href: 'https://fonts.gstatic.com',
    crossOrigin: 'anonymous',
  },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap',
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  // const { i18n } = useTranslation();
  const { locale } = useLoaderData();

  // This hook will change the i18n instance language to the current locale
  // detected by the loader, this way, when we do something to change the
  // language, this locale will change and i18next will load the correct
  // translation files
  // useChangeLanguage(locale);

  return (
    <html
      lang={locale}
      // dir={remixI18n.dir(locale)}
      // lang={i18n.language}
      // dir={i18n.dir(i18n.language)}
      suppressHydrationWarning={true}
    >
      <head>
        <meta charSet='utf-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <Meta />
        <Links />
        <link
          rel='icon'
          href='/favicon-light.png'
          type='image/png'
          media='(prefers-color-scheme: light)'
        />
        <link
          rel='icon'
          href='/favicon-dark.png'
          type='image/png'
          media='(prefers-color-scheme: dark)'
        />
        <meta name='theme-color' content='#000000' />
        <meta name='description' content='My beautiful React app' />
        <link rel='apple-touch-icon' href='/logo192.png' />
        <link rel='manifest' href='/manifest.json' />
        <meta
          name='format-detection'
          content='telephone=no, date=no, email=no, address=no'
        />
        <title>My React App</title>
      </head>
      <body suppressHydrationWarning={true}>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = 'Oops!';
  let details = 'An unexpected error occurred.';
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? '404' : 'Error';
    details =
      error.status === 404
        ? 'The requested page could not be found.'
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className='pt-16 p-4 container mx-auto'>
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className='w-full p-4 overflow-x-auto'>
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}

// export async function clientLoader() {
// //   const data = await fakeLoadLocalGameData();
//   return {};
// }

// export function HydrateFallback() {
//   return <p>Loading Game...</p>;
// }

// export default function Component({ loaderData }) {
//   return <Game data={loaderData} />;
// }

// existing imports & exports

export function HydrateFallback() {
  return (
    <div id='loading-splash'>
      <div id='loading-splash-spinner' />
      <p>Hydrating, please wait...</p>
    </div>
  );
}
