import { createInstance, type i18n as i18nType, type InitOptions } from 'i18next'
import { LanguageDetector, type LanguageDetectorOptions } from 'i18next-http-middleware'
import resourcesToBackend from 'i18next-resources-to-backend'
import { baseConfig, clientConfig, debug, fallbackLng, serverConfig } from './config'

export let i18n: i18nType

const detectionConfig: LanguageDetectorOptions = {
  caches: debug ? undefined : [fallbackLng],
  lookupQuerystring: 'lng',
  // lookupLocalStorage: 'i18nextLng',
  // lookupSessionStorage: 'i18nextLng',
  lookupFromPathIndex: 0,
  order: [
    'querystring',
    'cookie',
    // 'sessionStorage',
    // 'localStorage',
    // 'navigator',
    // 'htmlTag',
  ],
}

const getDefaultLanguage = (request: Request) => {
  const url = new URL(request.url)
  const lng = (url.searchParams.get('lng') as string) || fallbackLng

  return lng
}

export const initI18n = async (request: Request) => {
  const lng = getDefaultLanguage(request)

  // Server-side i18next configuration
  const config = {
    ...baseConfig,
    ...clientConfig,
    ...serverConfig,
    detection: { ...detectionConfig } as InitOptions['detection'],
    lng,
  }

  // Create and configure the i18next instance
  i18n = createInstance()

  // Initialize i18next instance
  await i18n
    .use(LanguageDetector)
    .use(
      resourcesToBackend(async (language: string, namespace: string) => {
        try {
          // Load translations from the public directory
          return (await import(`../../public/locales/${language}/${namespace}.json`)).default
        } catch (error) {
          console.error(`Failed to load translations for ${language}/${namespace}:`, error)
          return {}
        }
      })
    )
    .init(config)

  // i18n.changeLanguage(i18n.language);
  console.log('i18n.resolvedLanguage', i18n.resolvedLanguage)

  return i18n
}
