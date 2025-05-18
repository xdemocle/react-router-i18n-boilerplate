import i18next from 'i18next';
import I18nextBrowserLanguageDetector from 'i18next-browser-languagedetector';
import HttpBackend from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';
import {
  baseConfig,
  baseClientConfig,
  detectionConfig,
  namespaces,
  fallbackLng,
  defaultNS,
} from './config';

// Use HTTP backend for client-side
const backend = HttpBackend;

/**
 * Initialize i18next with all required configurations
 * This is the central initialization function for i18next
 */
export async function initializeI18n() {
  // Check if already initialized
  if (i18next.isInitialized) {
    return i18next;
  }

  try {
    // Initialize with basic configuration first
    await i18next
      .use(initReactI18next)
      .use(backend)
      .use(I18nextBrowserLanguageDetector)
      .init({
        ...baseConfig,
        ...baseClientConfig,
        detection: detectionConfig,
      });

    // Load initial translations
    const currentLang = i18next.language || 'en';
    await Promise.all(
      namespaces.map((ns: string) =>
        i18next.loadNamespaces(ns).then(() => {
          console.debug(`Loaded namespace ${ns} for language ${currentLang}`);
        })
      )
    );

    console.log('i18next initialization complete');
    return i18next;
  } catch (error) {
    console.error('Failed to initialize i18next:', error);
    // Initialize with fallback configuration
    await i18next.init({
      ...baseConfig,
      lng: fallbackLng,
      ns: [defaultNS],
      resources: {
        [fallbackLng]: {
          [defaultNS]: {},
        },
      },
    });

    return i18next;
  }
}

// Initialize and export i18next instance for direct usage
export const i18n = i18next;
