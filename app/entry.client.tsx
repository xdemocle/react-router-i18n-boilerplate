import { startTransition, StrictMode } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { I18nextProvider } from 'react-i18next';
import { HydratedRouter } from 'react-router/dom';
import { initializeI18n } from './i18n/client';

// Initialize i18next before hydration
initializeI18n()
  .then((i18next) => {
    console.debug('i18n entry.client: i18next initialized');

    startTransition(() => {
      hydrateRoot(
        document,
        <StrictMode>
          <I18nextProvider i18n={i18next}>
            <HydratedRouter />
          </I18nextProvider>
        </StrictMode>
      );
    });
  })
  .catch((error) => {
    console.error('i18n entry.client: Failed to initialize i18next:', error);

    // Still hydrate the app even if i18next fails
    startTransition(() => {
      hydrateRoot(
        document,
        <StrictMode>
          <HydratedRouter />
        </StrictMode>
      );
    });
  });
