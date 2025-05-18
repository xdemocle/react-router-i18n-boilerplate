import { createInstance, type InitOptions } from 'i18next';
import resourcesToBackend from 'i18next-resources-to-backend';
import { initReactI18next } from 'react-i18next';
import { baseConfig, baseServerConfig } from './i18n.config';

export const createServerInstance = () => {
  // Create and configure the i18next instance
  const i18n = createInstance();

  // Server-side i18next configuration
  const serverConfig: InitOptions = {
    ...baseConfig,
    ...baseServerConfig,
  };

  // Initialize i18next instance
  i18n
    .use(initReactI18next)
    .use(
      resourcesToBackend(async (language: string, namespace: string) => {
        try {
          // Load translations from the public directory
          const module = await import(
            `../../public/locales/${language}/${namespace}.json`
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
    .init(serverConfig);

  return i18n;
};
