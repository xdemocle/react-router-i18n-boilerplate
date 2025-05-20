import { startTransition, StrictMode } from 'react'
import { hydrateRoot } from 'react-dom/client'
import { I18nextProvider } from 'react-i18next'
import { HydratedRouter } from 'react-router/dom'
import { initializeI18n } from './i18n/client'

// Initialize i18next before hydration
initializeI18n()
  .then(async (i18next) => {
    console.debug('entry.client: i18next initialized')
    console.log('entry.client: i18next.language', i18next.language)

    startTransition(() => {
      hydrateRoot(
        document,
        <StrictMode>
          <I18nextProvider i18n={i18next}>
            <HydratedRouter />
          </I18nextProvider>
        </StrictMode>
      )
    })
  })
  .catch((error) => {
    console.error('entry.client: Failed to initialize i18next:', error)

    // Still hydrate the app even if i18next fails
    startTransition(() => {
      hydrateRoot(
        document,
        <StrictMode>
          <HydratedRouter />
        </StrictMode>
      )
    })
  })
