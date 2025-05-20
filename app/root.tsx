import { useTranslation } from 'react-i18next'
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  useLoaderData,
  type LoaderFunctionArgs,
  type MetaFunction,
} from 'react-router'
import pkg from '../package.json'
import type { Route } from './+types/root'
import { fallbackLng } from './i18n/config'
import { initI18n } from './i18n/server'
import './tailwind.css'

export const meta: MetaFunction = () => {
  return [
    {
      title: pkg.name,
    },
    {
      name: 'description',
      content: pkg.description,
    },
  ]
}

export async function loader({ request }: LoaderFunctionArgs) {
  const i18n = await initI18n(request)
  const locale = i18n.language || fallbackLng

  return {
    locale,
  }
}

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
]

export function Layout({ children }: { children: React.ReactNode }) {
  const { i18n } = useTranslation()
  const { locale } = useLoaderData<typeof loader>() || { locale: fallbackLng }

  return (
    <html lang={locale} dir={i18n.dir(locale)} suppressHydrationWarning={true}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        <link
          rel="icon"
          href="/favicon-light.png"
          type="image/png"
          media="(prefers-color-scheme: light)"
        />
        <link
          rel="icon"
          href="/favicon-dark.png"
          type="image/png"
          media="(prefers-color-scheme: dark)"
        />
        <meta name="theme-color" content="#000000" />
        <link rel="apple-touch-icon" href="/logo192.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="format-detection" content="telephone=no, date=no, email=no, address=no" />
      </head>
      <body suppressHydrationWarning={true}>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

export default function App() {
  return <Outlet />
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = 'Oops!'
  let details = 'An unexpected error occurred.'
  let stack: string | undefined

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? '404 - Page Not Found' : 'Error'
    details =
      error.status === 404 ? 'The requested page could not be found.' : error.statusText || details
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message
    stack = error.stack
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <h3>{details}</h3>

      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  )
}

export function HydrateFallback() {
  return (
    <div id="loading-splash">
      <div id="loading-splash-spinner" />
      <p>Hydrating, please wait...</p>
    </div>
  )
}
