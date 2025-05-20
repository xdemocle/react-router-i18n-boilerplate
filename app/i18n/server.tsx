import { createInstance, type i18n as i18nType } from 'i18next';
import { LanguageDetector } from 'i18next-http-middleware';
import resourcesToBackend from 'i18next-resources-to-backend';
import { URL } from 'node:url';
import { initReactI18next } from 'react-i18next';
import { baseConfig, clientConfig, fallbackLng, serverConfig } from './config';

export let i18n: i18nType;

const getDefaultLanguage = (request: Request) => {
  const url = new URL(request.url);
  const lng = (url.searchParams.get('lng') as string) || fallbackLng;

  return lng;
};

export const initI18n = async (request: Request) => {
  const lng = getDefaultLanguage(request);

  // Server-side i18next configuration
  const config = {
    ...baseConfig,
    ...clientConfig,
    ...serverConfig,
    lng,
  };

  // Create and configure the i18next instance
  i18n = createInstance();

  // Initialize i18next instance
  i18n
    .use(initReactI18next)
    .use(LanguageDetector)
    .use(
      resourcesToBackend(async (language: string, namespace: string) => {
        try {
          // Load translations from the public directory
          return (await import(`../../public/locales/${language}/${namespace}.json`)).default;
        } catch (error) {
          console.error(`Failed to load translations for ${language}/${namespace}:`, error);
          return {};
        }
      })
    )
    .init(config);

  return i18n;
};
